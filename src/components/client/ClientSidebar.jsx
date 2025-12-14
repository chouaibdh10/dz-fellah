import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import './ClientSidebar.css'

const ClientSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    {
      path: '/products',
      icon: '🏪',
      label: 'Boutique',
      badge: null
    },
    {
      path: '/cart',
      icon: '🛒',
      label: 'Panier',
      badge: getItemCount()
    },
    {
      path: '/client/orders',
      icon: '📋',
      label: 'Commandes',
      badge: null
    },
    {
      path: '/client/profile',
      icon: '⚙️',
      label: 'Profil',
      badge: null
    }
  ]

  const handlePhotoClick = () => {
    navigate('/client/profile')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="client-navbar">
      <div className="navbar-container">
        {/* Logo & Brand */}
        <Link to="/products" className="navbar-brand">
          <span className="brand-icon">🌾</span>
          <span className="brand-text">DZ-Fellah</span>
          <span className="brand-badge">Client</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Menu */}
        <nav className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section - User & Actions */}
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Changer le thème">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="user-dropdown">
            <button className="user-button" onClick={handlePhotoClick}>
              <div className="user-avatar">
                {user?.photo ? (
                  <img src={user.photo} alt="Photo de profil" />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || 'C'}</span>
                )}
              </div>
              <span className="user-name">{user?.name || 'Client'}</span>
            </button>
          </div>

          <button onClick={handleLogout} className="logout-btn" title="Déconnexion">
            <span>🚪</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default ClientSidebar
