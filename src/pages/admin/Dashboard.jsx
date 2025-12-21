import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminDashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    activeProducers: 0,
    pendingOrders: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalUsers: 1245,
      totalProducts: 387,
      totalOrders: 892,
      totalRevenue: 125840,
      newUsers: 156,
      activeProducers: 89,
      pendingOrders: 24,
      monthlyGrowth: 15.3
    })
  }, [])

  const recentActivity = [
    { id: 1, type: 'order', user: 'Ahmed B.', action: 'Nouvelle commande #1234', time: 'Il y a 5 min', icon: '🛒' },
    { id: 2, type: 'user', user: 'Fatima K.', action: 'Inscription utilisateur', time: 'Il y a 12 min', icon: '👤' },
    { id: 3, type: 'product', user: 'Karim M.', action: 'Nouveau produit ajouté', time: 'Il y a 25 min', icon: '📦' },
    { id: 4, type: 'payment', user: 'Sarah L.', action: 'Paiement reçu 2500 DA', time: 'Il y a 1h', icon: '💰' },
    { id: 5, type: 'review', user: 'Mohamed A.', action: 'Nouvel avis produit', time: 'Il y a 2h', icon: '⭐' }
  ]

  const salesData = [
    { month: 'Jan', value: 45000 },
    { month: 'Fév', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Avr', value: 65000 },
    { month: 'Mai', value: 78000 },
    { month: 'Juin', value: 95000 },
    { month: 'Juil', value: 125840 }
  ]
  const maxSale = Math.max(...salesData.map(d => d.value))

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1>Tableau de Bord</h1>
            <p>Vue d'ensemble de votre plateforme</p>
          </div>
          <button className="btn-primary">
            📊 Exporter Rapport
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Utilisateurs Total</p>
              <span className="stat-change positive">+{stats.newUsers} ce mois</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Produits</p>
              <span className="stat-change positive">+{stats.activeProducers} producteurs actifs</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Commandes Total</p>
              <span className="stat-change attention">{stats.pendingOrders} en attente</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{stats.totalRevenue.toLocaleString()} DA</h3>
              <p>Revenus Total</p>
              <span className="stat-change positive">+{stats.monthlyGrowth}% ce mois</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Évolution des Ventes</h3>
              <select className="chart-filter">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>Cette année</option>
              </select>
            </div>
            <div className="bar-chart">
              {salesData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ height: `${(item.value / maxSale) * 100}%` }}
                    data-value={item.value.toLocaleString()}
                  ></div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Répartition par Catégorie</h3>
            </div>
            <div className="category-stats">
              <div className="category-item">
                <div className="category-bar">
                  <div className="category-fill vegetables" style={{ width: '65%' }}></div>
                </div>
                <div className="category-info">
                  <span>🥬 Légumes</span>
                  <strong>65%</strong>
                </div>
              </div>
              <div className="category-item">
                <div className="category-bar">
                  <div className="category-fill fruits" style={{ width: '45%' }}></div>
                </div>
                <div className="category-info">
                  <span>🍎 Fruits</span>
                  <strong>45%</strong>
                </div>
              </div>
              <div className="category-item">
                <div className="category-bar">
                  <div className="category-fill dairy" style={{ width: '35%' }}></div>
                </div>
                <div className="category-info">
                  <span>🥛 Produits Laitiers</span>
                  <strong>35%</strong>
                </div>
              </div>
              <div className="category-item">
                <div className="category-bar">
                  <div className="category-fill other" style={{ width: '25%' }}></div>
                </div>
                <div className="category-info">
                  <span>🌾 Autres</span>
                  <strong>25%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <div className="activity-header">
            <h3>Activité Récente</h3>
            <button className="btn-link">Voir tout</button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p><strong>{activity.user}</strong> - {activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
