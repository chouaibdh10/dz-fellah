import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './ClientDashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { cart, getTotalPrice } = useCart()

  const stats = {
    totalOrders: 15,
    activeOrders: 3,
    totalSpent: 25000,
    savedMoney: 3500
  }

  const recentOrders = [
    {
      id: 1,
      date: '2024-01-15',
      status: 'delivered',
      total: 2500,
      items: 'Tomates, Oranges, Miel'
    },
    {
      id: 2,
      date: '2024-01-10',
      status: 'in_progress',
      total: 1800,
      items: 'Pommes de terre, Oignons'
    },
    {
      id: 3,
      date: '2024-01-05',
      status: 'delivered',
      total: 3200,
      items: 'Olives, Huile d\'olive'
    }
  ]

  const favoriteProducers = [
    { id: 1, name: 'Ferme Ben Ahmed', products: 8, rating: 4.8 },
    { id: 2, name: 'Verger El Hamri', products: 5, rating: 4.9 },
    { id: 3, name: 'Rucher Bensalem', products: 3, rating: 5.0 }
  ]

  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Livrée'
      case 'in_progress': return 'En cours'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered': return 'status-delivered'
      case 'in_progress': return 'status-progress'
      case 'pending': return 'status-pending'
      default: return ''
    }
  }

  return (
    <div className="client-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Mon Espace Client</h1>
            <p className="welcome-text">Bienvenue, {user?.name || 'Client'} !</p>
          </div>
          <Link to="/products" className="btn btn-primary">
            🛒 Continuer mes achats
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
              📦
            </div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Commandes totales</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>
              🚚
            </div>
            <div className="stat-content">
              <h3>{stats.activeOrders}</h3>
              <p>Commandes en cours</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>
              💰
            </div>
            <div className="stat-content">
              <h3>{stats.totalSpent.toLocaleString()} DA</h3>
              <p>Dépenses totales</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#9C27B0' }}>
              💚
            </div>
            <div className="stat-content">
              <h3>{stats.savedMoney.toLocaleString()} DA</h3>
              <p>Économies réalisées</p>
            </div>
          </div>
        </div>

        {/* Current Cart */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>🛒 Votre Panier Actuel</h2>
            <div className="cart-info">
              <p><strong>{cart.length}</strong> article(s) dans votre panier</p>
              <p className="cart-total">Total: <strong>{getTotalPrice().toLocaleString()} DA</strong></p>
              <Link to="/cart" className="btn btn-primary">
                Voir mon panier
              </Link>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Mes Dernières Commandes</h2>
            <Link to="/client/orders" className="view-all">Voir tout</Link>
          </div>
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-date">📅 {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                    <p className="order-items">{order.items}</p>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-footer">
                  <p className="order-total">Total: <strong>{order.total.toLocaleString()} DA</strong></p>
                  <Link to={`/client/orders/${order.id}`} className="btn btn-secondary btn-small">
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Producers */}
        <div className="favorite-producers">
          <h2>Mes Producteurs Favoris</h2>
          <div className="producers-grid">
            {favoriteProducers.map(producer => (
              <div key={producer.id} className="producer-card">
                <div className="producer-icon">👨‍🌾</div>
                <h3>{producer.name}</h3>
                <p>{producer.products} produits disponibles</p>
                <div className="producer-rating">
                  ⭐ {producer.rating}/5
                </div>
                <Link to={`/producers/${producer.id}`} className="btn btn-secondary btn-small">
                  Voir la boutique
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <Link to="/products" className="action-card">
              <span className="action-icon">🛒</span>
              <span>Acheter des produits</span>
            </Link>
            <Link to="/client/orders" className="action-card">
              <span className="action-icon">📋</span>
              <span>Mes commandes</span>
            </Link>
            <Link to="/client/favorites" className="action-card">
              <span className="action-icon">❤️</span>
              <span>Mes favoris</span>
            </Link>
            <Link to="/client/profile" className="action-card">
              <span className="action-icon">⚙️</span>
              <span>Mon profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
