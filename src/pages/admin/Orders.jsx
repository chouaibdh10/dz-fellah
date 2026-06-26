import React, { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import './AdminOrders.css'

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.orders
      .list()
      .then((list) => {
        const mapped = list.map((o) => {
          const itemsCount = (o.items || []).reduce((sum, it) => sum + Number(it.quantity), 0)
          const total = (o.items || []).reduce(
            (sum, it) => sum + Number(it.unit_price) * Number(it.quantity),
            0
          )
          return {
            id: `#CMD-${String(o.id).padStart(3, '0')}`,
            rawId: o.id,
            customer: o.client_name || o.client_email,
            date: o.created_at,
            items: itemsCount,
            total,
            status: o.status,
            payment: 'paid'
          }
        })
        setOrders(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredOrders = useMemo(
    () => orders.filter(order => filterStatus === 'all' || order.status === filterStatus),
    [orders, filterStatus]
  )

  const getStatusInfo = (status) => {
    const statuses = {
      pending: { class: 'status-pending', text: 'En attente', icon: '⏳' },
      processing: { class: 'status-processing', text: 'En cours', icon: '🔄' },
      shipped: { class: 'status-shipped', text: 'Expédiée', icon: '🚚' },
      delivered: { class: 'status-delivered', text: 'Livrée', icon: '✅' },
      cancelled: { class: 'status-cancelled', text: 'Annulée', icon: '❌' }
    }
    return statuses[status] || statuses.pending
  }

  const getPaymentInfo = (payment) => {
    const payments = {
      paid: { class: 'payment-paid', text: 'Payé' },
      pending: { class: 'payment-pending', text: 'En attente' },
      refunded: { class: 'payment-refunded', text: 'Remboursé' }
    }
    return payments[payment] || payments.pending
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  const handleStatusChange = (orderId, newStatus) => {
    const found = orders.find((o) => o.id === orderId)
    if (!found) return
    api.orders
      .setStatus(found.rawId, newStatus)
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)))
      })
      .catch(() => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      })
  }

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="admin-header">
          <div>
            <h1>Gestion des Commandes</h1>
            <p>Suivez et gérez toutes les commandes</p>
          </div>
          <button className="btn-primary">
            📊 Exporter
          </button>
        </div>

        {/* Stats */}
        <div className="orders-stats">
          <div className="orders-stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Commandes</p>
            </div>
          </div>
          <div className="orders-stat-card pending">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{stats.pending}</h3>
              <p>En Attente</p>
            </div>
          </div>
          <div className="orders-stat-card processing">
            <div className="stat-icon">🔄</div>
            <div>
              <h3>{stats.processing}</h3>
              <p>En Cours</p>
            </div>
          </div>
          <div className="orders-stat-card shipped">
            <div className="stat-icon">🚚</div>
            <div>
              <h3>{stats.shipped}</h3>
              <p>Expédiées</p>
            </div>
          </div>
          <div className="orders-stat-card delivered">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{stats.delivered}</h3>
              <p>Livrées</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-controls">
          <div className="filter-tabs">
            <button 
              className={filterStatus === 'all' ? 'active' : ''}
              onClick={() => setFilterStatus('all')}
            >
              Toutes
            </button>
            <button 
              className={filterStatus === 'pending' ? 'active' : ''}
              onClick={() => setFilterStatus('pending')}
            >
              En attente
            </button>
            <button 
              className={filterStatus === 'processing' ? 'active' : ''}
              onClick={() => setFilterStatus('processing')}
            >
              En cours
            </button>
            <button 
              className={filterStatus === 'shipped' ? 'active' : ''}
              onClick={() => setFilterStatus('shipped')}
            >
              Expédiées
            </button>
            <button 
              className={filterStatus === 'delivered' ? 'active' : ''}
              onClick={() => setFilterStatus('delivered')}
            >
              Livrées
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {loading ? (
            <div className="no-results">
              <p>Chargement...</p>
            </div>
          ) : (
          filteredOrders.map(order => {
            const statusInfo = getStatusInfo(order.status)
            const paymentInfo = getPaymentInfo(order.payment)
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <h3>{order.id}</h3>
                    <p>{new Date(order.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                  <div className="order-badges">
                    <span className={`status-badge ${statusInfo.class}`}>
                      {statusInfo.icon} {statusInfo.text}
                    </span>
                    <span className={`payment-badge ${paymentInfo.class}`}>
                      {paymentInfo.text}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-info-grid">
                    <div className="info-item">
                      <span className="info-label">Client</span>
                      <span className="info-value">👤 {order.customer}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Articles</span>
                      <span className="info-value">📦 {order.items} produits</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total</span>
                      <span className="info-value total">💰 {order.total.toLocaleString()} DA</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button className="btn-view">👁️ Détails</button>
                    <select 
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En cours</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    <button className="btn-print">🖨️</button>
                  </div>
                </div>
              </div>
            )
          }))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Orders
