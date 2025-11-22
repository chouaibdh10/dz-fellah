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

  return (
    <ClientLayout>
      <div className="client-orders">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Mes Commandes</h1>
              <p className="page-subtitle">Historique et suivi de vos commandes</p>
            </div>
          </div>

          {/* Filters */}
          <div className="orders-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
            <button 
              className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setFilter('in_progress')}
            >
              En cours
            </button>
            <button 
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              Livrées
            </button>
          </div>

          {/* Orders List */}
          <div className="orders-list">
            {filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>{order.orderNumber}</h3>
                      <p className="order-date">
                        📅 {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`order-badge ${statusInfo.class}`}>
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
                              {item.product} - {item.quantity} {item.unit} × {item.price} DA
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      Total: <strong>{order.total.toLocaleString()} DA</strong>
                    </div>
                    <button className="btn btn-secondary btn-small">
                      Voir détails
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="no-orders">
              <p>Aucune commande trouvée</p>
              <Link to="/products" className="btn btn-primary">
                Commander des produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

export default Orders
