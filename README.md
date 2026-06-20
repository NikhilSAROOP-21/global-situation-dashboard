# Global Situation Dashboard

A real-time open-source intelligence, cyber threat monitoring, disaster awareness, network intelligence, and multi-domain situational awareness platform built with React, Vite, Three.js, React Globe GL, and Satellite.js.

The platform provides a centralized operational picture of global events through an interactive 3D globe, live intelligence feeds, cyber threat monitoring, network awareness, air traffic monitoring, maritime tracking, disaster intelligence, and space operations monitoring.

---

## Overview

The Global Situation Dashboard combines multiple intelligence domains into a single operational picture, allowing users to monitor cyber threats, natural disasters, space operations, network disruptions, aircraft activity, and maritime movements from one interface.

The dashboard is designed for:

* Cybersecurity professionals
* Intelligence analysts
* Security operations centers
* Researchers
* Students
* Open-source intelligence (OSINT) enthusiasts

---

## Features

### Global Intelligence Globe

* Interactive 3D Earth visualization
* Automatic globe rotation
* Country border rendering
* Zoom and drag controls
* Real-time event visualization
* Dynamic event filtering
* Event auto-focus and tracking
* Multi-domain situational awareness
* Threat heatmap visualization

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
* Crew manifest display
* Live orbital path visualization

### Space Weather

* NOAA KP Index monitoring
* Geomagnetic storm monitoring
* Solar activity awareness
* Space weather operational status

### Satellite Awareness

* Simulated Starlink constellation
* Orbital object visualization
* Space situational awareness display

---

## Air Domain

### Aircraft Tracking

* Live aircraft monitoring
* OpenSky Network integration
* Aircraft position tracking
* Callsign display
* Origin country information
* Altitude monitoring
* Velocity monitoring
* Aircraft event statistics

---

## Maritime Domain

### Vessel Tracking

* Maritime traffic visualization
* Cargo vessel monitoring
* Tanker monitoring
* Port activity awareness
* Vessel movement simulation
* Maritime event statistics

---

## Earth Domain

### Earthquake Monitoring

* Live USGS earthquake feed
* Magnitude visualization
* Depth reporting
* Global earthquake tracking

### Volcano Monitoring

* NASA EONET volcano monitoring
* Active eruption tracking
* Global volcanic activity awareness

### Weather Alerts

* Active weather warning monitoring
* Severe weather awareness
* Global alert visualization

### Disaster Intelligence

* GDACS disaster monitoring
* Worldwide emergency awareness
* Disaster event visualization

---

## Cyber Threat Intelligence

### Vulnerability Intelligence

* Live NVD CVE monitoring
* CVSS severity scoring
* Critical vulnerability identification
* Top threat detection

### Known Exploited Vulnerabilities (KEV)

* CISA KEV monitoring
* Actively exploited vulnerability tracking
* High-priority threat awareness

### Threat Intelligence

* Cybersecurity advisory monitoring
* Threat intelligence feed integration
* Security event awareness

### Ransomware Monitoring

* Ransomware.live integration
* Victim tracking
* Campaign awareness
* Sector intelligence

### Data Breach Monitoring

* Public breach intelligence
* Breach event tracking
* Records exposure awareness
* Breach timeline monitoring

---

## Network Intelligence

### Internet Outage Monitoring

* Regional outage awareness
* Connectivity event tracking
* Internet disruption monitoring

### BGP Monitoring

* BGP anomaly monitoring
* Routing event awareness
* Route hijack monitoring
* Internet infrastructure visibility

---

## Intelligence Operations

### Threat Timeline

Monitor intelligence events over time.

Features include:

* Historical event timeline
* Time-based filtering
* 1 Hour view
* 24 Hour view
* 7 Day view
* 30 Day view
* 1 Year view
* Chronological event tracking

---

### Correlation Engine

Automatically correlates intelligence events across multiple sources.

Features include:

* CVE correlation analysis
* KEV correlation matching
* Threat intelligence correlation
* Confidence scoring
* Severity scoring
* Threat prioritization
* Correlation reasoning
* Multi-source validation

---

### Threat Heatmap

Visual threat intensity layer displayed directly on the globe.

Based on:

