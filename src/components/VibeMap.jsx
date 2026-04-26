import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { scoreToColor, PULSE_TYPES } from '../data/zones.js'

// Fix default leaflet icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const PULSE_ICONS = {
  safe: '●', caution: '◆', incident: '▲', lights_out: '◇', help: '★'
}

// Offset zone coords relative to map center
function offsetCoords(center, dLat, dLng) {
  return [center[0] + dLat, center[1] + dLng]
}

export default function VibeMap({
  hour, zones, selectedZone, onSelectZone,
  pulses, mapCenter, showPulses
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const circlesRef = useRef({})
  const labelsRef = useRef({})
  const pulseMarkersRef = useRef([])
  const centerMarkerRef = useRef(null)

  // Initialize map once
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(containerRef.current, {
      center: mapCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    })

    // Use CartoDB Voyager tiles - clean and works globally
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Draw / update zones
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove old circles and labels
    Object.values(circlesRef.current).forEach(c => c.remove())
    Object.values(labelsRef.current).forEach(l => l.remove())
    circlesRef.current = {}
    labelsRef.current = {}

    zones.forEach(zone => {
      const center = mapCenter
      const coords = offsetCoords(center, zone.lat, zone.lng)
      const score = zone.hourlyScore[hour]
      const { fill, stroke, label, textBg, textColor } = scoreToColor(score)

      const circle = L.circle(coords, {
        radius: zone.radius,
        color: stroke,
        fillColor: fill,
        fillOpacity: 0.32,
        weight: 1.5,
        bubblingMouseEvents: false,
      }).addTo(map)

      circle.on('click', () => onSelectZone(zone))
      circle.on('mouseover', function () {
        this.setStyle({ fillOpacity: 0.55, weight: 2.5 })
        containerRef.current.style.cursor = 'pointer'
      })
      circle.on('mouseout', function () {
        this.setStyle({ fillOpacity: 0.32, weight: 1.5 })
        containerRef.current.style.cursor = ''
      })

      circle.bindPopup(`
        <div style="min-width:160px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">${zone.name}</div>
          <div style="display:inline-block;padding:2px 8px;border-radius:999px;background:${textBg};color:${textColor};font-size:11px;font-weight:600">${label} · ${score}/10</div>
          <div style="margin-top:6px;font-size:12px;color:#888">Click to see reviews →</div>
        </div>
      `, { closeButton: false })

      circle.on('click', () => {
        circle.closePopup()
        onSelectZone(zone)
      })
      circle.on('mouseover', () => circle.openPopup())
      circle.on('mouseout', () => circle.closePopup())

      const labelIcon = L.divIcon({
        className: 'zone-label-icon',
        html: `<div class="zlabel" style="background:${fill};color:#fff;border-color:${stroke}">${zone.name} · ${score}</div>`,
        iconAnchor: [60, 10],
      })
      const labelMarker = L.marker(coords, { icon: labelIcon, interactive: false }).addTo(map)

      circlesRef.current[zone.id] = circle
      labelsRef.current[zone.id] = labelMarker
    })
  }, [zones, hour, mapCenter, onSelectZone])

  // Highlight selected zone
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    zones.forEach(zone => {
      const c = circlesRef.current[zone.id]
      if (!c) return
      const isSelected = selectedZone?.id === zone.id
      c.setStyle({ weight: isSelected ? 3 : 1.5, fillOpacity: isSelected ? 0.6 : 0.32 })
    })
    if (selectedZone) {
      const center = mapCenter
      const coords = offsetCoords(center, selectedZone.lat, selectedZone.lng)
      map.flyTo(coords, 15, { duration: 0.9, easeLinearity: 0.25 })
    }
  }, [selectedZone, zones, mapCenter])

  // Fly to map center when it changes (search)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.flyTo(mapCenter, 14, { duration: 1.2, easeLinearity: 0.2 })

    // Show a subtle center pin
    if (centerMarkerRef.current) centerMarkerRef.current.remove()
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#e11d7a;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconAnchor: [7, 7],
    })
    centerMarkerRef.current = L.marker(mapCenter, { icon, interactive: false }).addTo(map)
  }, [mapCenter])

  // Render pulse markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    pulseMarkersRef.current.forEach(m => m.remove())
    pulseMarkersRef.current = []
    if (!showPulses) return

    pulses.forEach(pulse => {
      const pt = PULSE_TYPES[pulse.type]
      const center = mapCenter
      const coords = [center[0] + pulse.lat, center[1] + pulse.lng]
      const icon = L.divIcon({
        className: 'pulse-icon',
        html: `<div class="picon" style="background:${pt.bg};border-color:${pt.color};color:${pt.color}">${PULSE_ICONS[pulse.type]} ${pt.label}</div>`,
        iconAnchor: [50, 12],
      })
      const m = L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(`<b>${pt.label}</b><br>${pulse.text}<br><small style="color:#888">${pulse.time} · ${pulse.anonymous ? 'Anonymous' : pulse.name}</small>`, { closeButton: false })
      pulseMarkersRef.current.push(m)
    })
  }, [pulses, mapCenter, showPulses])

  return <div ref={containerRef} className="vibe-map" />
}
