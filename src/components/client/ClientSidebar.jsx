import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './ClientSidebar.css'

const ClientSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()

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
      label: 'Mon Panier',
      badge: getItemCount()
    },
    {
      path: '/client/orders',
      icon: '📋',
      label: 'Mes Commandes',
      badge: null
    },
    {
      path: '/client/profile',
      icon: '⚙️',
      label: 'Mon Profil',
      badge: null
    }
  ]

  const handlePhotoClick = () => {
    navigate('/client/profile')
  }

  return (
    <div className="client-sidebar">
      <div className="sidebar-header">
        <button className="client-photo" onClick={handlePhotoClick} title="Modifier ma photo">
          <div className="photo-circle">
            {user?.photo ? (
              <img src={user.photo} alt="Photo de profil" className="profile-img" />
            ) : (
              <span className="photo-placeholder">{user?.name?.charAt(0).toUpperCase() || 'C'}</span>
            )}
          </div>
        </button>
        <h3 className="client-name">{user?.name || 'Client'}</h3>
        <p className="client-email">{user?.email}</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            {item.badge !== null && item.badge > 0 && (
              <span className="menu-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="menu-icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default ClientSidebar
