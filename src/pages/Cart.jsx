import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import ClientLayout from '../components/client/ClientLayout'
import './Cart.css'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      alert('Veuillez vous connecter pour accéder à votre panier')
      navigate('/login')
    }
  }, [user, navigate])

  // Grouper les produits par producteur
  const groupedByProducer = cart.reduce((acc, item) => {
    const producerName = item.producer || 'Producteur inconnu'
    if (!acc[producerName]) {
      acc[producerName] = []
    }
    acc[producerName].push(item)
    return acc
  }, {})

  const handleCheckout = () => {
    if (!user) {
      alert('Veuillez vous connecter pour passer commande')
      navigate('/login')
      return
    }

    const payload = {
      address: user?.address || '',
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    }

    api.orders
      .create(payload)
      .then(() => {
        alert('Commande passée avec succès! Vous recevrez une confirmation par email.')
        clearCart()
        navigate('/client/orders')
      })
      .catch((err) => {
        alert(err?.message || 'Erreur lors de la commande')
      })
  }

  if (!user) {
    return null
  }

  if (cart.length === 0) {
    return (
      <ClientLayout>
        <div className="cart-page">
          <div className="container">
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <h2>Votre panier est vide</h2>
              <p>Découvrez nos produits frais et locaux</p>
              <Link to="/products" className="btn btn-primary">
                Voir les produits
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
            <h1 className="page-title">Mon Panier</h1>
            <button 
              className="btn btn-danger btn-small"
              onClick={() => {
                if (confirm('Vider tout le panier?')) {
                  clearCart()
                }
              }}
            >
              🗑️ Vider le panier
            </button>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {Object.entries(groupedByProducer).map(([producer, items]) => (
                <div key={producer} className="producer-group">
                  <h3 className="producer-name">👨‍🌾 {producer}</h3>
                  
                  {items.map(item => {
                    const itemPrice = item.saleType === 'weight' 
                      ? item.pricePerKg * item.quantity 
                      : item.price * item.quantity

                    return (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="item-image" />
                        
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-price">
                            {item.saleType === 'weight' 
                              ? `${item.pricePerKg} DA/kg` 
                              : `${item.price} DA/${item.unit || 'pièce'}`}
                          </p>
                        </div>

                        <div className="item-quantity">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="qty-value">
                            {item.quantity} {item.unit || (item.saleType === 'weight' ? 'kg' : 'pcs')}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>

                        <div className="item-total">
                          <strong>{itemPrice.toLocaleString()} DA</strong>
                        </div>

                        <button 
                          onClick={() => {
                            if (confirm(`Supprimer ${item.name} du panier?`)) {
                              removeFromCart(item.id)
                            }
                          }}
                          className="remove-btn"
                          title="Supprimer du panier"
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
              <h3>Résumé de la commande</h3>
              
              <div className="summary-row">
                <span>Nombre d'articles:</span>
                <span><strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></span>
              </div>

              <div className="summary-row">
                <span>Producteurs:</span>
                <span><strong>{Object.keys(groupedByProducer).length}</strong></span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total à payer:</span>
                <strong className="total-amount">{getTotalPrice().toLocaleString()} DA</strong>
              </div>

              <button 
                className="btn btn-primary btn-full"
                onClick={handleCheckout}
              >
                ✓ Passer la commande
              </button>

              <Link to="/products" className="continue-shopping">
                ← Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Cart
