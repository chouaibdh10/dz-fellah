import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminOrders.css'

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [orders, setOrders] = useState([
    {
      id: '#CMD-001',
      customer: 'Ahmed Benali',
      date: '2024-12-20',
      items: 5,
      total: 4500,
      status: 'pending',
      payment: 'paid'
    },
    {
      id: '#CMD-002',
      customer: 'Karim Meziane',
      date: '2024-12-20',
      items: 3,
      total: 2800,
      status: 'processing',
      payment: 'paid'
    },
    {
      id: '#CMD-003',
      customer: 'Sarah Lahouel',
      date: '2024-12-19',
      items: 8,
      total: 6200,
      status: 'shipped',
      payment: 'paid'
    },
    {
      id: '#CMD-004',
      customer: 'Mohamed Alaoui',
      date: '2024-12-19',
      items: 2,
      total: 1500,
      status: 'delivered',
      payment: 'paid'
    },
    {
      id: '#CMD-005',
      customer: 'Amina Saidi',
      date: '2024-12-18',
      items: 4,
      total: 3400,
      status: 'cancelled',
      payment: 'refunded'
    }
  ])

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
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
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
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
          {filteredOrders.map(order => {
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
          })}
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
