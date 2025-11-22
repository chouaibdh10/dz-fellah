import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ClientLayout from '../components/client/ClientLayout'
import './ProductCatalog.css'

const ProductCatalog = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      alert('Veuillez vous connecter pour accéder aux produits')
      navigate('/login')
      return
    }

    const mockProducts = [
      {
        id: 1,
        name: 'Tomates',
        image: 'https://via.placeholder.com/300x200?text=Tomates',
        price: 250,
        saleType: 'weight',
        pricePerKg: 250,
        producer: 'Ferme Ben Ahmed',
        inSeason: true,
        type: 'frais',
        description: 'Tomates fraîches et biologiques',
        stock: 50,
        unit: 'kg'
      },
      {
        id: 2,
        name: 'Oranges',
        image: 'https://via.placeholder.com/300x200?text=Oranges',
        price: 180,
        saleType: 'weight',
        pricePerKg: 180,
        producer: 'Verger El Hamri',
        inSeason: true,
        type: 'frais',
        description: 'Oranges juteuses de saison',
        stock: 30,
        unit: 'kg'
      },
      {
        id: 3,
        name: 'Miel Local',
        image: 'https://via.placeholder.com/300x200?text=Miel',
        price: 1200,
        saleType: 'unit',
        producer: 'Rucher Bensalem',
        inSeason: false,
        type: 'sec',
        description: 'Miel naturel 100% pur',
        stock: 20,
        unit: 'pot'
      },
      {
        id: 4,
        name: 'Pommes de terre',
        image: 'https://via.placeholder.com/300x200?text=Pommes+de+terre',
        price: 120,
        saleType: 'weight',
        pricePerKg: 120,
        producer: 'Ferme Hamza',
        inSeason: true,
        type: 'frais',
        description: 'Pommes de terre fraîches',
        stock: 100,
        unit: 'kg'
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [user, navigate])

  const handleQuickAdd = (product, e) => {
    e.stopPropagation()
    addToCart(product, 1)
    alert(`${product.name} ajouté au panier!`)
  }

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setQuantity(1)
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity)
      alert(`${quantity} ${selectedProduct.unit} de ${selectedProduct.name} ajouté(s) au panier!`)
      closeModal()
    }
  }

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.saleType === 'weight' 
      ? selectedProduct.pricePerKg * quantity 
      : selectedProduct.price * quantity
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.producer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Accès restreint</h2>
        <p>Veuillez vous connecter pour voir les produits</p>
      </div>
    )
  }

  if (loading) {
    return <div className="container"><p>Chargement des produits...</p></div>
  }

  return (
    <ClientLayout>
      <div className="product-catalog">
        <div className="container">
          <h1 className="page-title">Catalogue des Produits</h1>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Rechercher un produit ou un producteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="catalog-info">
            <p>{filteredProducts.length} produit(s) disponible(s)</p>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => openProductModal(product)}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.inSeason && (
                    <span className="badge badge-season">De saison</span>
                  )}
                  {product.stock < 10 && (
                    <span className="badge badge-warning">Stock limité</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="producer-name">👨‍🌾 {product.producer}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">
                    {product.saleType === 'weight' 
                      ? `${product.pricePerKg} DA / kg`
                      : `${product.price} DA / unité`
                    }
                  </div>
                  <p className="stock-info">Stock: {product.stock} {product.unit}</p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="btn btn-primary btn-small btn-add-cart"
                  >
                    🛒 Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>Aucun produit trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Modal Product Details */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>✕</button>
              
              <div className="modal-body">
                <div className="modal-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                
                <div className="modal-info">
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-producer">👨‍🌾 {selectedProduct.producer}</p>
                  <p className="modal-description">{selectedProduct.description}</p>
                  
                  <div className="modal-price">
                    {selectedProduct.saleType === 'weight' 
                      ? `${selectedProduct.pricePerKg} DA / ${selectedProduct.unit}`
                      : `${selectedProduct.price} DA / ${selectedProduct.unit}`
                    }
                  </div>
                  
                  <p className="modal-stock">
                    {selectedProduct.stock > 10 
                      ? `✅ En stock (${selectedProduct.stock} ${selectedProduct.unit})` 
                      : `⚠️ Stock limité (${selectedProduct.stock} ${selectedProduct.unit})`
                    }
                  </p>

                  <div className="modal-quantity">
                    <label>Quantité:</label>
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="qty-value">{quantity} {selectedProduct.unit}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="modal-total">
                    <strong>Total: {calculateTotal().toLocaleString()} DA</strong>
                  </div>

                  <button 
                    className="btn btn-primary btn-large"
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock === 0}
                  >
                    🛒 Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}

export default ProductCatalog
