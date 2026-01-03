import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ordersAPI } from '../../utils/api'
import ProducerLayout from '../../components/producer/ProducerLayout'
import '../../styles/ProducerOrders.css'

const Orders = () => {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ordersAPI.listProducerSubOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load producer suborders:', err)
        setOrders([])
        setError(err?.message || 'Impossible de charger les commandes')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: 'En attente', class: 'status-pending', icon: '⏳' },
      in_preparation: { text: 'En préparation', class: 'status-processing', icon: '📦' },
      ready: { text: 'Prête', class: 'status-processing', icon: '📦' },
      picked_up: { text: 'Récupérée', class: 'status-processing', icon: '📦' },
      delivered: { text: 'Livrée', class: 'status-delivered', icon: '✅' },
      cancelled: { text: 'Annulée', class: 'status-cancelled', icon: '❌' }
    }
    return statusMap[status] || statusMap.pending
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await ordersAPI.updateProducerSubOrderStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      alert('Statut mis à jour avec succès !')
    } catch (err) {
      console.error('Status update failed:', err)
      alert(err?.message || 'Erreur lors de la mise à jour du statut')
    }
  }

  const promptStatusChange = (order) => {
    if (!order) return
    if (order.status === 'delivered' || order.status === 'cancelled') return

    const allowed = ['pending', 'in_preparation', 'ready', 'picked_up', 'delivered', 'cancelled']
    const next = window.prompt(
      `Nouveau statut (${allowed.join(', ')}):`,
      order.status || 'pending'
    )
    if (!next) return
    const normalized = String(next).trim()
    if (!allowed.includes(normalized)) {
      alert('Statut invalide.')
      return
    }
    handleStatusChange(order.id, normalized)
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((order) => order.status === filter)
  }, [orders, filter])

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === 'pending').length
    const inPreparation = orders.filter((o) => o.status === 'in_preparation').length
    const delivered = orders.filter((o) => o.status === 'delivered').length
    const revenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0)
    return { total, pending, inPreparation, delivered, revenue }
  }, [orders])

  const formatClientAddress = (client) => {
    if (!client) return 'Non renseignée'
    const parts = [client.address, client.city, client.wilaya].map((v) => (v ? String(v).trim() : '')).filter(Boolean)
    return parts.length ? parts.join(', ') : 'Non renseignée'
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
              <h3>{stats.inPreparation}</h3>
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
            className={`filter-btn ${filter === 'in_preparation' ? 'active' : ''}`}
            onClick={() => setFilter('in_preparation')}
          >
            🔄 En préparation ({stats.inPreparation})
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
              <p>Récupération de vos commandes</p>
            </div>
          ) : error ? (
            <div className="no-orders">
              <div className="no-orders-icon">⚠️</div>
              <h3>Impossible de charger les commandes</h3>
              <p>{error}</p>
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
              const client = order.client
              const customerName = client?.full_name || client?.email || 'Client'
              const phone = client?.phone || 'Non renseigné'
              const deliveryAddress = formatClientAddress(client)
              const items = Array.isArray(order.items) ? order.items : []
              const dateValue = order.created_at || order.updated_at
              const total = Number(order.subtotal) || 0
              return (
                <div key={order.id} className="order-card-detail">
                  <div className="order-card-header">
                    <div className="order-main-info">
                      <h3>🧾 CMD-{String(order.id).padStart(6, '0')}</h3>
                      <span
                        className={`order-badge ${statusInfo.class}`}
                        role="button"
                        tabIndex={0}
                        title={(order.status === 'delivered' || order.status === 'cancelled')
                          ? 'Statut final'
                          : 'Cliquer pour changer le statut'}
                        onClick={() => promptStatusChange(order)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') promptStatusChange(order)
                        }}
                      >
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>
                    <div className="order-date">
                      📅 {dateValue
                        ? new Date(dateValue).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '—'}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-customer-info">
                      <h4>👤 Informations client</h4>
                      <div className="customer-detail">
                        <span className="label">🧑 Nom:</span>
                        <span className="value">{customerName}</span>
                      </div>
                      <div className="customer-detail">
                        <span className="label">📞 Téléphone:</span>
                        <span className="value">{phone}</span>
                      </div>
                      <div className="customer-detail">
                        <span className="label">📍 Adresse:</span>
                        <span className="value">{deliveryAddress}</span>
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
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td>🥬 {item.product_name || 'Produit'}</td>
                              <td>{item.quantity} {item.sale_unit || ''}</td>
                              <td>{Math.round(Number(item.unit_price) || 0).toLocaleString()} DA</td>
                              <td><strong>{Math.round(Number(item.total_price) || 0).toLocaleString()} DA</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="order-total-row">
                        <span className="total-label">💵 Total de la commande:</span>
                        <span className="total-amount">{Math.round(total).toLocaleString()} DA</span>
                      </div>
                    </div>
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
