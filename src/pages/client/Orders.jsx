import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ClientLayout from '../../components/client/ClientLayout'
import { ordersAPI } from '../../utils/api'
import '../../styles/Orders.css'

const Orders = () => {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [orderDetails, setOrderDetails] = useState({})
  const [detailsLoadingId, setDetailsLoadingId] = useState(null)
  const [detailsError, setDetailsError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await ordersAPI.listOrders()
        // Backend list serializer returns: {id,total_amount,status,created_at}
        const list = Array.isArray(data) ? data : (data?.results || [])
        const mappedOrders = list.map(order => ({
          id: order.id,
          orderNumber: order.order_number || `CMD-${String(order.id).slice(0, 8)}`,
          date: order.created_at,
          status: order.status,
          producers: [],
          total: Number(order.total_amount || order.total_price || order.total || 0),
        }))
        setOrders(mappedOrders)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError(err.message)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const mapOrderDetails = (order) => {
    return {
      id: order.id,
      orderNumber: order.order_number || `CMD-${String(order.id).slice(0, 8)}`,
      date: order.created_at,
      status: order.status,
      total: Number(order.total_amount || order.total_price || order.total || 0),
      producers: (order.sub_orders || []).map(sub => ({
        name: sub.pickup_location || sub.shop_name || sub.shop?.name || sub.producer_name || 'Producteur',
        items: (sub.items || []).map(item => ({
          product: item.product_name || item.product?.name,
          quantity: Number(item.quantity || 0),
          unit: item.product?.sale_unit || item.unit || 'kg',
          price: Number(item.unit_price || 0),
        }))
      }))
    }
  }

  const toggleDetails = async (orderId) => {
    setDetailsError(null)

    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
      return
    }

    setExpandedOrderId(orderId)

    if (orderDetails[orderId]) {
      return
    }

    try {
      setDetailsLoadingId(orderId)
      const data = await ordersAPI.getOrderDetails(orderId)
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: mapOrderDetails(data)
      }))
    } catch (err) {
      console.error('Failed to fetch order details:', err)
      setDetailsError(err?.message || 'Erreur de récupération des détails')
    } finally {
      setDetailsLoadingId(null)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      delivered: { text: 'Livrée', class: 'status-delivered', icon: '✅' },
      processing: { text: 'En cours', class: 'status-progress', icon: '🚚' },
      pending: { text: 'En attente', class: 'status-pending', icon: '⏳' },
      cancelled: { text: 'Annulée', class: 'status-cancelled', icon: '❌' }
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
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
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
              className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
              onClick={() => setFilter('processing')}
            >
              🚚 En cours <span className="filter-count">{stats.processing}</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              ✅ Livrées <span className="filter-count">{stats.delivered}</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              ❌ Annulées <span className="filter-count">{stats.cancelled}</span>
            </button>
          </div>

          {/* Orders List Moderne */}
          {filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status)
                const details = orderDetails[order.id]
                const producersToRender = details?.producers?.length ? details.producers : order.producers
                const totalToRender = details?.total ?? order.total
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
                      {expandedOrderId === order.id ? (
                        <>
                          {detailsLoadingId === order.id && (
                            <p style={{ margin: 0 }}>⏳ Chargement des détails...</p>
                          )}
                          {detailsError && (
                            <p className="error-message" style={{ margin: 0 }}>{detailsError}</p>
                          )}
                          {producersToRender.map((producer, idx) => (
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
                        </>
                      ) : (
                        <p style={{ margin: 0, color: '#777' }}>Cliquez sur “Voir détails” pour afficher les produits.</p>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        💵 Total: <strong>{Number(totalToRender || 0).toLocaleString()} DA</strong>
                      </div>
                      <div className="order-actions">
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => toggleDetails(order.id)}
                          disabled={detailsLoadingId === order.id}
                        >
                          {expandedOrderId === order.id ? '✕ Masquer détails' : '📄 Voir détails'}
                        </button>
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
