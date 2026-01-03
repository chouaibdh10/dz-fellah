import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ClientLayout from '../components/client/ClientLayout'
import '../styles/Cart.css'

const Cart = () => {
  const { t } = useTranslation()
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart, checkout, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      alert(t('cart.loginToAccess'))
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Grouper les produits par producteur
  const groupedByProducer = cart.reduce((acc, item) => {
    const producerName = item.shop_name || item.producer || t('cart.unknownProducer')
    if (!acc[producerName]) {
      acc[producerName] = []
    }
    acc[producerName].push(item)
    return acc
  }, {})

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert(t('cart.loginToCheckout'))
      navigate('/login')
      return
    }

    try {
      setCheckoutLoading(true)
      await checkout({})
      alert(t('cart.orderSuccess'))
      navigate('/client/orders')
    } catch (err) {
      alert(t('cart.orderErrorPrefix') + err.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="cart-page">
          <div className="container">
            <div className="empty-cart">
              <span className="empty-icon">⏳</span>
              <h2>{t('cart.loading')}</h2>
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (cart.length === 0) {
    return (
      <ClientLayout>
        <div className="cart-page">
          <div className="container">
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <h2>{t('cart.emptyTitle')}</h2>
              <p>{t('cart.emptySubtitle')}</p>
              <Link to="/products" className="btn btn-primary">
                {t('cart.viewProducts')}
              </Link>
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">{t('cart.title')}</h1>
            <button
              className="btn btn-danger btn-small"
              onClick={() => {
                if (confirm(t('cart.confirmClear'))) {
                  clearCart()
                }
              }}
            >
              🗑️ {t('cart.clear')}
            </button>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {Object.entries(groupedByProducer).map(([producer, items]) => (
                <div key={producer} className="producer-group">
                  <h3 className="producer-name">👨‍🌾 {producer}</h3>

                  {items.map(item => {
                    const itemPrice = item.price * item.quantity

                    return (
                      <div key={item.id} className="cart-item">
                        <img src={item.photo} alt={item.name} className="item-image" />

                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">
                            {item.price} DA / {item.sale_unit || 'kg'}
                            {item.isAntigaspi && <span className="antigaspi-tag"> ({t('cart.antigaspi')})</span>}
                          </p>
                        </div>

                        <div className="item-quantity">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="qty-btn"
                            disabled={loading}
                          >
                            -
                          </button>
                          <span className="qty-value">
                            {item.quantity} {item.sale_unit || 'kg'}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (Number(item.quantity) || 0) + 1)}
                            className="qty-btn"
                            disabled={loading}
                          >
                            +
                          </button>
                        </div>

                        <div className="item-total">
                          <strong>{itemPrice.toLocaleString()} DA</strong>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(t('cart.confirmRemove', { name: item.name }))) {
                              removeFromCart(item.id)
                            }
                          }}
                          className="remove-btn"
                          title={t('cart.removeTitle')}
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>{t('cart.summaryTitle')}</h3>

              <div className="summary-row">
                <span>{t('cart.itemsCount')}:</span>
                <span><strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></span>
              </div>

              <div className="summary-row">
                <span>{t('cart.producers')}:</span>
                <span><strong>{Object.keys(groupedByProducer).length}</strong></span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>{t('cart.totalToPay')}:</span>
                <strong className="total-amount">{getTotalPrice().toLocaleString()} DA</strong>
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={handleCheckout}
                disabled={checkoutLoading || loading}
              >
                {checkoutLoading ? t('cart.processing') : t('cart.checkout')}
              </button>

              <Link to="/products" className="continue-shopping">
                ← {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </ClientLayout>
  )
}

export default Cart
