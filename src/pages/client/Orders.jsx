import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ClientLayout from '../../components/client/ClientLayout'
import './Orders.css'

const Orders = () => {
  const [filter, setFilter] = useState('all')

  const orders = [
    {
      id: 1,
      orderNumber: 'CMD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      producers: [
        {
          name: 'Ferme Ben Ahmed',
          items: [
            { product: 'Tomates Bio', quantity: 5, unit: 'kg', price: 250 },
            { product: 'Concombres', quantity: 3, unit: 'kg', price: 180 }
          ]
        },
        {
          name: 'Verger El Hamri',
          items: [
            { product: 'Oranges', quantity: 2, unit: 'kg', price: 180 }
          ]
        }
      ],
      total: 1970
    },
    {
      id: 2,
      orderNumber: 'CMD-2024-002',
      date: '2024-01-10',
      status: 'in_progress',
      producers: [
        {
          name: 'Rucher Bensalem',
          items: [
            { product: 'Miel Local', quantity: 2, unit: 'pot', price: 1200 }
          ]
        }
      ],
      total: 2400
    },
    {
      id: 3,
      orderNumber: 'CMD-2024-003',
      date: '2024-01-05',
      status: 'pending',
      producers: [
        {
          name: 'Ferme Oasis',
          items: [
            { product: 'Huile d\'olive', quantity: 1, unit: 'litre', price: 800 },
            { product: 'Olives noires', quantity: 2, unit: 'kg', price: 400 }
          ]
        }
      ],
      total: 1600
    }
  ]

  const getStatusInfo = (status) => {
    const statusMap = {
      delivered: { text: 'Livrée', class: 'status-delivered', icon: '✅' },
      in_progress: { text: 'En cours', class: 'status-progress', icon: '🚚' },
      pending: { text: 'En attente', class: 'status-pending', icon: '⏳' }
    }
    return statusMap[status] || statusMap.pending
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
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
          {filteredOrders.length > 0 ? (
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