* CVEs
* KEVs
* Threat Intelligence
* Ransomware
* Data Breaches
* Internet Outages
* BGP Events
* Natural Disasters

---

### News Ticker

Live intelligence feed displayed across the dashboard.

Includes:

* Earthquake notifications
* KEV notifications
* Threat intelligence updates
* Ransomware activity
* Data breach alerts

---

### Intelligence Summary

Real-time intelligence overview including:

* Active event count
* Earthquake count
* Volcano count
* Aircraft count
* Maritime count
* CVE count
* KEV count
* Ransomware count
* Threat intelligence count
* Data breach count
* Network event count

---

### Feed Health Monitoring

Operational status monitoring for:

* Space Weather
* ISS Tracking
* Earthquakes
* Volcanoes
* Aircraft Tracking
* Maritime Tracking
* CVE Feed
* KEV Feed
* Threat Intelligence Feed
* Ransomware Feed
* Data Breach Feed
* Internet Outage Feed
* BGP Monitoring Feed

---

### Top Threat Analysis

Automatically identifies:

* Highest severity CVE
* Critical vulnerabilities
* Most significant cyber threat
* Priority intelligence target

---

### Global Risk Assessment

Dynamic threat level calculation.

Risk Levels:

* LOW
* ELEVATED
* HIGH
* CRITICAL

Calculated using:

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
* TLE Propagation

### State Management

* React Hooks
* Real-Time Polling Architecture

---

## Data Sources

### Space

* WhereTheISS.at
* Open Notify
* NOAA Space Weather Prediction Center

### Air

* OpenSky Network

### Earth & Disaster

* USGS Earthquake Feed
* NASA EONET
* GDACS
* Weather.gov

### Cyber Intelligence

* NVD CVE API
* CISA KEV Feed
* Ransomware.live
* CISA Cybersecurity Advisories
* Have I Been Pwned

### Network Intelligence

* Cloudflare Radar
* BGP Monitoring Sources

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

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Development Progress

### Phase 1 ✅

* Interactive Globe
* Country Borders
* Event Markers
* Live Earthquake Feed
* Live ISS Tracking
* Event Details Panel

### Phase 2 ✅

* Space Weather Monitoring
* ISS Orbital Calculations
* Weather Alerts
* Volcano Monitoring
* Event Filtering
* ISS Crew Monitoring

### Phase 3 ✅

* CVE Monitoring
* Known Exploited Vulnerabilities
* Threat Intelligence Monitoring
* Ransomware Monitoring
* Data Breach Monitoring
* Global Risk Assessment
* Feed Health Monitoring
* Top Threat Analysis
* Intelligence Summary Dashboard

### Phase 4 ✅

* Threat Timeline
* Correlation Engine
* Threat Prioritization
* News Ticker
* Aircraft Tracking
* Maritime Tracking
* Threat Heatmap
* Correlation Reasoning
* Multi-Domain Awareness

---

## Future Enhancements & Ideas

### Intelligence & Analytics

* Historical Event Playback
* Alert Subscriptions
* Export Intelligence Reports
* Automated Threat Assessment
* Predictive Intelligence Models
* AI-Assisted Event Classification
* Geopolitical Intelligence Monitoring
* Conflict Monitoring
* Threat Actor Tracking
* Country Risk Scoring

### Disaster Monitoring

* Wildfire Monitoring
* Hurricane Tracking
* Flood Monitoring
* Tsunami Monitoring
* Emergency Response Intelligence

### Air & Maritime

* Real-Time AIS Integration
* Expanded Aircraft Tracking
* Military Aircraft Monitoring
* Port Activity Monitoring
* Shipping Route Analysis

### User Experience

* User Configurable Dashboards
* Multi-User Support
* Saved Dashboard Layouts
* Custom Alert Rules
* Mobile Dashboard Support

### Infrastructure

* Docker Deployment
* Kubernetes Deployment
* Self-Hosted Package
* Authentication & User Management
* External API Access

### Artificial Intelligence

* Event Classification Models
* Threat Prediction Models
* AI Situation Reports
* Natural Language Intelligence Summaries
* Anomaly Detection Engine

---

## Contributing

Contributions, feature requests, ideas, and pull requests are welcome.

---

## License

MIT License
