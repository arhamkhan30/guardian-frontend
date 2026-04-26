import { useState } from 'react'
import { PULSE_TYPES } from '../data/zones.js'

const PULSE_ICONS = {
  safe: '●', caution: '◆', incident: '▲', lights_out: '◇', help: '★'
}

export default function PulseFeed({ pulses, onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState('safe')
  const [text, setText] = useState('')
  const [anon, setAnon] = useState(true)

  const handlePost = () => {
    if (!text.trim()) return
    onAdd({
      type, text,
      anonymous: anon,
      name: anon ? undefined : 'You',
      lat: (Math.random() - 0.5) * 0.02,
      lng: (Math.random() - 0.5) * 0.02,
    })
    setText('')
    setType('safe')
    setShowForm(false)
  }

  return (
    <div className="pulse-panel">
      <div className="pulse-header">
        <div className="pulse-live-badge">
          <div className="stab-dot" />
          Live Pulse
        </div>
        <button className="add-pulse-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Post Pulse'}
        </button>
      </div>

      {showForm && (
        <div className="pulse-form">
          <div className="pulse-type-grid">
            {Object.entries(PULSE_TYPES).map(([key, pt]) => (
              <button
                key={key}
                className={`ptype-opt ${type === key ? 'sel' : ''}`}
                style={type === key ? { background: pt.bg, borderColor: pt.color, color: pt.color } : {}}
                onClick={() => setType(key)}
              >
                {PULSE_ICONS[key]} {pt.label}
              </button>
            ))}
          </div>
          <textarea
            className="pulse-textarea"
            rows={3}
            placeholder="What's happening here? Location is shared anonymously."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="pulse-form-footer">
            <label className="anon-check">
              <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} />
              Post anonymously
            </label>
            <button className="post-btn" onClick={handlePost}>Post Pulse ↗</button>
          </div>
        </div>
      )}

      <div className="pulse-list">
        {pulses.map((p, i) => {
          const pt = PULSE_TYPES[p.type]
          return (
            <div
              className="pulse-card"
              key={p.id}
              style={{ borderLeftColor: pt.color, animationDelay: `${i * 30}ms` }}
            >
              <div className="pulse-card-top">
                <span className="pulse-badge" style={{ background: pt.bg, color: pt.color }}>
                  {PULSE_ICONS[p.type]} {pt.label}
                </span>
                <span className="pulse-time">{p.time}</span>
              </div>
              <div className="pulse-text">{p.text}</div>
              <div className="pulse-footer">
                <span className="pulse-who">{p.anonymous ? 'Anonymous Guardian' : p.name}</span>
                <button className="amplify-btn">↑ Amplify</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
