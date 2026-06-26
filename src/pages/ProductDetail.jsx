import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isWeight = (unit) => {
      const u = String(unit || '').toLowerCase()
      return u.includes('kg') || u === 'g'
    }

    setLoading(true)
    api.products
      .get(id)
      .then((p) => {
        const saleType = isWeight(p.unit) ? 'weight' : 'unit'
        setProduct({
          id: p.id,
          name: p.name,
          image: p.photo,
          price: Number(p.price),
          saleType,
          pricePerKg: Number(p.price),
          producer: p.producer_name || p.producer_email || 'Producteur',
          producerPhone: p.producer_phone || '',
          producerAddress: p.producer_address || '',
          market: '',
          marketPhone: '',
          inSeason: !!p.in_season,
          description: '',
          stock: p.stock,
          unit: p.unit
        })
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const calculateTotal = () => {
    if (!product) return 0
    return product.saleType === 'weight' 
      ? product.pricePerKg * quantity 
      : product.price * quantity
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert(`${quantity} ${product.unit} de ${product.name} ajouté(s) au panier!`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  if (loading) {
    return <div className="container"><p>Chargement...</p></div>
  }

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/products" className="btn btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="back-link">
          ← Retour aux produits
        </Link>

        <div className="detail-layout">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
            {product.inSeason && (
              <span className="badge badge-season-large">🌱 De saison</span>
            )}
          </div>

          <div className="detail-info">
            <h1>{product.name}</h1>
            
            <div className="producer-info">
              <h3>👨‍🌾 {product.producer}</h3>
              <p>📍 {product.producerAddress}</p>
              <p>📞 {product.producerPhone}</p>
              <a 
                href={`tel:${product.producerPhone}`}
                className="btn btn-contact-producer"
              >
                Appeler le producteur
              </a>
            </div>

            <div className="price-section">
              <div className="price-main">
                {product.saleType === 'weight' 
                  ? `${product.pricePerKg} DA / ${product.unit}`
                  : `${product.price} DA / ${product.unit}`
                }
              </div>
              <p className="stock-status">
                {product.stock > 10 
                  ? `✅ En stock (${product.stock} ${product.unit} disponibles)` 
                  : `⚠️ Stock limité (${product.stock} ${product.unit} restants)`
                }
              </p>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="quantity-section">
              <h3>Quantité</h3>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="qty-display">
                  <span className="qty-value">{quantity}</span>
                  <span className="qty-unit">{product.unit}</span>
                </div>
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-section">
              <h3>Total</h3>
              <div className="total-price">{calculateTotal().toLocaleString()} DA</div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                🛒 Ajouter au panier
              </button>
              <button 
                className="btn btn-success btn-large"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                ⚡ Acheter maintenant
              </button>
            </div>

            {product.stock === 0 && (
              <p className="out-of-stock">❌ Produit en rupture de stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
