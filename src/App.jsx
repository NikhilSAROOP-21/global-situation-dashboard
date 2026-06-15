import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import * as THREE from 'three'
import './App.css'

function App() {
  const globeRef = useRef()
  const containerRef = useRef()

  const [countries, setCountries] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 })
  const [iss, setIss] = useState([])
  const [earthquakes, setEarthquakes] = useState([])

  const events = [
    {
      lat: 35.6762,
      lng: 139.6503,
      size: 0.5,
      color: '#ff3b3b',
      title: 'Tokyo Event',
      type: 'Earthquake',
      location: 'Tokyo, Japan',
      details: 'Magnitude 5.8 earthquake detected near Tokyo.',
      time: '12 minutes ago'
    },
    {
      lat: 51.5072,
      lng: -0.1276,
      size: 0.45,
      color: '#ffaa00',
      title: 'London Outage',
      type: 'Internet Outage',
      location: 'London, UK',
      details: 'Possible service disruption affecting multiple networks.',
      time: '28 minutes ago'
    },
    {
      lat: -29.8587,
      lng: 31.0218,
      size: 0.45,
      color: '#7CFF6B',
      title: 'Durban Alert',
      type: 'Local Alert',
      location: 'Durban, South Africa',
      details: 'Sample event marker for your dashboard.',
      time: 'Live'
    }
  ]


  const [satellites, setSatellites] = useState([])

useEffect(() => {
  const fetchISS = async () => {
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
      const data = await response.json()

      setIss([
        {
          lat: data.latitude,
          lng: data.longitude,
          size: 1.2,
          color: '#ffffff',
          title: 'International Space Station',
          type: 'Space Object',
          location: 'Low Earth Orbit',
          details: `Altitude: ${Math.round(data.altitude)} km | Speed: ${Math.round(data.velocity)} km/h`,
          time: 'Live'
        }
      ])
    } catch (error) {
      console.log('ISS data error:', error)
    }
  }

  fetchISS()

  const interval = setInterval(fetchISS, 5000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const fetchEarthquakes = async () => {
    try {
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
      )

      const data = await response.json()

      const earthquakeEvents = data.features.map((quake) => {
        const [lng, lat, depth] = quake.geometry.coordinates
        const magnitude = quake.properties.mag

        return {
          lat,
          lng,
          size: Math.max(0.25, magnitude / 8),
          color: magnitude >= 5 ? '#ff3b3b' : '#ffaa00',
          title: `M${magnitude} Earthquake`,
          type: 'Earthquake',
          location: quake.properties.place,
          details: `Depth: ${Math.round(depth)} km`,
          time: new Date(quake.properties.time).toLocaleString()
        }
      })

      setEarthquakes(earthquakeEvents)
    } catch (error) {
      console.log('Earthquake data error:', error)
    }
  }

  fetchEarthquakes()

  const interval = setInterval(fetchEarthquakes, 60000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const createSatellites = () => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      lat: Math.sin(i * 0.45) * 55,
      lng: (i * 18) % 360,
      altitude: 0.22,
      label: `Starlink-${i + 1}`,
      speed: 0.03 + Math.random() * 0.05
    }))
  }

  setSatellites(createSatellites())
}, [])

