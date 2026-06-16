# Global Situation Dashboard

An open-source real-time intelligence, cyber threat, disaster monitoring, and situational awareness platform built with React, Vite, Three.js, React Globe GL, and Satellite.js.

The dashboard provides a centralized operational picture of global events through an interactive 3D globe, live intelligence feeds, disaster monitoring systems, cyber threat intelligence, and space situational awareness.

---

## Features

### Globe Visualization

* Interactive 3D globe
* Automatic globe rotation
* Click-and-drag navigation
* Zoom controls
* Country border rendering
* Real-time event markers
* Event auto-focus and tracking
* Dynamic event filtering
* Multi-domain event visualization

### Space Monitoring

* Live ISS tracking
* Real-time TLE-based orbital calculations
* ISS orbital path prediction
* Space weather monitoring
* Simulated Starlink constellation
* Satellite visualization around Earth

### Earth Monitoring

* Live earthquake feed (USGS)
* Earthquake severity visualization
* Active volcano monitoring
* Global weather and disaster alerts
* Worldwide event visualization

### Cyber Threat Intelligence

* CVE monitoring
* Known Exploited Vulnerabilities (KEV)
* Cyber threat event categorization
* Severity-based threat visualization
* Threat intelligence event panels

### Network Intelligence

* Internet outage monitoring
* BGP route anomaly monitoring
* Network disruption visualization
* Routing event tracking

### Event Management

* Clickable event markers
* Event detail popups
* Globe auto-focus on selected events
* Event categorization
* Dynamic filtering system
* Real-time monitoring architecture

### Dashboard Interface

* Dark intelligence-dashboard theme
* Responsive layout
* Live event panel
* Event details panel
* Intelligence-focused operational display
* Situational awareness design

---

## Technology Stack

### Frontend

* React
* Vite
* React Globe GL
* Three.js

### Geospatial & Orbital Processing

* TopoJSON
* Satellite.js

### Data Sources

#### Space

* CelesTrak TLE Data
* NOAA Space Weather Data

#### Earth & Disaster Monitoring

* USGS Earthquake Feed
* NASA EONET Volcano Events
* GDACS Global Disaster Alerts

#### Cyber Intelligence

* NVD CVE API
* CISA Known Exploited Vulnerabilities (KEV)

#### Network Intelligence

* Internet outage monitoring
* BGP anomaly monitoring

### Development Tools

* Git
* GitHub
* ESLint

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/global-situation-dashboard.git
```

Navigate into the project:

```bash
cd global-situation-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Current Monitoring Domains

### Space Domain

* International Space Station (ISS)
* Orbital prediction
* Space weather monitoring
* Starlink constellation simulation

### Earth Domain

* Earthquakes
* Volcanoes
* Weather alerts
* Global disaster monitoring

### Cyber Domain

* CVE monitoring
* Known exploited vulnerabilities
* Threat intelligence tracking

### Network Domain

* Internet outage monitoring
* BGP anomaly monitoring

---

## Roadmap

### Phase 1 ✅

* [x] Interactive globe
* [x] Country borders
* [x] Event markers
* [x] Live earthquake feed
* [x] Live ISS tracking
* [x] Event details panel

### Phase 2 ✅

* [x] Space weather monitoring
* [x] ISS orbital path visualization
* [x] Event filtering
* [x] Weather alerts
* [x] Volcano monitoring

### Phase 3 🚧

* [x] Internet outage monitoring
* [x] Cybersecurity alerts
* [x] CVE monitoring
* [x] BGP hijack monitoring
* [x] Known Exploited Vulnerabilities (KEV)
* [ ] Threat intelligence feeds
* [ ] Ransomware monitoring
* [ ] Data breach monitoring
* [ ] Real-time network telemetry

### Phase 4

* [ ] Docker deployment
* [ ] User-configurable dashboards
* [ ] Multi-user support
* [ ] Historical event playback
* [ ] Alert subscriptions
* [ ] Event correlation engine

### Phase 5

* [ ] Aircraft tracking
* [ ] Maritime tracking
* [ ] Wildfire monitoring
* [ ] Conflict monitoring
* [ ] AI-assisted event classification
* [ ] Automated threat assessment
* [ ] Predictive intelligence models

---

## Contributing

Contributions, feature requests, and suggestions are welcome.

Please open an issue or submit a pull request.

---

## License

MIT License
