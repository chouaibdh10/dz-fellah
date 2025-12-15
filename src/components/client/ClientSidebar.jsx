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
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'Votre commande #1234 a été expédiée', time: 'Il y a 5 min', read: false },
    { id: 2, type: 'promo', message: 'Nouvelle promotion : -20% sur les fruits', time: 'Il y a 1h', read: false },
    { id: 3, type: 'info', message: 'Bienvenue sur DZ-Fellah !', time: 'Il y a 2h', read: true }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

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
          {/* Notification Bell */}
          <div className="notification-wrapper">
            <button 
              className="notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>🔔 Notifications</h4>
                  {unreadCount > 0 && (
                    <button className="mark-all-read" onClick={markAllAsRead}>
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <span className="notif-icon">
                          {notif.type === 'order' ? '📦' : notif.type === 'promo' ? '🎉' : 'ℹ️'}
                        </span>
                        <div className="notif-content">
                          <p className="notif-message">{notif.message}</p>
                          <span className="notif-time">{notif.time}</span>
                        </div>
                        <button 
                          className="notif-delete"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">Aucune notification</p>
                  )}
                </div>
              </div>
            )}
          </div>

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
