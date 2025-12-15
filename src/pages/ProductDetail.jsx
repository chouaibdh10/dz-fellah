import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Remplacer par un véritable appel API
    const mockProducts = [
      {
        id: 1,
        name: 'Tomates Bio',
        image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600',
        price: 250,
        saleType: 'weight',
        pricePerKg: 250,
        producer: 'Ferme Ben Ahmed',
        producerPhone: '+213 555 12 34 56',
        producerAddress: 'Tipaza, Algérie',
        market: 'Marché Agricole Blida',
        marketPhone: '+213 541 98 76 54',
        inSeason: true,
        description: 'Tomates fraîches et biologiques, cultivées sans pesticides. Idéales pour les salades et les sauces.',
        stock: 50,
        unit: 'kg'
      },
      {
        id: 2,
        name: 'Oranges Thomson',
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600',
        price: 180,
        saleType: 'weight',
        pricePerKg: 180,
        producer: 'Verger El Hamri',
        producerPhone: '+213 555 98 76 54',
        producerAddress: 'Blida, Algérie',
        market: 'Marché Agricole Blida',
        marketPhone: '+213 541 98 76 54',
        inSeason: true,
        description: 'Oranges juteuses et sucrées de saison. Riches en vitamine C.',
        stock: 30,
        unit: 'kg'
      },
      {
        id: 3,
        name: 'Miel de Montagne',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
        price: 1200,
        saleType: 'unit',
        producer: 'Rucher Bensalem',
        producerPhone: '+213 555 11 22 33',
        producerAddress: 'Béjaïa, Algérie',
        market: 'Marché Apicole Kabylie',
        marketPhone: '+213 534 55 66 77',
        inSeason: false,
        description: 'Miel naturel 100% pur, récolté artisanalement. Pot de 500g.',
        stock: 20,
        unit: 'pot'
      },
      {
        id: 4,
        name: 'Pommes de terre',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber17f?w=600',
        price: 120,
        saleType: 'weight',
        pricePerKg: 120,
        producer: 'Ferme Hamza',
        producerPhone: '+213 555 44 55 66',
        producerAddress: 'Aïn Defla, Algérie',
        market: 'Marché Légumes Médéa',
        marketPhone: '+213 541 77 88 99',
        inSeason: true,
        description: 'Pommes de terre fraîches, parfaites pour toutes vos préparations culinaires.',
        stock: 100,
        unit: 'kg'
      }
    ]
    
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === parseInt(id))
      setProduct(foundProduct)
      setLoading(false)
    }, 500)
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
