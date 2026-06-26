import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import { api } from '../../services/api'
import './ProducerOrders.css'

const Orders = () => {
  const { user } = useAuth()
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

          return {
            id: o.id,
            orderNumber: `CMD-${String(o.id).padStart(6, '0')}`,
            customer: o.client_name || o.client_email,
            date: o.created_at,
            status: o.status,
            items: (o.items || []).map((it) => ({
              product: it.product_name,
              quantity: it.quantity,
              unit: it.product_unit,
              price: Number(it.unit_price)
            })),
            total,
            deliveryAddress: o.address || o.client_address || '',
            phone: o.client_phone || ''
          }
        })
        setOrders(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

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
    api.orders
      .setStatus(orderId, newStatus)
      .then((updated) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
        )
        alert('Statut mis à jour avec succès !')
      })
      .catch((err) => alert(err?.message || 'Erreur lors de la mise à jour'))
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
          {loading ? (
            <div className="no-orders">
              <div className="no-orders-icon">⏳</div>
              <h3>Chargement...</h3>
              <p>Récupération des commandes</p>
            </div>
          ) : filteredOrders.length === 0 ? (
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
