import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ProducerDashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = {
    totalProducts: 12,
    activeOrders: 8,
    monthlyRevenue: 45000,
    totalViews: 234
  }

  return (
    <div className="producer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Tableau de Bord Producteur</h1>
            <p className="welcome-text">Bienvenue, {user?.name || 'Producteur'} !</p>
          </div>
          <Link to="/producer/products" className="btn btn-primary">
            + Ajouter un produit
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
              🌾
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Produits en ligne</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>
              📦
            </div>
            <div className="stat-content">
              <h3>{stats.activeOrders}</h3>
              <p>Commandes actives</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>
              💰
            </div>
            <div className="stat-content">
              <h3>{stats.monthlyRevenue.toLocaleString()} DA</h3>
              <p>Revenus ce mois</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#9C27B0' }}>
              👁️
            </div>
            <div className="stat-content">
              <h3>{stats.totalViews}</h3>
              <p>Vues cette semaine</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <Link to="/producer/products" className="action-card">
              <span className="action-icon">📦</span>
              <span>Gérer mes produits</span>
            </Link>
            <Link to="/producer/shop" className="action-card">
              <span className="action-icon">🏪</span>
              <span>Ma boutique</span>
            </Link>
            <Link to="/producer/orders" className="action-card">
              <span className="action-icon">📋</span>
              <span>Voir les commandes</span>
            </Link>
            <Link to="/producer/analytics" className="action-card">
              <span className="action-icon">📊</span>
              <span>Statistiques</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Activité Récente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <p><strong>Nouvelle commande</strong> - Tomates Bio (5kg)</p>
                <span className="activity-time">Il y a 2 heures</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👁️</span>
              <div className="activity-content">
                <p><strong>Produit consulté</strong> - Oranges Fraîches</p>
                <span className="activity-time">Il y a 5 heures</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⭐</span>
              <div className="activity-content">
                <p><strong>Nouvel avis</strong> - 5 étoiles sur Miel Local</p>
                <span className="activity-time">Hier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
