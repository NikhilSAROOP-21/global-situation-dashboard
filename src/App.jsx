import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import * as THREE from 'three'
import './App.css'
import * as satellite from 'satellite.js'

function App() {
  const globeRef = useRef()
  const containerRef = useRef()
  const [countries, setCountries] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 })
  const [iss, setIss] = useState([])
  const [earthquakes, setEarthquakes] = useState([])
  const [issTrail, setIssTrail] = useState([])
  const [spaceWeather, setSpaceWeather] = useState(null)
  const [satellites, setSatellites] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [globalAlerts, setGlobalAlerts] = useState([])
  const [volcanoes, setVolcanoes] = useState([])
  const [cves, setCves] = useState([])
  const [kevAlerts, setKevAlerts] = useState([])
  const [internetOutages, setInternetOutages] = useState([])
  const [bgpAlerts, setBgpAlerts] = useState([])
  

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

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const response = await fetch(
          'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
        )
        const data = await response.json()
        const latest = data[data.length - 1]
        setSpaceWeather({
          time: latest[0],
          kpIndex: latest[1],
          status:
            Number(latest[1]) >= 7
              ? 'Strong geomagnetic storm'
              : Number(latest[1]) >= 5
              ? 'Geomagnetic storm'
              : Number(latest[1]) >= 4
              ? 'Active'
              : 'Quiet'
        })
      } catch (error) {
        console.log('Space weather error:', error)
      }
    }

    fetchSpaceWeather()
    const interval = setInterval(fetchSpaceWeather, 300000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let satrec = null
    let tleInterval = null
    let updateInterval = null

    const fetchTLE = async () => {
      try {
        const res = await fetch('/tle')
        const text = await res.text()
        if (text.includes('25544')) {
          const lines = text.trim().split('\n')
          if (lines.length >= 3) {
            const newSatrec = satellite.twoline2satrec(lines[1].trim(), lines[2].trim())
            if (newSatrec && !newSatrec.error) {
              satrec = newSatrec
              localStorage.setItem('iss_tle', text)
              localStorage.setItem('iss_tle_time', Date.now())
              console.log('TLE loaded from proxy')
              return
            }
          }
        }
      } catch (e) {
        console.log('Proxy failed, trying cache')
      }

      const cachedTLE = localStorage.getItem('iss_tle')
      if (cachedTLE) {
        const lines = cachedTLE.trim().split('\n')
        const newSatrec = satellite.twoline2satrec(lines[1].trim(), lines[2].trim())
        if (newSatrec && !newSatrec.error) {
          satrec = newSatrec
          console.log('TLE loaded from cache')
        }
      }
    }

const updateISS = () => {
  if (!satrec) return

  const now = new Date()
  const pv = satellite.propagate(satrec, now)
  if (!pv.position) return

  const gmst = satellite.gstime(now)
  const geo = satellite.eciToGeodetic(pv.position, gmst)
  const lat = satellite.degreesLat(geo.latitude)
  const lng = satellite.degreesLong(geo.longitude)

  const orbitDots = []

  for (let i = 0; i <= 180; i++) {
    const futureDate = new Date(now.getTime() + i * 30 * 1000)
    const fpv = satellite.propagate(satrec, futureDate)
    if (!fpv.position) continue
    const fgmst = satellite.gstime(futureDate)
    const fgeo = satellite.eciToGeodetic(fpv.position, fgmst)
    orbitDots.push({
      lat: satellite.degreesLat(fgeo.latitude),
      lng: satellite.degreesLong(fgeo.longitude),
      size: 0.15,
      color: '#00e5ff',
      title: 'ISS Orbit Path',
      isOrbitDot: true
    })
  }

  setIss([{
    lat, lng, size: 2, color: '#00e5ff',
    title: 'International Space Station',
    type: 'Space Object',
    location: 'Low Earth Orbit',
    details: `Position: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
    time: 'Live',
    isOrbitDot: false
  }, ...orbitDots])

  setIssTrail([])
}

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchTLE().then(() => updateISS())
      }
    }

    fetchTLE().then(() => {
      updateISS()
      updateInterval = setInterval(updateISS, 3000)
      tleInterval = setInterval(fetchTLE, 6 * 60 * 60 * 1000)
    })

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(tleInterval)
      clearInterval(updateInterval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
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
  const fetchGlobalAlerts = async () => {
    try {
      const response = await fetch(
        'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?'
      )

      const data = await response.json()

      const alerts = data.features
        .filter((alert) => alert.geometry)
        .map((alert) => ({
          lat: alert.geometry.coordinates[1],
          lng: alert.geometry.coordinates[0],
          size: 0.55,
          color: '#00bfff',
          title: alert.properties.name || 'Global Alert',
          type: 'Weather Alert',
          location: alert.properties.country || 'Global',
          details: alert.properties.description || 'GDACS global disaster alert',
          time: alert.properties.fromdate || 'Live'
        }))

      setGlobalAlerts(alerts)
    } catch (error) {
      console.log('Global alert error:', error)
    }
  }

  fetchGlobalAlerts()

  const interval = setInterval(fetchGlobalAlerts, 300000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const fetchVolcanoes = async () => {
    try {
      const response = await fetch(
        'https://eonet.gsfc.nasa.gov/api/v3/events?category=volcanoes&status=open'
      )

      const data = await response.json()

      const volcanoEvents = data.events.map((event) => {
        const geometry = event.geometry[event.geometry.length - 1]

        return {
          lat: geometry.coordinates[1],
          lng: geometry.coordinates[0],
          size: 0.65,
          color: '#ff4d00',
          title: event.title,
          type: 'Volcano',
          location: event.sources?.[0]?.id || 'NASA EONET',
          details: `Active volcano event tracked by NASA EONET.`,
          time: geometry.date || 'Live'
        }
      })

      setVolcanoes(volcanoEvents)
    } catch (error) {
      console.log('Volcano data error:', error)
    }
  }

  fetchVolcanoes()

  const interval = setInterval(fetchVolcanoes, 300000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const fetchCVEs = async () => {
    try {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const pubStartDate = yesterday.toISOString()
      const pubEndDate = now.toISOString()

      const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=20`
      )

      const data = await response.json()

      const cveEvents = data.vulnerabilities.map((item) => {
        const cve = item.cve
        const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0]
        const score = metrics?.cvssData?.baseScore || 0
        const severity = metrics?.cvssData?.baseSeverity || 'UNKNOWN'

        return {
          lat: 37.7749,
          lng: -122.4194,
          size: score >= 9 ? 0.7 : score >= 7 ? 0.55 : 0.4,
          color: score >= 9 ? '#ff0033' : score >= 7 ? '#ff8800' : '#ffee00',
          title: cve.id,
          type: 'CVE',
          location: 'Cyber Intelligence',
          details:
  `Severity: ${severity}
CVSS Score: ${score}

${cve.descriptions?.[0]?.value || 'No description available'}`,
          time: cve.published
        }
      })

      setCves(cveEvents)
    } catch (error) {
      console.log('CVE data error:', error)
    }
  }

  fetchCVEs()

  const interval = setInterval(fetchCVEs, 300000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const fetchKEV = async () => {
    try {
      const response = await fetch(
        'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
      )

      const data = await response.json()

      const alerts = data.vulnerabilities
        .slice(0, 25)
        .map((vuln, index) => ({
          lat: 38.8977 + (Math.random() - 0.5) * 8,
          lng: -77.0365 + (Math.random() - 0.5) * 8,
          size: 0.9,
          color: '#ff0000',
          title: vuln.cveID,
          type: 'Cyber Alert',
          location: vuln.vendorProject,
          details:
            `${vuln.product}

${vuln.shortDescription}

Known Exploited Vulnerability`,
          time: vuln.dateAdded
        }))

      setKevAlerts(alerts)
    } catch (error) {
      console.log('KEV error:', error)
    }
  }

  fetchKEV()

  const interval = setInterval(fetchKEV, 3600000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const sampleOutages = [
    {
      lat: 40.7128,
      lng: -74.006,
      size: 0.6,
      color: '#b000ff',
      title: 'Network Disruption',
      type: 'Internet Outage',
      location: 'New York, USA',
      details: 'Possible regional connectivity disruption detected.',
      time: 'Simulated'
    },
    {
      lat: 51.5072,
      lng: -0.1276,
      size: 0.6,
      color: '#b000ff',
      title: 'Service Degradation',
      type: 'Internet Outage',
      location: 'London, UK',
      details: 'Network performance degradation reported.',
      time: 'Simulated'
    }
  ]

  setInternetOutages(sampleOutages)
}, [])

useEffect(() => {
  const sampleBGPAlerts = [
    {
      lat: 52.52,
      lng: 13.405,
      size: 0.7,
      color: '#ff00ff',
      title: 'Possible BGP Route Leak',
      type: 'BGP Hijack',
      location: 'Berlin, Germany',
      details: 'Possible abnormal route announcement detected.',
      time: 'Simulated'
    },
    {
      lat: 1.3521,
      lng: 103.8198,
      size: 0.7,
      color: '#ff00ff',
      title: 'Suspicious AS Path Change',
      type: 'BGP Hijack',
      location: 'Singapore',
      details: 'Potential routing anomaly affecting regional traffic.',
      time: 'Simulated'
    }
  ]

  setBgpAlerts(sampleBGPAlerts)
}, [])

  useEffect(() => {
  const fetchWeatherAlerts = async () => {
    try {
      const response = await fetch(
        'https://api.weather.gov/alerts/active'
      )

      const data = await response.json()

      const alerts = data.features.slice(0, 50).map(alert => ({
        lat: alert.geometry?.coordinates?.[0]?.[0]?.[1] || 0,
        lng: alert.geometry?.coordinates?.[0]?.[0]?.[0] || 0,
        size: 0.4,
        color: '#00bfff',
        title: alert.properties.event,
        type: 'Weather Alert',
        location: alert.properties.areaDesc,
        details: alert.properties.headline,
        time: 'Live'
      }))

      setWeatherAlerts(alerts)
    } catch (error) {
      console.log('Weather alert error:', error)
    }
  }

  fetchWeatherAlerts()

  const interval = setInterval(fetchWeatherAlerts, 300000)

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
        { lat: event.lat, lng: event.lng, altitude: 1.6 },
        1000
      )
    }
  }

