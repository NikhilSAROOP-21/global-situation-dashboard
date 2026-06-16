# Global Situation Dashboard

An open-source real-time intelligence, cyber threat, disaster monitoring, and situational awareness platform built with React, Vite, Three.js, React Globe GL, and Satellite.js.

The dashboard provides a centralized operational picture of global events through an interactive 3D globe, live intelligence feeds, cyber threat monitoring, disaster intelligence, network awareness, and space situational awareness.

---

## Features

### Interactive 3D Globe

* Real-time 3D Earth visualization
* Automatic globe rotation
* Click-and-drag navigation
* Zoom controls
* Country border rendering
* Dynamic event markers
* Event auto-focus and tracking
* Multi-domain intelligence visualization
* Live event correlation display

### Space Situational Awareness

* Live International Space Station (ISS) tracking
* Real-time orbital calculations using TLE data
* ISS orbital path visualization
* Live ISS altitude monitoring
* Live ISS velocity monitoring
* Ground-track positioning
* ISS crew monitoring
* Space weather monitoring (NOAA KP Index)
* Simulated Starlink constellation visualization

### Earth & Disaster Monitoring

* Live USGS earthquake feed
* Earthquake severity visualization
* NASA EONET volcano monitoring
* GDACS global disaster alerts
* Worldwide weather and hazard alerts
* Global event visualization

### Cyber Threat Intelligence

* Live NVD CVE monitoring
* CVSS severity scoring
* Known Exploited Vulnerabilities (KEV) monitoring
* Threat intelligence feeds
* Ransomware incident monitoring
* Cyber alert categorization
* Threat severity visualization
* Intelligence summary statistics

### Network Intelligence

* Internet outage monitoring framework
* BGP anomaly monitoring framework
* Routing event visualization
* Network disruption awareness

### Intelligence Operations

* Clickable event markers
* Event detail panels
* Dynamic event filtering
* Threat categorization
* Feed health monitoring
* Active event counter
* Intelligence summary dashboard
* Real-time situational awareness display

### Dashboard Interface

* Dark intelligence-dashboard theme
* Responsive layout
* Scrollable intelligence panels
* Sticky event filtering system
* Operational command-center design
* Mission-control inspired interface

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

### State Management

* React Hooks
* Real-time polling architecture

### Development Tools

* Git
* GitHub
* ESLint

---

## Data Sources

### Space

* WhereTheISS.at API
* Open Notify API
* NOAA Space Weather Prediction Center
* Satellite.js Orbital Propagation

### Earth & Disaster Intelligence

* USGS Earthquake Feed
* NASA EONET
* GDACS Global Disaster Alert System
* Weather.gov Alerts API

### Cyber Intelligence

* NVD CVE API
* CISA Known Exploited Vulnerabilities Feed
* Ransomware.live

### Network Intelligence

* Internet outage monitoring framework
* BGP monitoring framework

---

## Current Monitoring Domains

### Space Domain

* International Space Station (ISS)
* Orbital prediction
* Crew monitoring
* Orbital velocity tracking
* Altitude tracking
* Space weather monitoring
* Satellite visualization

### Earth Domain

* Earthquakes
* Volcanoes
* Weather alerts
* Disaster alerts

### Cyber Domain

* CVE monitoring
* Known exploited vulnerabilities
* Threat intelligence
* Ransomware monitoring
* Cyber alerts

### Network Domain

* Internet outages
* BGP anomalies
* Routing events

---

## Dashboard Intelligence Features

### Active Event Counter

Provides a live count of all monitored events across every domain.

### Feed Health Monitoring

Real-time operational status monitoring of all intelligence feeds:

* Space Weather
* Earthquakes
* Volcanoes
* ISS Tracking
* CVE Feed
* KEV Feed
* Threat Intelligence
* Ransomware
* Internet Outages
* BGP Monitoring

### Intelligence Summary

Aggregated operational overview showing:

* Earthquake count
* Volcano count
* CVE count
* KEV count
* Ransomware incidents
* Threat intelligence alerts
* Internet outage events
* BGP events

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
* [x] ISS crew monitoring
* [x] Feed health monitoring
* [x] Intelligence summary panel

### Phase 3 🚧

* [x] CVE monitoring
* [x] Known Exploited Vulnerabilities (KEV)
* [x] Threat intelligence framework
* [x] Ransomware monitoring
* [x] Internet outage framework
* [x] BGP monitoring framework
* [ ] Data breach monitoring
* [ ] Real-time network telemetry
* [ ] Threat correlation engine

### Phase 4

* [ ] Docker deployment
* [ ] User-configurable dashboards
* [ ] Multi-user support
* [ ] Historical event playback
* [ ] Alert subscriptions
* [ ] Event correlation engine
* [ ] Global risk assessment

### Phase 5

* [ ] Aircraft tracking
* [ ] Maritime tracking
* [ ] Wildfire monitoring
* [ ] Conflict monitoring
* [ ] AI-assisted event classification
* [ ] Automated threat assessment
* [ ] Predictive intelligence models
* [ ] Geopolitical intelligence feeds

---

## Contributing

Contributions, feature requests, and suggestions are welcome.

Please open an issue or submit a pull request.

---

## License

MIT License
