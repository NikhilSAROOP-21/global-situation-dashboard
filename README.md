# Global Situation Dashboard

A real-time open-source intelligence, cyber threat, disaster monitoring, and space situational awareness platform built with React, Vite, Three.js, React Globe GL, and Satellite.js.

The platform provides a centralized operational picture of global events through an interactive 3D globe, live intelligence feeds, cyber threat monitoring, disaster awareness systems, network intelligence, and space operations tracking.

---

## Features

### Global Intelligence Globe

* Interactive 3D Earth visualization
* Automatic globe rotation
* Country border rendering
* Click-and-drag navigation
* Zoom controls
* Real-time event markers
* Event auto-focus and tracking
* Multi-domain intelligence visualization
* Dynamic filtering system

---

## Space Domain

### International Space Station (ISS)

* Live ISS tracking
* Real-time orbital calculations
* TLE-based orbit propagation
* Ground position tracking
* Orbital velocity monitoring
* Altitude monitoring
* ISS crew monitoring
* Live crew count
* Crew member listing
* Automatic ISS updates

### Space Weather

* NOAA KP Index monitoring
* Geomagnetic storm monitoring
* Solar activity awareness
* Space weather operational status

### Satellite Visualization

* Simulated Starlink constellation
* Orbital object visualization
* Space situational awareness display

---

## Earth Domain

### Earthquake Monitoring

* Live USGS earthquake feed
* Magnitude visualization
* Depth reporting
* Global earthquake tracking

### Volcano Monitoring

* NASA EONET active volcano feed
* Active eruption monitoring
* Global volcanic activity awareness

### Disaster Intelligence

* GDACS global disaster alerts
* Worldwide disaster monitoring
* Emergency event visualization

### Weather Alerts

* Active weather warnings
* Severe weather monitoring
* Global alert visualization

---

## Cyber Threat Intelligence

### Vulnerability Intelligence

* Live NVD CVE monitoring
* CVSS severity scoring
* Critical vulnerability identification
* Top threat detection

### Known Exploited Vulnerabilities

* CISA KEV monitoring
* Actively exploited vulnerability tracking
* High-priority threat awareness

### Threat Intelligence

* Threat intelligence feed integration
* Advisory monitoring
* Cyber threat event tracking

### Ransomware Monitoring

* Ransomware.live integration
* Victim tracking
* Ransomware incident monitoring
* Campaign awareness

### Data Breach Monitoring

* Public breach intelligence
* Breach event tracking
* Records exposure awareness
* Breach timeline monitoring

---

## Network Intelligence

### Internet Outage Monitoring

* Network outage monitoring framework
* Regional disruption awareness
* Connectivity event tracking

### BGP Monitoring

* BGP anomaly monitoring framework
* Routing event awareness
* Route hijack monitoring foundation

---

## Intelligence Operations

### Event Management

* Clickable event markers
* Event detail panels
* Auto-focus event tracking
* Cross-domain intelligence display

### Intelligence Summary

Real-time intelligence overview:

* Active event counter
* Earthquake count
* Volcano count
* CVE count
* KEV count
* Ransomware count
* Threat intelligence count
* Data breach count
* Network event count

### Feed Health Monitoring

Operational status monitoring for:

* Space Weather
* ISS Tracking
* Earthquakes
* Volcanoes
* CVE Feed
* KEV Feed
* Threat Intelligence Feed
* Ransomware Feed
* Data Breach Feed
* Internet Outage Feed
* BGP Monitoring Feed

### Top Threat Analysis

Automatically identifies:

* Highest severity CVE
* Critical vulnerabilities
* Most significant cyber threat
* Priority intelligence target

### Global Risk Assessment

Dynamic global threat level calculation:

* LOW
* ELEVATED
* HIGH
* CRITICAL

Based on:

* Critical CVEs
* Active KEVs
* Ransomware activity
* Data breaches
* Threat intelligence alerts
* Network events

---

## Technology Stack

### Frontend

* React
* Vite
* React Globe GL
* Three.js

### Geospatial Processing

* TopoJSON
* GeoJSON

### Orbital Processing

* Satellite.js
* TLE propagation

### State Management

* React Hooks
* Real-time polling architecture

---

## Data Sources

### Space

* WhereTheISS.at
* Open Notify
* NOAA Space Weather Prediction Center

### Earth & Disaster

* USGS Earthquake Feed
* NASA EONET
* GDACS
* Weather.gov

### Cyber Intelligence

* NVD CVE API
* CISA KEV Feed
* Ransomware.live
* Threat Intelligence Feeds
* Public Breach Intelligence Sources

### Network Intelligence

* Internet Outage Monitoring Framework
* BGP Monitoring Framework

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/global-situation-dashboard.git
```

Install dependencies:

```bash
npm install
```

Start development server:

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

* [x] Interactive Globe
* [x] Country Borders
* [x] Event Markers
* [x] Live Earthquake Feed
* [x] Live ISS Tracking
* [x] Event Details Panel

### Phase 2 ✅

* [x] Space Weather Monitoring
* [x] ISS Orbital Calculations
* [x] Weather Alerts
* [x] Volcano Monitoring
* [x] Event Filtering
* [x] ISS Crew Monitoring

### Phase 3 ✅

* [x] CVE Monitoring
* [x] Known Exploited Vulnerabilities (KEV)
* [x] Threat Intelligence Monitoring
* [x] Ransomware Monitoring
* [x] Data Breach Monitoring
* [x] Global Risk Assessment
* [x] Feed Health Monitoring
* [x] Top Threat Analysis
* [x] Intelligence Summary Dashboard

### Phase 4 🚧

* [ ] Threat Timeline
* [ ] Event Correlation Engine
* [ ] Historical Event Playback
* [ ] Alert Subscriptions
* [ ] Docker Deployment
* [ ] User-Configurable Dashboards
* [ ] Multi-User Support

### Phase 5

* [ ] Aircraft Tracking
* [ ] Maritime Tracking
* [ ] Wildfire Monitoring
* [ ] Conflict Monitoring
* [ ] AI-Assisted Event Classification
* [ ] Automated Threat Assessment
* [ ] Predictive Intelligence Models
* [ ] Geopolitical Intelligence Monitoring

---

## Contributing

Contributions, feature requests, and suggestions are welcome.

Please open an issue or submit a pull request.

---

## License

MIT License
