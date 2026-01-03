import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import '../../styles/ProducerDashboard.css'
import { productsAPI } from '../../utils/api'

const formatDa = (value) => {
  if (value === null || value === undefined) return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return `${n.toLocaleString()} DA`
}

const timeAgo = (iso) => {
  if (!iso) return ''
  const then = new Date(iso)
  const now = new Date()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'À l’instant'
  if (diffMin < 60) return `Il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `Il y a ${diffH} h`
  const diffD = Math.floor(diffH / 24)
  return `Il y a ${diffD} j`
}

const categoryName = (code) => {
  const map = {
    fruits: 'Fruits',
    legumes: 'Légumes',
    agrumes: 'Agrumes',
    dattes: 'Dattes',
    miel: 'Miel',
    huiles: 'Huiles',
    cereales: 'Céréales et farines',
    autres: 'Autres',
  }
  return map[code] || code
}

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [overview, setOverview] = useState(null)
  const [salesTrend, setSalesTrend] = useState(null)
  const [categoryBreakdown, setCategoryBreakdown] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    let alive = true
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const [o, trend, cat, top, act] = await Promise.all([
          productsAPI.getDashboardOverview(),
          productsAPI.getDashboardSalesTrend(),
          productsAPI.getDashboardCategoryBreakdown(),
          productsAPI.getDashboardTopProducts(),
          productsAPI.getDashboardRecentActivity(),
        ])
        if (!alive) return
        setOverview(o)
        setSalesTrend(trend)
        setCategoryBreakdown(cat)
        setTopProducts(top?.products || [])
        setRecentActivity(act?.activity || [])
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Erreur de chargement')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    return {
      totalProducts: overview?.total_products ?? 0,
      activeOrders: overview?.active_orders ?? 0,
      monthlyRevenue: overview?.monthly_revenue ?? 0,
      totalStock: overview?.total_stock ?? 0,
      lowStockProducts: overview?.low_stock_products ?? 0,
      seasonalProducts: overview?.seasonal_products ?? 0,
    }
  }, [overview])

  const salesData = useMemo(() => {
    const months = salesTrend?.months || []
    return months.map((m) => ({
      month: (m.label || '').split(' ')[0] || m.month,
      value: Number(m.total_revenue) || 0,
    }))
  }, [salesTrend])

  const maxSale = Math.max(1, ...salesData.map(d => d.value))

  const categoryData = useMemo(() => {
    const colors = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0']
    const dist = categoryBreakdown?.distribution || []
    return dist.slice(0, 4).map((c, idx) => ({
      name: categoryName(c.category),
      value: Number(c.percentage) || 0,
      color: colors[idx % colors.length],
    }))
  }, [categoryBreakdown])

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
          </div>

          {/* Stats Cards améliorées */}
          <div className="stats-grid">
            <div className="stat-card gradient-green">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🌾</span>
              </div>
              <div className="stat-content">
                <h3>{loading ? '…' : stats.totalProducts}</h3>
                <p>Produits en ligne</p>
                <span className="stat-badge">{loading ? '…' : `${stats.seasonalProducts} de saison`}</span>
              </div>
              <div className="stat-trend up">
                <span>{loading ? '…' : '—'}</span>
              </div>
            </div>

            <div className="stat-card gradient-blue">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📦</span>
              </div>
              <div className="stat-content">
                <h3>{loading ? '…' : stats.activeOrders}</h3>
                <p>Commandes actives</p>
                <span className="stat-badge">{loading ? '…' : 'En cours'}</span>
              </div>
              <div className="stat-trend up">
                <span>{loading ? '…' : '—'}</span>
              </div>
            </div>

            <div className="stat-card gradient-orange">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">💰</span>
              </div>
              <div className="stat-content">
                <h3>{loading ? '…' : formatDa(stats.monthlyRevenue)}</h3>
                <p>Revenus ce mois</p>
                <span className="stat-badge">{loading ? '…' : 'Calculé sur commandes réalisées'}</span>
              </div>
              <div className="stat-trend up">
                <span>{loading ? '…' : '—'}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="chart-card" style={{ marginBottom: 16 }}>
              <div className="chart-header">
                <h3>⚠️ Erreur</h3>
              </div>
              <div style={{ color: 'var(--text-light)', fontWeight: 700 }}>{error}</div>
            </div>
          )}

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
                  <span className="summary-value">{formatDa(salesData.reduce((sum, d) => sum + d.value, 0))}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Moyenne</span>
                  <span className="summary-value">
                    {salesData.length ? formatDa(Math.round(salesData.reduce((sum, d) => sum + d.value, 0) / salesData.length)) : '—'}
                  </span>
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
                    {loading ? '…' : stats.totalProducts}
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
            
            {/* Top Produits */}
            <div className="top-products">
              <h2>🏆 Top Produits</h2>
              <div className="products-list">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <div key={product.id || index} className="product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <img src={product.photo} alt={product.name} className="product-thumb" />
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">{Number(product.price || 0).toLocaleString()} DA/{product.unit_type || ''}</span>
                    </div>
                    <div className="product-stock-mini">
                      <div className="stock-bar-mini">
                        <div 
                          className={`stock-fill-mini ${Number(product.stock_quantity) > 20 ? 'high' : Number(product.stock_quantity) > 10 ? 'medium' : 'low'}`}
                          style={{ width: `${Math.min(Number(product.stock_quantity || 0), 100)}%` }}
                        ></div>
                      </div>
                      <span className="stock-text">{Number(product.stock_quantity || 0)} en stock</span>
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
              {recentActivity.length > 0 ? recentActivity.map((a) => (
                <div key={a.id} className={`activity-item ${a.status === 'cancelled' ? 'warning' : 'success'}`}>
                  <span className="activity-icon">{a.status === 'cancelled' ? '⚠️' : '✅'}</span>
                  <div className="activity-content">
                    <p>
                      <strong>Commande</strong> — {a.client_name} ({a.total_items} articles)
                    </p>
                    <span className="activity-time">{timeAgo(a.created_at)}</span>
                  </div>
                  <span className="activity-amount">{formatDa(a.subtotal)}</span>
                </div>
              )) : (
                <div className="activity-item">
                  <span className="activity-icon">ℹ️</span>
                  <div className="activity-content">
                    <p><strong>Aucune activité</strong> pour le moment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default Dashboard
