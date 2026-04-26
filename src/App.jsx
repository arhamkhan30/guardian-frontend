import { useState, useEffect, useCallback, useRef } from 'react'
import './index.css'
import './App.css'
import TopBar from './components/TopBar.jsx'
import VibeMap from './components/VibeMap.jsx'
import TimeSlider from './components/TimeSlider.jsx'
import ZonePanel from './components/ZonePanel.jsx'
import PulseFeed from './components/PulseFeed.jsx'
import FlareModal from './components/FlareModal.jsx'
import { INITIAL_ZONES, INITIAL_PULSES, scoreToColor } from './data/zones.js'

const LEGEND = [
  { color: '#16a34a', label: 'Safe (8–10)' },
  { color: '#65a30d', label: 'Mostly safe (6–7)' },
  { color: '#d97706', label: 'Caution (4–5)' },
  { color: '#dc2626', label: 'High risk (2–3)' },
  { color: '#7f1d1d', label: 'Avoid (0–1)' },
]

export default function App() {
  const [hour, setHour] = useState(new Date().getHours())
  const [selectedZone, setSelectedZone] = useState(null)
  const [activeTab, setActiveTab] = useState('zone')
  const [pulses, setPulses] = useState(INITIAL_PULSES)
  const [showFlare, setShowFlare] = useState(false)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]) // India center default
  const [searchQuery, setSearchQuery] = useState('')
  const [showPulses, setShowPulses] = useState(true)
  const [zones, setZones] = useState(INITIAL_ZONES)
  const searchTimer = useRef(null)

  // Geocoding search using Nominatim (free, no key needed)
  const geocode = useCallback(async (query) => {
    if (!query.trim()) return
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data && data[0]) {
        const { lat, lon } = data[0]
        setMapCenter([parseFloat(lat), parseFloat(lon)])
      }
    } catch (e) {
      console.warn('Geocoding failed', e)
    }
  }, [])

  // Debounced search on Enter or after 1.5s pause
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val)
    clearTimeout(searchTimer.current)
    if (val.length > 3) {
      searchTimer.current = setTimeout(() => geocode(val), 1200)
    }
  }, [geocode])

  // Also search on Enter
  const handleSearchKey = useCallback((e) => {
    if (e.key === 'Enter') { clearTimeout(searchTimer.current); geocode(searchQuery) }
  }, [geocode, searchQuery])

  const handleAddPulse = useCallback((pulse) => {
    setPulses(p => [{ ...pulse, id: `p${Date.now()}`, time: 'just now' }, ...p])
  }, [])

  return (
    <div className="app">
      <TopBar
        onFlare={() => setShowFlare(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchKey={handleSearchKey}
      />

      <div className="main-layout">
        {/* MAP */}
        <div className="map-area">
          <VibeMap
            hour={hour}
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={zone => { setSelectedZone(zone); setActiveTab('zone') }}
            pulses={pulses}
            mapCenter={mapCenter}
            showPulses={showPulses}
          />

          {/* Floating map chips top-left */}
          <div className="map-controls-tl">
            <button
              className={`map-chip ${showPulses ? 'active' : ''}`}
              onClick={() => setShowPulses(v => !v)}
            >
              <div className="map-chip-dot" style={{ background: showPulses ? '#fff' : '#16a34a' }} />
              {showPulses ? 'Hide Pulses' : 'Show Pulses'}
            </button>
          </div>

          {/* Map legend */}
          <div className="map-overlay-bottom">
            <div className="map-legend">
              {LEGEND.map(l => (
                <div className="legend-item" key={l.label}>
                  <div className="legend-dot" style={{ background: l.color }} />
                  <span className="legend-lbl">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating time slider */}
          <TimeSlider hour={hour} onChange={setHour} />
        </div>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-tabs">
            <button
              className={`stab ${activeTab === 'zone' ? 'on' : ''}`}
              onClick={() => setActiveTab('zone')}
            >
              {selectedZone ? `📍 ${selectedZone.name}` : '◈ Zone Reviews'}
            </button>
            <button
              className={`stab ${activeTab === 'pulse' ? 'on' : ''}`}
              onClick={() => setActiveTab('pulse')}
            >
              <div className="stab-dot" />
              Live Pulse
            </button>
          </div>

          <div className="sidebar-body">
            {activeTab === 'zone'
              ? <ZonePanel zone={selectedZone} hour={hour} />
              : <PulseFeed pulses={pulses} onAdd={handleAddPulse} />
            }
          </div>
        </aside>
      </div>

      {showFlare && <FlareModal onClose={() => setShowFlare(false)} />}
    </div>
  )
}