useEffect(() => {
  const interval = setInterval(() => {
    setSatellites(prevSatellites =>
      prevSatellites.map(sat => ({
        ...sat,
        lng: (sat.lng + sat.speed) % 360,
        lat: Math.sin((sat.lng + sat.speed) * 0.04 + sat.id) * 55
      }))
    )
  }, 100)

  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(worldData => {
        const countryFeatures = topojson.feature(
          worldData,
          worldData.objects.countries
        ).features

        setCountries(countryFeatures)
      })
  }, [])

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return

      setGlobeSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

  
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (!globeRef.current) return

    const controls = globeRef.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableZoom = true
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    globeRef.current.pointOfView({ lat: 0, lng: 20, altitude: 2.2 })

    let rotationTimeout

    const pauseRotation = () => {
      controls.autoRotate = false
      clearTimeout(rotationTimeout)

      rotationTimeout = setTimeout(() => {
        controls.autoRotate = true
      }, 1000)
    }

    const canvas = globeRef.current.renderer().domElement
    canvas.addEventListener('pointerdown', pauseRotation)
    canvas.addEventListener('wheel', pauseRotation)

    return () => {
      canvas.removeEventListener('pointerdown', pauseRotation)
      canvas.removeEventListener('wheel', pauseRotation)
      clearTimeout(rotationTimeout)
    }
  }, [])

  const selectEvent = (event) => {
  setSelectedEvent(event)

  if (globeRef.current) {
    const controls = globeRef.current.controls()
    controls.autoRotate = false

    globeRef.current.pointOfView(
      {
        lat: event.lat,
        lng: event.lng,
        altitude: 1.6
      },
      1000
    )
  }
}

  return (
    <div className="dashboard">
      <aside className="panel rightPanel">
  <h2>LIVE EVENTS</h2>

  <div className="sectionTitle">GENERAL</div>
  {events.map((event, index) => (
    <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
      <strong>{event.title}</strong>
      <span>{event.time}</span>
    </div>
  ))}

  <div className="sectionTitle">EARTHQUAKES</div>
  <div className="scrollList">
    {earthquakes.map((event, index) => (
      <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
        <strong>{event.title}</strong>
        <span>{event.location}</span>
      </div>
    ))}
  </div>

  <div className="sectionTitle">SPACE</div>
  {iss.map((event, index) => (
    <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
      <strong>{event.title}</strong>
      <span>{event.time}</span>
    </div>
  ))}
</aside>

      <main className="globeArea" ref={containerRef}>
        <h1>GLOBAL SITUATION DASHBOARD</h1>

        <Globe
          ref={globeRef}
          width={globeSize.width}
          height={globeSize.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

          polygonsData={countries}
          polygonCapColor={() => 'rgba(0,0,0,0)'}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={() => '#707070'}
          polygonAltitude={0.001}

          pointsData={[...events, ...earthquakes, ...iss]}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.035}
          pointRadius="size"
          pointLabel="title"
          onPointClick={selectEvent}

          objectsData={satellites}
          objectLat="lat"
          objectLng="lng"
          objectAltitude="altitude"
          objectLabel="label"
          objectThreeObject={() => {
            const geometry = new THREE.SphereGeometry(0.45)
            const material = new THREE.MeshBasicMaterial({ color: '#d0d0d0' })
            return new THREE.Mesh(geometry, material)
          }}
        />

        {selectedEvent && (
          <div className="popup">
            <button onClick={() => {
  setSelectedEvent(null)
  if (globeRef.current) {
    globeRef.current.controls().autoRotate = true
  }
}}>×</button>
            <h3>{selectedEvent.title}</h3>
            <p><strong>Type:</strong> {selectedEvent.type}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p>{selectedEvent.details}</p>
          </div>
        )}
      </main>

      <aside className="panel rightPanel">
  <h2>EVENT DETAILS</h2>

  {selectedEvent ? (
    <>
      <div className="sectionTitle">SELECTED EVENT</div>

      <div className="card detailCard">
        <strong>{selectedEvent.title}</strong>
        <span>{selectedEvent.type}</span>
        <span>{selectedEvent.location}</span>
        <span>{selectedEvent.time}</span>
        <p>{selectedEvent.details}</p>
      </div>

      <button
        className="clearButton"
        onClick={() => {
          setSelectedEvent(null)
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = true
          }
        }}
      >
        Deselect Event
      </button>
    </>
  ) : (
    <>
      <div className="sectionTitle">STATUS</div>
      <div className="card">No event selected</div>

      <div className="sectionTitle">DATA FEEDS</div>
      <div className="card">Earthquakes: Live</div>
      <div className="card">ISS: Live</div>
      <div className="card">Starlink: Simulation</div>
    </>
  )}
</aside>
    </div>
  )
}

export default App