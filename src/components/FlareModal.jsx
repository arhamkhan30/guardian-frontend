import { useState, useEffect } from 'react'

export default function FlareModal({ onClose }) {
  const [count, setCount] = useState(3)
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
    setActivated(true)
  }, [count])

  return (
    <div className="flare-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="flare-modal">
        <div className={`flare-ring-wrap ${activated ? 'done' : ''}`}>
          {activated
            ? <span className="flare-check">✓</span>
            : <span className="flare-count">{count}</span>}
        </div>

        {!activated ? (
          <>
            <h2>Activating Flare</h2>
            <p>Alerting your Guardian Circle and posting anonymous location in {count}s…</p>
            <button className="flare-cancel" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <h2>Flare Activated</h2>
            <p>Your Guardian Circle has been notified. Stay visible and keep moving towards a safe area.</p>
            <div className="responders">
              <div className="responder-item">Priya N. · 0.3 km away · <span style={{ color: '#16a34a', fontWeight: 600 }}>On my way</span></div>
              <div className="responder-item" style={{ animationDelay: '200ms' }}>Kavya S. · 0.8 km away · <span style={{ color: '#d97706', fontWeight: 600 }}>Calling help</span></div>
            </div>
            <button className="flare-cancel safe" onClick={onClose}>I am safe now</button>
          </>
        )}
      </div>
    </div>
  )
}