const filteredEvents =
  activeFilter === 'All'
    ? events
    : events.filter((event) => event.type === activeFilter)

const filteredEarthquakes =
  activeFilter === 'All' || activeFilter === 'Earthquake'
    ? earthquakes
    : []

const filteredISS =
  activeFilter === 'All' || activeFilter === 'Space Object'
    ? iss
    : []

const allGlobePoints = [
  ...filteredEvents,
  ...filteredEarthquakes,
  ...filteredISS,
  ...globalAlerts,
  ...volcanoes,
  ...cves,
  ...kevAlerts,
  ...internetOutages,
  ...bgpAlerts
]



  return (
    <div className="dashboard">
      <aside className="panel leftPanel">
        <h2>LIVE EVENTS</h2>
        <div className="filterBar">
          { [
  'All',
  'Earthquake',
  'Volcano',
  'Weather Alert',
  'Space Object',
  'Internet Outage',
  'CVE',
  'Cyber Alert',
  'BGP Hijack',

].map(filter => (
            <button
              key={filter}
              className={activeFilter === filter ? 'activeFilter' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

<div className="sectionTitle">CYBER</div>

<div className="scrollList">
  {cves.slice(0, 10).map((event, index) => (
    <div
      className="card clickable"
      key={index}
      onClick={() => selectEvent(event)}
      style={{
        borderLeft: `4px solid ${
          event.color
        }`
      }}
    >
      <strong>{event.title}</strong>
      <span>{event.type}</span>
    </div>
  ))}
</div>

<div className="sectionTitle">KNOWN EXPLOITED</div>

<div className="scrollList">
  {kevAlerts.slice(0, 10).map((event, index) => (
    <div
      className="card clickable"
      key={index}
      onClick={() => selectEvent(event)}
      style={{
        borderLeft: '4px solid #ff0000'
      }}
    >
      <strong>{event.title}</strong>
      <span>{event.location}</span>
    </div>
  ))}
</div>

<div className="sectionTitle">INTERNET OUTAGES</div>

<div className="scrollList">
  {internetOutages.slice(0, 10).map((event, index) => (
    <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
      <strong>{event.title}</strong>
      <span>{event.location}</span>
    </div>
  ))}
</div>

<div className="sectionTitle">BGP ALERTS</div>

<div className="scrollList">
  {bgpAlerts.slice(0, 10).map((event, index) => (
    <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
      <strong>{event.title}</strong>
      <span>{event.location}</span>
    </div>
  ))}
</div>

        <div className="sectionTitle">GENERAL</div>
        {filteredEvents.map((event, index) => (
          <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
            <strong>{event.title}</strong>
            <span>{event.time}</span>
          </div>
        ))}

        <div className="sectionTitle">EARTHQUAKES</div>
        <div className="scrollList">
          {filteredEarthquakes.map((event, index) => (
            <div className="card clickable" key={index} onClick={() => selectEvent(event)}>
              <strong>{event.title}</strong>
              <span>{event.location}</span>
            </div>
          ))}
        </div>

        <div className="sectionTitle">SPACE</div>
{filteredISS
  .filter((event) => !event.isOrbitDot)
  .map((event, index) => (
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
/*
          pathsData={issTrail}
          pathPoints={d => d.points}
          pathPointLat={p => p.lat}
          pathPointLng={p => p.lng}
          pathColor={() => '#00e5ff'}
          pathStroke={1.5}
          pathDashLength={0.03}
          pathDashGap={0.02}
          pathDashAnimateTime={4000}
          pathAltitude={0.05}
*/
          pointsData={allGlobePoints}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={(point) => point.isOrbitDot ? 0.06 : 0.035}
          pointRadius="size"
          pointLabel="title"
          onPointClick={(point) => {
  if (point.isOrbitDot) return
  selectEvent(point)
}}

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
            <div className="card">Space Weather: Live</div>

            <div className="sectionTitle">SPACE WEATHER</div>
            {spaceWeather ? (
              <div className="card detailCard">
                <strong>KP Index: {spaceWeather.kpIndex}</strong>
                <span>Status: {spaceWeather.status}</span>
                <span>Updated: {spaceWeather.time}</span>
              </div>
            ) : (
              <div className="card">Loading space weather...</div>
            )}

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