import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ClientLayout from '../../components/client/ClientLayout'
import { api } from '../../services/api'
import './Orders.css'

const Orders = () => {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.orders
      .list()
      .then((list) => {
        const mapped = list.map((o) => {
          const total = (o.items || []).reduce(
            (sum, it) => sum + Number(it.unit_price) * Number(it.quantity),
            0
          )

          const byProducer = (o.items || []).reduce((acc, it) => {
            const name = it.producer_name || it.producer_email || 'Producteur'
            if (!acc[name]) acc[name] = []
            acc[name].push({
              product: it.product_name,
              quantity: it.quantity,
              unit: it.product_unit,
              price: Number(it.unit_price)
            })
            return acc
          }, {})

          return {
            id: o.id,
            orderNumber: `CMD-${String(o.id).padStart(6, '0')}`,
            date: o.created_at,
            status: o.status,
            producers: Object.entries(byProducer).map(([name, items]) => ({ name, items })),
            total
          }
        })
        setOrders(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusInfo = (status) => {
    const statusMap = {
      delivered: { text: 'Livrée', class: 'status-delivered', icon: '✅' },
      processing: { text: 'En cours', class: 'status-progress', icon: '🚚' },
      shipped: { text: 'En cours', class: 'status-progress', icon: '🚚' },
      pending: { text: 'En attente', class: 'status-pending', icon: '⏳' }
    }
    return statusMap[status] || statusMap.pending
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders
    if (filter === 'in_progress') {
      return orders.filter((o) => o.status === 'processing' || o.status === 'shipped')
    }
    return orders.filter((o) => o.status === filter)
  }, [filter, orders])

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  return (
    <ClientLayout>
      <div className="client-orders">
        <div className="container">
          {/* Header Moderne */}
          <div className="orders-page-header">
            <div>
              <h1>📋 Mes Commandes</h1>
              <p className="orders-subtitle">Historique et suivi de vos commandes</p>
            </div>
            <Link to="/products" className="btn btn-primary">
              🛒 Nouvelle commande
            </Link>
          </div>

          {/* Filters Modernes */}
          <div className="orders-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📋 Toutes <span className="filter-count">{stats.total}</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              ⏳ En attente <span className="filter-count">{stats.pending}</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setFilter('in_progress')}
            >
              🚚 En cours <span className="filter-count">{stats.inProgress}</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              ✅ Livrées <span className="filter-count">{stats.delivered}</span>
            </button>
          </div>

          {/* Orders List Moderne */}
          {loading ? (
            <div className="no-orders">
              <div className="no-orders-icon">⏳</div>
              <h3>Chargement...</h3>
              <p>Récupération de vos commandes</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>🧾 {order.orderNumber}</h3>
                        <p className="order-date">
                          {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`order-status ${statusInfo.class}`}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>

                    <div className="order-body">
                      {order.producers.map((producer, idx) => (
                        <div key={idx} className="producer-section">
                          <h4>👨‍🌾 {producer.name}</h4>
                          <ul className="items-list">
                            {producer.items.map((item, i) => (
                              <li key={i}>
                                <span className="item-name">🥬 {item.product}</span>
                                <span className="item-details">{item.quantity} {item.unit} × {item.price} DA</span>
                                <span className="item-price">{(item.quantity * item.price).toLocaleString()} DA</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        💵 Total: <strong>{order.total.toLocaleString()} DA</strong>
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-secondary btn-small">
                          📄 Voir détails
                        </button>
                        {order.status === 'delivered' && (
                          <button className="btn btn-primary btn-small">
                            🔄 Commander à nouveau
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="no-orders">
              <div className="no-orders-icon">📭</div>
              <h3>Aucune commande trouvée</h3>
              <p>Il n'y a pas de commandes correspondant à ce filtre</p>
              <Link to="/products" className="btn btn-primary">
                🛒 Découvrir nos produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

export default Orders
