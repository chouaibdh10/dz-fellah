import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './ProducerDashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { products } = useProducts()

  // Données dynamiques basées sur les produits
  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0)
    const lowStockProducts = products.filter(p => Number(p.stock) <= 10).length
    const seasonalProducts = products.filter(p => p.inSeason).length
    
    return {
      totalProducts: products.length,
      activeOrders: 8,
      monthlyRevenue: 45000,
      totalViews: 234,
      totalStock,
      lowStockProducts,
      seasonalProducts
    }
  }, [products])

  // Données pour le graphique des ventes (simulation)
  const salesData = [
    { month: 'Jan', value: 12000 },
    { month: 'Fév', value: 19000 },
    { month: 'Mar', value: 15000 },
    { month: 'Avr', value: 25000 },
    { month: 'Mai', value: 32000 },
    { month: 'Juin', value: 28000 },
    { month: 'Juil', value: 45000 }
  ]
  const maxSale = Math.max(...salesData.map(d => d.value))

  // Données pour le graphique circulaire des catégories
  const categoryData = [
    { name: 'Légumes', value: 45, color: '#4CAF50' },
    { name: 'Fruits', value: 30, color: '#FF9800' },
    { name: 'Produits laitiers', value: 15, color: '#2196F3' },
    { name: 'Autres', value: 10, color: '#9C27B0' }
  ]

  // Top produits
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(b.stock) - Number(a.stock))
      .slice(0, 4)
  }, [products])

  // Calcul du pourcentage pour le graphique circulaire
  const calculateCircleOffset = (index) => {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += categoryData[i].value
    }
    return offset
  }

  return (
    <ProducerLayout>
      <div className="producer-dashboard">
        <div className="container">
          {/* Header amélioré */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="greeting-section">
                <p className="greeting-date">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h1 className="page-title">Bonjour, {user?.name || 'Producteur'} 👋</h1>
                <p className="welcome-text">Voici un aperçu de votre activité</p>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/producer/shop" className="btn btn-primary">
                + Ajouter un produit
              </Link>
              <Link to="/producer/orders" className="btn btn-secondary">
                📋 Commandes
              </Link>
            </div>
          </div>

          {/* Stats Cards améliorées */}
          <div className="stats-grid">
            <div className="stat-card gradient-green">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🌾</span>
              </div>
              <div className="stat-content">
                <h3>{stats.totalProducts}</h3>
                <p>Produits en ligne</p>
                <span className="stat-badge">{stats.seasonalProducts} de saison</span>
              </div>
              <div className="stat-trend up">
                <span>↑ 12%</span>
              </div>
            </div>

            <div className="stat-card gradient-blue">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📦</span>
              </div>
              <div className="stat-content">
                <h3>{stats.activeOrders}</h3>
                <p>Commandes actives</p>
                <span className="stat-badge">3 en attente</span>
              </div>
              <div className="stat-trend up">
                <span>↑ 8%</span>
              </div>
            </div>

            <div className="stat-card gradient-orange">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">💰</span>
              </div>
              <div className="stat-content">
                <h3>{stats.monthlyRevenue.toLocaleString()} DA</h3>
                <p>Revenus ce mois</p>
                <span className="stat-badge">+15000 DA vs mois dernier</span>
              </div>
              <div className="stat-trend up">
                <span>↑ 23%</span>
              </div>
            </div>

            <div className="stat-card gradient-purple">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">👁️</span>
              </div>
              <div className="stat-content">
                <h3>{stats.totalViews}</h3>
                <p>Vues cette semaine</p>
                <span className="stat-badge">45 visiteurs uniques</span>
              </div>
              <div className="stat-trend down">
                <span>↓ 5%</span>
              </div>
            </div>
          </div>

          {/* Section graphiques */}
          <div className="charts-section">
            {/* Graphique des ventes */}
            <div className="chart-card sales-chart">
              <div className="chart-header">
                <h3>📈 Évolution des ventes</h3>
                <select className="chart-filter">
                  <option>7 derniers mois</option>
                  <option>Cette année</option>
                  <option>Tout</option>
                </select>
              </div>
              <div className="bar-chart">
                {salesData.map((data, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{ height: `${(data.value / maxSale) * 100}%` }}
                      >
                        <span className="bar-value">{(data.value / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-summary">
                <div className="summary-item">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">{salesData.reduce((sum, d) => sum + d.value, 0).toLocaleString()} DA</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Moyenne</span>
                  <span className="summary-value">{Math.round(salesData.reduce((sum, d) => sum + d.value, 0) / salesData.length).toLocaleString()} DA</span>
                </div>
              </div>
            </div>

            {/* Graphique circulaire des catégories */}
            <div className="chart-card category-chart">
              <div className="chart-header">
                <h3>🥧 Répartition par catégorie</h3>
              </div>
              <div className="pie-chart-container">
                <svg className="pie-chart" viewBox="0 0 100 100">
                  {categoryData.map((cat, index) => {
                    const offset = calculateCircleOffset(index)
                    return (
                      <circle
                        key={index}
                        className="pie-segment"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="20"
                        strokeDasharray={`${cat.value * 2.51} ${251 - cat.value * 2.51}`}
                        strokeDashoffset={-offset * 2.51}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                    )
                  })}
                  <text x="50" y="47" textAnchor="middle" className="pie-center-text">
                    {stats.totalProducts}
                  </text>
                  <text x="50" y="58" textAnchor="middle" className="pie-center-label">
                    produits
                  </text>
                </svg>
                <div className="pie-legend">
                  {categoryData.map((cat, index) => (
                    <div key={index} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: cat.color }}></span>
                      <span className="legend-name">{cat.name}</span>
                      <span className="legend-value">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section inférieure */}
          <div className="dashboard-bottom">
            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>⚡ Actions Rapides</h2>
              <div className="actions-grid">
                <Link to="/producer/shop" className="action-card">
                  <div className="action-icon-wrapper green">
                    <span className="action-icon">🌿</span>
                  </div>
                  <div className="action-text">
                    <span className="action-title">Ma boutique</span>
                    <span className="action-desc">Gérer vos produits</span>
                  </div>
                </Link>
                <Link to="/producer/orders" className="action-card">
                  <div className="action-icon-wrapper blue">
                    <span className="action-icon">📋</span>
                  </div>
                  <div className="action-text">
                    <span className="action-title">Commandes</span>
                    <span className="action-desc">{stats.activeOrders} en cours</span>
                  </div>
                </Link>
                <Link to="/producer/profile" className="action-card">
                  <div className="action-icon-wrapper orange">
                    <span className="action-icon">⚙️</span>
                  </div>
                  <div className="action-text">
                    <span className="action-title">Paramètres</span>
                    <span className="action-desc">Mon profil</span>
                  </div>
                </Link>
                <div className="action-card coming-soon">
                  <div className="action-icon-wrapper purple">
                    <span className="action-icon">📊</span>
                  </div>
                  <div className="action-text">
                    <span className="action-title">Analytics</span>
                    <span className="action-desc">Bientôt disponible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Produits */}
            <div className="top-products">
              <h2>🏆 Top Produits</h2>
              <div className="products-list">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <img src={product.photo} alt={product.name} className="product-thumb" />
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">{product.price} DA/{product.unit}</span>
                    </div>
                    <div className="product-stock-mini">
                      <div className="stock-bar-mini">
                        <div 
                          className={`stock-fill-mini ${product.stock > 20 ? 'high' : product.stock > 10 ? 'medium' : 'low'}`}
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        ></div>
                      </div>
                      <span className="stock-text">{product.stock} en stock</span>
                    </div>
                  </div>
                )) : (
                  <p className="no-products">Aucun produit pour le moment</p>
                )}
              </div>
            </div>
          </div>

          {/* Alertes et notifications */}
          {stats.lowStockProducts > 0 && (
            <div className="alerts-section">
              <div className="alert alert-warning">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">
                  <strong>Attention au stock !</strong>
                  <p>{stats.lowStockProducts} produit(s) ont un stock faible (≤10 unités)</p>
                </div>
                <Link to="/producer/shop" className="alert-action">Réapprovisionner →</Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="activity-header">
              <h2>📅 Activité Récente</h2>
              <button className="view-all-btn">Voir tout</button>
            </div>
            <div className="activity-list">
              <div className="activity-item success">
                <span className="activity-icon">✅</span>
                <div className="activity-content">
                  <p><strong>Nouvelle commande</strong> - Tomates Bio (5kg)</p>
                  <span className="activity-time">Il y a 2 heures</span>
                </div>
                <span className="activity-amount">+1,250 DA</span>
              </div>
              <div className="activity-item info">
                <span className="activity-icon">👁️</span>
                <div className="activity-content">
                  <p><strong>Produit consulté</strong> - Oranges Fraîches</p>
                  <span className="activity-time">Il y a 5 heures</span>
                </div>
              </div>
              <div className="activity-item success">
                <span className="activity-icon">⭐</span>
                <div className="activity-content">
                  <p><strong>Nouvel avis</strong> - 5 étoiles sur Miel Local</p>
                  <span className="activity-time">Hier</span>
                </div>
              </div>
              <div className="activity-item warning">
                <span className="activity-icon">📦</span>
                <div className="activity-content">
                  <p><strong>Stock bas</strong> - Pommes de terre (8 restants)</p>
                  <span className="activity-time">Hier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default Dashboard
