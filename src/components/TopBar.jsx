import { useTheme } from '../context/ThemeContext.jsx'

export default function TopBar({ onFlare, searchQuery, onSearchChange, onSearchKey }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <a className="logo" href="#">
          <div className="logo-mark">G</div>
          <span className="logo-name">Guardian</span>
        </a>
        <span className="logo-tag">Women's Safety Network</span>
      </div>

      <div className="topbar-center">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search any city, street or area…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={onSearchKey}
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="theme-btn" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '☀' : '☽'}
        </button>
        <button className="flare-btn" onClick={onFlare}>
          <div className="flare-pulse" />
          Flare SOS
        </button>
      </div>
    </header>
  )
}
