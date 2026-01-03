import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import NotificationBell from '../notifications/NotificationBell'
import logo from '../../photos/DZ-fellah.png'
import '../../styles/Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const handleLangChange = (e) => {
    const next = e.target.value
    i18n.changeLanguage(next)
    try {
      window.localStorage.setItem('lang', next)
    } catch {
      // ignore
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="DZ-Fellah" className="navbar-logo-img" />
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/login">{t('nav.login')}</Link></li>
            <li><Link to="/register-choice">{t('nav.register')}</Link></li>
            <li className="navbar-notifications"><NotificationBell /></li>
            <li className="navbar-lang-item">
              <select
                aria-label={t('lang.label')}
                className="navbar-lang-select"
                value={i18n.resolvedLanguage || i18n.language}
                onChange={handleLangChange}
              >
                <option value="fr">{t('lang.fr')}</option>
                <option value="en">{t('lang.en')}</option>
                <option value="ar">{t('lang.ar')}</option>
              </select>
            </li>
            <li>
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-btn" 
                aria-label="Toggle theme"
                title={theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
