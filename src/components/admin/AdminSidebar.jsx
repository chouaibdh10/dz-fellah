import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminSidebar.css'

const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">👑</div>
          <div className="admin-brand-text">
            <h2>Admin Panel</h2>
            <p>{user?.name || 'Administrateur'}</p>
          </div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">👥</span>
          <span>Utilisateurs</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📦</span>
          <span>Produits</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🛒</span>
          <span>Commandes</span>
        </NavLink>

        <NavLink to="/admin/producers" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">🌾</span>
          <span>Producteurs</span>
        </NavLink>

        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📈</span>
          <span>Analytiques</span>
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">⚙️</span>
          <span>Paramètres</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="admin-logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
