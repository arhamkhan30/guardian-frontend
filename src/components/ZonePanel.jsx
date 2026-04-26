import { useState } from 'react'
import { scoreToColor } from '../data/zones.js'

const TYPE_ICONS = {
  market: '⬡', institution: '◈', transport: '⬢', residential: '⬡', open: '◯'
}

function HourChart({ zone, hour }) {
  return (
    <div className="zone-chart-section">
      <div className="zone-chart-label">Safety score — 24 hours</div>
      <div className="zone-chart">
        {zone.hourlyScore.map((s, h) => {
          const { fill } = scoreToColor(s)
          const pct = (s / 10) * 100
          return (
            <div key={h} className="zone-chart-bar" title={`${h}:00 — ${s}/10`}>
              <div
                className="zone-chart-fill"
                style={{
                  height: `${pct}%`,
                  background: fill,
                  opacity: h === hour ? 1 : 0.55,
                  outline: h === hour ? `1.5px solid ${fill}` : 'none',
                  outlineOffset: '1px',
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="zone-chart-axis">
        {['12 AM','6 AM','12 PM','6 PM','11 PM'].map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  )
}

export default function ZonePanel({ zone, hour }) {
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [extraReviews, setExtraReviews] = useState([])

  if (!zone) {
    return (
      <div className="zone-empty">
        <div className="zone-empty-icon">◈</div>
        <div className="zone-empty-title">Tap any zone on the map</div>
        <div className="zone-empty-sub">See safety scores, community reviews, and 24‑hour patterns for that area.</div>
      </div>
    )
  }

  const score = zone.hourlyScore[hour]
  const { fill, label, textBg, textColor } = scoreToColor(score)
  const hourStr = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`

  const handleSubmit = () => {
    if (!text.trim()) return
    setExtraReviews(r => [{
      name: 'You', text, time: `${hourStr} · Just now`, upvotes: 0
    }, ...r])
    setText('')
    setShowForm(false)
  }

  const allReviews = [...extraReviews, ...zone.reviews]

  return (
    <div className="zone-panel">
      <div className="zone-hero">
        <div className="zone-hero-top">
          <div>
            <div className="zone-hero-name">{zone.name}</div>
            <div className="zone-hero-type">{TYPE_ICONS[zone.type] || '◈'} {zone.type}</div>
          </div>
          <div className="zone-score-pill" style={{ background: textBg }}>
            <div className="zone-score-num" style={{ color: textColor }}>{score}</div>
            <div className="zone-score-lbl" style={{ color: textColor }}>{label}</div>
          </div>
        </div>
        <div className="zone-tags">
          {zone.tags.map(t => <span key={t} className="ztag">{t}</span>)}
        </div>
      </div>

      <HourChart zone={zone} hour={hour} />

      <div className="zone-reviews-section">
        <div className="zone-reviews-header">
          <span className="zone-reviews-title">Community reviews ({allReviews.length})</span>
          <button className="add-review-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ Add review'}
          </button>
        </div>

        {showForm && (
          <div className="review-form-wrap">
            <textarea
              className="review-textarea"
              rows={3}
              placeholder={`How did this area feel around ${hourStr}?`}
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button className="review-submit" onClick={handleSubmit}>Post review</button>
          </div>
        )}

        {allReviews.map((r, i) => {
          const initials = r.name.split(' ').map(w => w[0]).join('')
          return (
            <div className="review-item" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="review-ava" style={{ background: textBg, color: textColor }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="review-name">{r.name}</div>
                <div className="review-text">{r.text}</div>
                <div className="review-meta">
                  <span className="review-time">{r.time}</span>
                  <span className="review-up">▲ {r.upvotes}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
