import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ClientLayout from '../components/client/ClientLayout'
import './ProductCatalog.css'

// Catégories de produits
const productCategories = [
  { id: 'all', name: 'Tous', icon: '🏪' },
  { id: 'legumes', name: 'Légumes', icon: '🥬' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'agrumes', name: 'Agrumes', icon: '🍊' },
  { id: 'dattes', name: 'Dattes', icon: '🌴' },
  { id: 'cereales', name: 'Céréales', icon: '🌾' },
  { id: 'laitiers', name: 'Produits laitiers', icon: '🧀' },
  { id: 'miel', name: 'Miel & Sucré', icon: '🍯' },
  { id: 'herbes', name: 'Herbes', icon: '🌿' },
  { id: 'huiles', name: 'Huiles', icon: '🫒' }
]

// Wilayas disponibles
const wilayas = [
  'Alger', 'Blida', 'Tipaza', 'Boumerdès', 'Médéa', 'Oran', 'Tlemcen',
  'Sétif', 'Constantine', 'Annaba', 'Biskra', 'Tizi Ouzou', 'Béjaïa'
]

const ProductCatalog = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWilaya, setSelectedWilaya] = useState('all')
  const [selectedProducer, setSelectedProducer] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState('all')
  const [showInSeason, setShowInSeason] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

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
        name: 'Tomates Bio',
        image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400',
        price: 250,
        saleType: 'weight',
        pricePerKg: 250,
        producer: 'Ferme Ben Ahmed',
        wilaya: 'Blida',
        inSeason: true,
        category: 'legumes',
        description: 'Tomates fraîches et biologiques cultivées sans pesticides',
        stock: 50,
        unit: 'kg',
        rating: 4.8,
        sales: 120
      },
      {
        id: 2,
        name: 'Oranges Thomson',
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
        price: 180,
        saleType: 'weight',
        pricePerKg: 180,
        producer: 'Verger El Hamri',
        wilaya: 'Blida',
        inSeason: true,
        category: 'agrumes',
        description: 'Oranges juteuses de saison, variété Thomson',
        stock: 30,
        unit: 'kg',
        rating: 4.9,
        sales: 200
      },
      {
        id: 3,
        name: 'Miel de Montagne',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
        price: 1200,
        saleType: 'unit',
        producer: 'Rucher Bensalem',
        wilaya: 'Tizi Ouzou',
        inSeason: false,
        category: 'miel',
        description: 'Miel naturel 100% pur des montagnes de Kabylie',
        stock: 20,
        unit: 'pot (500g)',
        rating: 5.0,
        sales: 85
      },
      {
        id: 4,
        name: 'Pommes de terre',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber17f?w=400',
        price: 120,
        saleType: 'weight',
        pricePerKg: 120,
        producer: 'Ferme Hamza',
        wilaya: 'Médéa',
        inSeason: true,
        category: 'legumes',
        description: 'Pommes de terre fraîches de qualité supérieure',
        stock: 100,
        unit: 'kg',
        rating: 4.5,
        sales: 300
      },
      {
        id: 5,
        name: 'Dattes Deglet Nour',
        image: 'https://images.unsplash.com/photo-1593195643839-7f7e44b3c794?w=400',
        price: 800,
        saleType: 'weight',
        pricePerKg: 800,
        producer: 'Palmeraie Sahara',
        wilaya: 'Biskra',
        inSeason: true,
        category: 'dattes',
        description: 'Dattes Deglet Nour premium de Tolga',
        stock: 45,
        unit: 'kg',
        rating: 4.9,
        sales: 150
      },
      {
        id: 6,
        name: 'Huile d\'Olive Extra Vierge',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
        price: 1500,
        saleType: 'unit',
        producer: 'Moulin Traditionnel',
        wilaya: 'Béjaïa',
        inSeason: false,
        category: 'huiles',
        description: 'Huile d\'olive première pression à froid',
        stock: 25,
        unit: 'litre',
        rating: 4.7,
        sales: 95
      },
      {
        id: 7,
        name: 'Carottes Bio',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
        price: 150,
        saleType: 'weight',
        pricePerKg: 150,
        producer: 'Jardin Vert',
        wilaya: 'Tipaza',
        inSeason: true,
        category: 'legumes',
        description: 'Carottes biologiques croquantes et sucrées',
        stock: 60,
        unit: 'kg',
        rating: 4.6,
        sales: 110
      },
      {
        id: 8,
        name: 'Pommes Golden',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
        price: 350,
        saleType: 'weight',
        pricePerKg: 350,
        producer: 'Verger Atlas',
        wilaya: 'Médéa',
        inSeason: true,
        category: 'fruits',
        description: 'Pommes Golden croquantes des hauteurs de l\'Atlas',
        stock: 40,
        unit: 'kg',
        rating: 4.4,
        sales: 75
      },
      {
        id: 9,
        name: 'Fromage Frais',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
        price: 400,
        saleType: 'unit',
        producer: 'Laiterie Montagne',
        wilaya: 'Sétif',
        inSeason: false,
        category: 'laitiers',
        description: 'Fromage frais artisanal au lait de vache',
        stock: 15,
        unit: 'pièce (250g)',
        rating: 4.8,
        sales: 60
      },
      {
        id: 10,
        name: 'Menthe Fraîche',
        image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400',
        price: 50,
        saleType: 'unit',
        producer: 'Herbes du Sahel',
        wilaya: 'Alger',
        inSeason: true,
        category: 'herbes',
        description: 'Botte de menthe fraîche pour thé et cuisine',
        stock: 80,
        unit: 'botte',
        rating: 4.7,
        sales: 200
      },
      {
        id: 11,
        name: 'Citrons Beldi',
        image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400',
        price: 200,
        saleType: 'weight',
        pricePerKg: 200,
        producer: 'Agrumes du Littoral',
        wilaya: 'Boumerdès',
        inSeason: true,
        category: 'agrumes',
        description: 'Citrons beldi juteux et parfumés',
        stock: 35,
        unit: 'kg',
        rating: 4.6,
        sales: 90
      },
      {
        id: 12,
        name: 'Couscous Artisanal',
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400',
        price: 300,
        saleType: 'weight',
        pricePerKg: 300,
        producer: 'Coopérative Femmes',
        wilaya: 'Tizi Ouzou',
        inSeason: false,
        category: 'cereales',
        description: 'Couscous roulé à la main, tradition kabyle',
        stock: 50,
        unit: 'kg',
        rating: 5.0,
        sales: 180
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [user, navigate])

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let result = [...products]
    
    // Filtre par recherche
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.producer.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }
    
    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory)
    }
    
    // Filtre par wilaya
    if (selectedWilaya !== 'all') {
      result = result.filter(product => product.wilaya === selectedWilaya)
    }
    
    // Filtre par producteur
    if (selectedProducer !== 'all') {
      result = result.filter(product => product.producer === selectedProducer)
    }
    
    // Filtre par prix
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'low':
          result = result.filter(p => (p.saleType === 'weight' ? p.pricePerKg : p.price) < 200)
          break
        case 'medium':
          result = result.filter(p => {
            const pr = p.saleType === 'weight' ? p.pricePerKg : p.price
            return pr >= 200 && pr < 500
          })
          break
        case 'high':
          result = result.filter(p => (p.saleType === 'weight' ? p.pricePerKg : p.price) >= 500)
          break
        default:
          break
      }
    }
    
    // Filtre saison
    if (showInSeason) {
      result = result.filter(product => product.inSeason)
    }
    
    // Tri
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.sales - a.sales)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.saleType === 'weight' ? a.pricePerKg : a.price
          const priceB = b.saleType === 'weight' ? b.pricePerKg : b.price
          return priceA - priceB
        })
        break
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.saleType === 'weight' ? a.pricePerKg : a.price
          const priceB = b.saleType === 'weight' ? b.pricePerKg : b.price
          return priceB - priceA
        })
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    
    return result
  }, [products, searchTerm, selectedCategory, selectedWilaya, selectedProducer, priceRange, showInSeason, sortBy])

  // Liste des producteurs uniques
  const producers = useMemo(() => {
    const uniqueProducers = [...new Set(products.map(p => p.producer))]
    return uniqueProducers.sort()
  }, [products])

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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedWilaya('all')
    setSelectedProducer('all')
    setPriceRange('all')
    setShowInSeason(false)
    setSortBy('popular')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedWilaya !== 'all' || selectedProducer !== 'all' || priceRange !== 'all' || showInSeason

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Accès restreint</h2>
        <p>Veuillez vous connecter pour voir les produits</p>
      </div>
    )
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="product-catalog">
          <div className="container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des produits...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="product-catalog">
        <div className="container">
          {/* Page Header */}
          <div className="catalog-header">
            <div className="catalog-header-content">
              <h1 className="page-title">🛒 Catalogue des Produits</h1>
              <p className="page-subtitle">Découvrez les meilleurs produits frais de nos agriculteurs locaux</p>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="search-filters-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Rechercher un produit, un producteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>
            
            <div className="filters-row">
              <div className="filter-group">
                <label>📍 Wilaya</label>
                <select value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}>
                  <option value="all">Toutes les wilayas</option>
                  {wilayas.map(wilaya => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>👨‍🌾 Producteur</label>
                <select value={selectedProducer} onChange={(e) => setSelectedProducer(e.target.value)}>
                  <option value="all">Tous les producteurs</option>
                  {producers.map(producer => (
                    <option key={producer} value={producer}>{producer}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>💰 Prix</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                  <option value="all">Tous les prix</option>
                  <option value="low">Moins de 200 DA</option>
                  <option value="medium">200 - 500 DA</option>
                  <option value="high">Plus de 500 DA</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>📊 Trier par</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
              </div>
              
              <div className="filter-group filter-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showInSeason}
                    onChange={(e) => setShowInSeason(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  🌿 De saison
                </label>
              </div>
              
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Vue grille"
                >
                  ▦
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Vue liste"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="categories-pills">
            {productCategories.map(cat => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Results Header */}
          <div className="results-header">
            <span className="results-count">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={`products-grid ${viewMode}`}>
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => openProductModal(product)}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.inSeason && (
                      <span className="badge badge-season">🌿 De saison</span>
                    )}
                    {product.stock < 10 && (
                      <span className="badge badge-warning">⚠️ Stock limité</span>
                    )}
                    <div className="product-overlay">
                      <button className="btn btn-small btn-primary">Voir détails</button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        <span className="star">★</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    <p className="producer-name">👨‍🌾 {product.producer}</p>
                    <p className="product-location">📍 {product.wilaya}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <div className="product-price">
                        {product.saleType === 'weight' 
                          ? `${product.pricePerKg} DA / kg`
                          : `${product.price} DA / ${product.unit}`
                        }
                      </div>
                      <p className="stock-info">
                        {product.stock > 20 ? '✅' : product.stock > 10 ? '⚠️' : '🔴'} {product.stock} en stock
                      </p>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button 
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="btn btn-primary btn-add-cart"
                    >
                      🛒 Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
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
                  {selectedProduct.inSeason && (
                    <span className="modal-badge">🌿 Produit de saison</span>
                  )}
                </div>
                
                <div className="modal-info">
                  <div className="modal-header">
                    <h2>{selectedProduct.name}</h2>
                    <div className="modal-rating">
                      <span className="star">★</span>
                      <span>{selectedProduct.rating}</span>
                      <span className="sales">({selectedProduct.sales} ventes)</span>
                    </div>
                  </div>
                  
                  <div className="modal-meta">
                    <span className="modal-producer">👨‍🌾 {selectedProduct.producer}</span>
                    <span className="modal-location">📍 {selectedProduct.wilaya}</span>
                  </div>
                  
                  <p className="modal-description">{selectedProduct.description}</p>
                  
                  <div className="modal-price">
                    {selectedProduct.saleType === 'weight' 
                      ? `${selectedProduct.pricePerKg} DA / ${selectedProduct.unit}`
                      : `${selectedProduct.price} DA / ${selectedProduct.unit}`
                    }
                  </div>
                  
                  <p className="modal-stock">
                    {selectedProduct.stock > 10 
                      ? `✅ En stock (${selectedProduct.stock} ${selectedProduct.unit} disponibles)` 
                      : `⚠️ Stock limité (${selectedProduct.stock} ${selectedProduct.unit} restants)`
                    }
                  </p>

                  <div className="modal-quantity">
                    <label>Quantité:</label>
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="modal-total">
                    <span>Total:</span>
                    <strong>{calculateTotal().toLocaleString()} DA</strong>
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
