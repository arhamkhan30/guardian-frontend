import { useState, useEffect, useRef } from 'react'

const LABELS = [
  '12 AM','1','2','3','4','5','6 AM','7','8','9','10','11',
  '12 PM','1','2','3','4','5','6 PM','7','8','9','10','11'
]
const TICKS = ['12 AM', '6 AM', '12 PM', '6 PM', '11 PM']
const TICK_POS = ['0%', '26%', '52%', '78%', '96%']

export default function TimeSlider({ hour, onChange }) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => onChange(h => (h + 1) % 24), 650)
    return () => clearInterval(id)
  }, [playing, onChange])

  const pct = (hour / 23) * 100
  const sliderBg = `linear-gradient(to right, #e11d7a 0%, #e11d7a ${pct}%, transparent ${pct}%)`
  const isDaytime = hour >= 6 && hour < 20

  return (
    <div className="time-float">
      <div className="time-pill">
        <div className="time-pill-header">
          <div className="time-display">
            <span style={{ fontSize: 14 }}>{isDaytime ? '☀' : '☽'}</span>
            <span className="time-hr">{LABELS[hour]}</span>
            <span className="time-period">{isDaytime ? 'Daytime' : 'Nighttime'}</span>
          </div>
          <div className="time-pill-actions">
            <button
              className="time-now-btn"
              onClick={() => { setPlaying(false); onChange(new Date().getHours()) }}
            >Now</button>
            <button
              className={`play-btn ${playing ? 'active' : ''}`}
              onClick={() => setPlaying(p => !p)}
            >
              {playing ? '⏸ Pause' : '▶ Play 24h'}
            </button>
          </div>
        </div>

        <input
          ref={ref}
          type="range" min={0} max={23} step={1} value={hour}
          className="time-range"
          style={{ background: sliderBg }}
          onChange={e => { setPlaying(false); onChange(Number(e.target.value)) }}
        />

        <div className="time-ticks" style={{ position: 'relative', height: 16, marginTop: 4 }}>
          {TICKS.map((t, i) => (
            <span key={t} style={{ position: 'absolute', left: TICK_POS[i], transform: 'translateX(-50%)', fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
