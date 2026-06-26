import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import ClientLayout from '../components/client/ClientLayout'
import '../styles/ProductCatalog.css'

const ProductCatalog = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { products: apiProducts, loading: productsLoading, error: productsError, fetchProducts, getTotalStock, hasAntigaspiStock, getAntigaspiStock, getRegularStock } = useProducts()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWilaya, setSelectedWilaya] = useState('all')
  const [producerSearch, setProducerSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState('all')
  const [showInSeason, setShowInSeason] = useState(false)
  const [showAntigaspiOnly, setShowAntigaspiOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour accéder aux produits')
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Always refresh when opening the catalog (keeps client view up-to-date after producers add products)
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated, fetchProducts])

  useEffect(() => {
    // Use API products only (no mock fallback)
    if (apiProducts && apiProducts.length > 0) {
      // Map API products to catalog format
      const mappedProducts = apiProducts.map(p => ({
        ...p,
        producer: p.shop_name || p.producer || 'Producteur',
        producerPhone: p.shop?.phone || '+213 555 00 00 00',
        producerAddress: p.shop?.address || 'Algérie',
        wilaya: p.shop?.wilaya || 'Alger',
        category: p.category || 'legumes',
        total_stock: getTotalStock(p),
        regular_stock: getRegularStock(p),
        antigaspi_stock: getAntigaspiStock(p),
        has_antigaspi: hasAntigaspiStock(p),
        rating: p.average_rating || 4.5,
        sales: p.sales_count || 0
      }))
      setProducts(mappedProducts)
      setLoading(false)
    } else if (!productsLoading) {
      setProducts([])
      setLoading(false)
    }
  }, [apiProducts, productsLoading, getTotalStock, hasAntigaspiStock, getAntigaspiStock, getRegularStock])

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

    // Filtre par producteur (recherche textuelle)
    if (producerSearch) {
      const query = producerSearch.toLowerCase()
      result = result.filter(product => product.producer.toLowerCase().includes(query))
    }

    // Filtre par prix
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'low':
          result = result.filter(p => p.price < 200)
          break
        case 'medium':
          result = result.filter(p => p.price >= 200 && p.price < 500)
          break
        case 'high':
          result = result.filter(p => p.price >= 500)
          break
        default:
          break
      }
    }

    // Filtre saison (fresh products only)
    if (showInSeason) {
      result = result.filter(product => product.product_type === 'fresh')
    }

    // Filtre anti-gaspi
    if (showAntigaspiOnly) {
      result = result.filter(product => product.has_antigaspi)
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
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return result
  }, [products, searchTerm, selectedCategory, selectedWilaya, producerSearch, priceRange, showInSeason, showAntigaspiOnly, sortBy])

  const handleQuickAdd = async (product, e) => {
    e.stopPropagation()
    try {
      await addToCart(product, 1)
      alert(`${product.name} ajouté au panier!`)
    } catch (err) {
      alert(err?.message || 'Erreur lors de l\'ajout au panier')
    }
  }

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setQuantity(1)
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleAddToCart = async () => {
    if (selectedProduct) {
      try {
        await addToCart(selectedProduct, quantity)
        alert(`${quantity} ${selectedProduct.sale_unit} de ${selectedProduct.name} ajouté(s) au panier!`)
        closeModal()
      } catch (err) {
        alert(err?.message || 'Erreur lors de l\'ajout au panier')
      }
    }
  }

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * quantity
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedWilaya('all')
    setProducerSearch('')
    setPriceRange('all')
    setShowInSeason(false)
    setShowAntigaspiOnly(false)
    setSortBy('popular')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedWilaya !== 'all' || producerSearch || priceRange !== 'all' || showInSeason || showAntigaspiOnly

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

  if (!loading && products.length === 0) {
    return (
      <ClientLayout>
        <div className="product-catalog">
          <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Aucun produit disponible</h2>
            <p>Le catalogue est vide, ou le backend n'est pas joignable.</p>
            {productsError && (
              <p style={{ marginTop: '1rem' }}><strong>Détail:</strong> {productsError}</p>
            )}
            <button
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => fetchProducts()}
            >
              Réessayer
            </button>
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
                placeholder="Rechercher un produit..."
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
              <div className="filter-group producer-search">
                <label>🧑‍🌾 Boutique</label>
                <div className="search-box-small">
                  <span className="search-icon-small">🔍</span>
                  <input
                    type="text"
                    placeholder="Rechercher une boutique..."
                    value={producerSearch}
                    onChange={(e) => setProducerSearch(e.target.value)}
                  />
                  {producerSearch && (
                    <button className="clear-search-small" onClick={() => setProducerSearch('')}>
                      ✕
                    </button>
                  )}
                </div>
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

              <div className="filter-group filter-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showAntigaspiOnly}
                    onChange={(e) => setShowAntigaspiOnly(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  🏷️ Anti-gaspi
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
                    <img src={product.photo} alt={product.name} />
                    {product.product_type === 'fresh' && (
                      <span className="badge badge-season">🌿 Frais</span>
                    )}
                    {product.has_antigaspi && (
                      <span className="badge badge-antigaspi">🏷️ Anti-gaspi</span>
                    )}
                    {product.total_stock < 10 && (
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
                        {product.price} DA / {product.sale_unit}
                        {product.has_antigaspi && (
                          <span className="antigaspi-discount"> (-50%: {product.price / 2} DA)</span>
                        )}
                      </div>
                      <p className="stock-info">
                        {product.total_stock > 20 ? '✅' : product.total_stock > 10 ? '⚠️' : '🔴'} {product.total_stock} en stock
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
                  <img src={selectedProduct.photo} alt={selectedProduct.name} />
                  {selectedProduct.product_type === 'fresh' && (
                    <span className="modal-badge">🌿 Produit frais</span>
                  )}
                  {selectedProduct.has_antigaspi && (
                    <span className="modal-badge antigaspi">🏷️ Anti-gaspi -50%</span>
                  )}
                </div>

                <div className="modal-info">
                  <div className="modal-header">
                    <h2>{selectedProduct.name}</h2>
                  </div>

                  <div className="modal-meta">
                    <span className="modal-producer">👨‍🌾 {selectedProduct.producer}</span>
                    <span className="modal-location">📍 {selectedProduct.wilaya}</span>
                  </div>

                  <div className="modal-producer-info">
                    <h4>👨‍🌾 Contact Producteur</h4>
                    <p>📞 {selectedProduct.producerPhone}</p>
                    <p>📍 {selectedProduct.producerAddress}</p>
                    <a
                      href={`tel:${selectedProduct.producerPhone}`}
                      className="btn btn-contact-producer"
                    >
                      Appeler le producteur
                    </a>
                  </div>

                  <p className="modal-description">{selectedProduct.description}</p>

                  <div className="modal-price">
                    {selectedProduct.price} DA / {selectedProduct.sale_unit}
                    {selectedProduct.has_antigaspi && (
                      <span className="antigaspi-price-tag"> (Prix anti-gaspi: {selectedProduct.price / 2} DA)</span>
                    )}
                  </div>

                  <p className="modal-stock">
                    {selectedProduct.total_stock > 10
                      ? `✅ En stock (${selectedProduct.total_stock} ${selectedProduct.sale_unit} disponibles)`
                      : `⚠️ Stock limité (${selectedProduct.total_stock} ${selectedProduct.sale_unit} restants)`
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
                        onClick={() => setQuantity(Math.min(selectedProduct.total_stock, quantity + 1))}
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
                    disabled={selectedProduct.total_stock === 0}
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
