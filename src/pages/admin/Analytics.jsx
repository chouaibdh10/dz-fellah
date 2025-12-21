import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminAnalytics.css'

const Analytics = () => {
  const [period, setPeriod] = useState('month')

  const performanceData = {
    revenue: {
      current: 125840,
      previous: 109500,
      growth: 14.9
    },
    orders: {
      current: 892,
      previous: 756,
      growth: 18
    },
    users: {
      current: 1245,
      previous: 1089,
      growth: 14.3
    },
    products: {
      current: 387,
      previous: 342,
      growth: 13.2
    }
  }

  const topProducts = [
    { name: 'Tomates Bio', sales: 340, revenue: 85000 },
    { name: 'Pommes Rouges', sales: 280, revenue: 98000 },
    { name: 'Oranges', sales: 350, revenue: 98000 },
    { name: 'Lait Frais', sales: 450, revenue: 54000 },
    { name: 'Fromage', sales: 180, revenue: 81000 }
  ]

  const topProducers = [
    { name: 'Amina Brahim', products: 67, sales: 189000 },
    { name: 'Fatima Kouider', products: 45, sales: 125000 },
    { name: 'Karim Ferme', products: 32, sales: 95000 },
    { name: 'Hamza Bio', products: 28, sales: 78000 },
    { name: 'Yasmine Farm', products: 24, sales: 65000 }
  ]

  const regionData = [
    { region: 'Alger', orders: 342, percentage: 38 },
    { region: 'Oran', orders: 245, percentage: 27 },
    { region: 'Constantine', orders: 178, percentage: 20 },
    { region: 'Annaba', orders: 89, percentage: 10 },
    { region: 'Autres', orders: 38, percentage: 5 }
  ]

  return (
    <AdminLayout>
      <div className="admin-analytics">
        <div className="admin-header">
          <div>
            <h1>Analytiques</h1>
            <p>Statistiques détaillées de la plateforme</p>
          </div>
          <select 
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        {/* Performance Cards */}
        <div className="performance-grid">
          <div className="performance-card">
            <div className="perf-header">
              <span className="perf-icon">💰</span>
              <h3>Revenus</h3>
            </div>
            <div className="perf-value">{performanceData.revenue.current.toLocaleString()} DA</div>
            <div className="perf-comparison">
              <span className="growth positive">↗ +{performanceData.revenue.growth}%</span>
              <span className="prev-value">vs {performanceData.revenue.previous.toLocaleString()} DA</span>
            </div>
          </div>

          <div className="performance-card">
            <div className="perf-header">
              <span className="perf-icon">🛒</span>
              <h3>Commandes</h3>
            </div>
            <div className="perf-value">{performanceData.orders.current}</div>
            <div className="perf-comparison">
              <span className="growth positive">↗ +{performanceData.orders.growth}%</span>
              <span className="prev-value">vs {performanceData.orders.previous}</span>
            </div>
          </div>

          <div className="performance-card">
            <div className="perf-header">
              <span className="perf-icon">👥</span>
              <h3>Utilisateurs</h3>
            </div>
            <div className="perf-value">{performanceData.users.current}</div>
            <div className="perf-comparison">
              <span className="growth positive">↗ +{performanceData.users.growth}%</span>
              <span className="prev-value">vs {performanceData.users.previous}</span>
            </div>
          </div>

          <div className="performance-card">
            <div className="perf-header">
              <span className="perf-icon">📦</span>
              <h3>Produits</h3>
            </div>
            <div className="perf-value">{performanceData.products.current}</div>
            <div className="perf-comparison">
              <span className="growth positive">↗ +{performanceData.products.growth}%</span>
              <span className="prev-value">vs {performanceData.products.previous}</span>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Top Products */}
          <div className="analytics-card">
            <h3>🏆 Top Produits</h3>
            <div className="ranking-list">
              {topProducts.map((product, index) => (
                <div key={index} className="ranking-item">
                  <div className="rank-number">#{index + 1}</div>
                  <div className="rank-info">
                    <div className="rank-name">{product.name}</div>
                    <div className="rank-stats">
                      {product.sales} ventes • {product.revenue.toLocaleString()} DA
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Producers */}
          <div className="analytics-card">
            <h3>🌾 Top Producteurs</h3>
            <div className="ranking-list">
              {topProducers.map((producer, index) => (
                <div key={index} className="ranking-item">
                  <div className="rank-number">#{index + 1}</div>
                  <div className="rank-info">
                    <div className="rank-name">{producer.name}</div>
                    <div className="rank-stats">
                      {producer.products} produits • {producer.sales.toLocaleString()} DA
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="analytics-card wide">
            <h3>📍 Répartition Géographique</h3>
            <div className="region-list">
              {regionData.map((region, index) => (
                <div key={index} className="region-item">
                  <div className="region-info">
                    <span className="region-name">{region.region}</span>
                    <span className="region-orders">{region.orders} commandes</span>
                  </div>
                  <div className="region-bar">
                    <div 
                      className="region-fill" 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="region-percentage">{region.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics
