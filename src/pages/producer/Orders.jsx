import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './ProducerOrders.css'

const Orders = () => {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')

  const orders = [
    {
      id: 1,
      orderNumber: 'CMD-2024-001',
      customer: 'Ahmed Benali',
      date: '2024-01-15',
      status: 'pending',
      items: [
        { product: 'Tomates Bio', quantity: 5, unit: 'kg', price: 250 },
        { product: 'Concombres', quantity: 3, unit: 'kg', price: 180 }
      ],
      total: 1790,
      deliveryAddress: 'Alger, Hydra',
      phone: '+213 555 12 34 56'
    },
    {
      id: 2,
      orderNumber: 'CMD-2024-002',
      customer: 'Fatima Brahimi',
      date: '2024-01-14',
      status: 'processing',
      items: [
        { product: 'Oranges Fraîches', quantity: 10, unit: 'kg', price: 180 },
        { product: 'Miel Local', quantity: 2, unit: 'pot', price: 1200 }
      ],
      total: 4200,
      deliveryAddress: 'Oran, Les Plateaux',
      phone: '+213 555 98 76 54'
    },
    {
      id: 3,
      orderNumber: 'CMD-2024-003',
      customer: 'Karim Djebbar',
      date: '2024-01-12',
      status: 'delivered',
      items: [
        { product: 'Pommes de terre', quantity: 15, unit: 'kg', price: 120 }
      ],
      total: 1800,
      deliveryAddress: 'Constantine, Ville nouvelle',
      phone: '+213 555 11 22 33'
    },
    {
      id: 4,
      orderNumber: 'CMD-2024-004',
      customer: 'Samira Meziane',
      date: '2024-01-11',
      status: 'cancelled',
      items: [
        { product: 'Courgettes', quantity: 4, unit: 'kg', price: 150 }
      ],
      total: 600,
      deliveryAddress: 'Blida, Centre-ville',
      phone: '+213 555 44 55 66'
    },
    {
      id: 5,
      orderNumber: 'CMD-2024-005',
      customer: 'Yacine Lounis',
      date: '2024-01-10',
      status: 'delivered',
      items: [
        { product: 'Olives', quantity: 8, unit: 'kg', price: 350 },
        { product: 'Huile d\'olive', quantity: 1, unit: 'litre', price: 800 }
      ],
      total: 3600,
      deliveryAddress: 'Tizi Ouzou, Nouvelle Ville',
      phone: '+213 555 77 88 99'
    }
  ]

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: 'En attente', class: 'status-pending', icon: '⏳' },
      processing: { text: 'En préparation', class: 'status-processing', icon: '📦' },
      delivered: { text: 'Livrée', class: 'status-delivered', icon: '✅' },
      cancelled: { text: 'Annulée', class: 'status-cancelled', icon: '❌' }
    }
    return statusMap[status] || statusMap.pending
  }

  const handleStatusChange = (orderId, newStatus) => {
    // TODO: Appeler l'API pour changer le statut
    console.log(`Changement de statut de la commande ${orderId} vers ${newStatus}`)
    alert(`Statut mis à jour avec succès !`)
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0)
  }

  return (
    <ProducerLayout>
      <div className="producer-orders">
        <div className="container">
        {/* Header Moderne */}
        <div className="orders-header">
          <div>
            <h1 className="page-title">📋 Mes Commandes</h1>
            <p className="orders-subtitle">Gérez toutes vos commandes en un seul endroit</p>
          </div>
          <Link to="/producer/dashboard" className="btn btn-secondary">
            ← Tableau de bord
          </Link>
        </div>

        {/* Stats Cards Modernes */}
        <div className="orders-stats">
          <div className="stat-card-mini">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total commandes</p>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{stats.pending}</h3>
              <p>En attente</p>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon">🔄</div>
            <div>
              <h3>{stats.processing}</h3>
              <p>En préparation</p>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{stats.delivered}</h3>
              <p>Livrées</p>
            </div>
          </div>
          <div className="stat-card-mini highlight">
            <div className="stat-icon">💰</div>
            <div>
              <h3>{stats.revenue.toLocaleString()} DA</h3>
              <p>Chiffre d'affaires</p>
            </div>
          </div>
        </div>

        {/* Filters Modernes */}
        <div className="orders-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📋 Toutes ({stats.total})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            ⏳ En attente ({stats.pending})
          </button>
          <button 
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            🔄 En préparation ({stats.processing})
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            ✅ Livrées ({stats.delivered})
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            ❌ Annulées
          </button>
        </div>

        {/* Orders List Moderne */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📭</div>
              <h3>Aucune commande trouvée</h3>
              <p>Il n'y a pas de commandes correspondant à ce filtre</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div key={order.id} className="order-card-detail">
                  <div className="order-card-header">
                    <div className="order-main-info">
                      <h3>🧾 {order.orderNumber}</h3>
                      <span className={`order-badge ${statusInfo.class}`}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>
                    <div className="order-date">
                      📅 {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-customer-info">
                      <h4>👤 Informations client</h4>
                      <div className="customer-detail">
                        <span className="label">🧑 Nom:</span>
                        <span className="value">{order.customer}</span>
                      </div>
                      <div className="customer-detail">
                        <span className="label">📞 Téléphone:</span>
                        <span className="value">{order.phone}</span>
                      </div>
                      <div className="customer-detail">
                        <span className="label">📍 Adresse:</span>
                        <span className="value">{order.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="order-items">
                      <h4>🛒 Articles commandés</h4>
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Sous-total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td>🥬 {item.product}</td>
                              <td>{item.quantity} {item.unit}</td>
                              <td>{item.price.toLocaleString()} DA</td>
                              <td><strong>{(item.quantity * item.price).toLocaleString()} DA</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="order-total-row">
                        <span className="total-label">💵 Total de la commande:</span>
                        <span className="total-amount">{order.total.toLocaleString()} DA</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success btn-small"
                          onClick={() => handleStatusChange(order.id, 'processing')}
                        >
                          ✓ Accepter
                        </button>
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                        >
                          ✗ Refuser
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        className="btn btn-success btn-small"
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                      >
                        🚚 Marquer comme livrée
                      </button>
                    )}
                    <button className="btn btn-secondary btn-small">
                      📄 Voir détails
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  </ProducerLayout>
  )
}

export default Orders
