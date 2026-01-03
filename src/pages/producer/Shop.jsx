import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import '../../styles/Shop.css'

const Shop = () => {
  const { user } = useAuth()
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getTotalStock,
    getAntigaspiStock,
    getRegularStock,
    hasAntigaspiStock,
    getEffectivePrice,
    addBatch,
    updateBatchStock,
    updateDryProductStock
  } = useProducts()

  const [shopData, setShopData] = useState({
    name: 'Ferme Bio ' + (user?.name || 'Producteur'),
    description: 'Producteur local de fruits et légumes biologiques, cultivés avec passion depuis plusieurs générations.',
    phone: '+213 555 123 456',
    address: 'Wilaya d\'Alger, Algérie',
    photo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingBatch, setIsAddingBatch] = useState(null) // Product ID for batch modal
  const [editingProduct, setEditingProduct] = useState(null)
  const [batchStockEdits, setBatchStockEdits] = useState({})

  // Product form with backend-compatible fields
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_unit: 'kg', // 'kg', 'piece', 'litre', 'botte'
    product_type: 'fresh', // 'fresh' or 'dry'
    photo: '',
    // For dry products
    stock: '',
    // For fresh products (initial batch)
    initial_harvest_date: '',
    initial_stock: ''
  })

  // Batch form for adding new batches to fresh products
  const [batchFormData, setBatchFormData] = useState({
    harvest_date: '',
    stock: ''
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats using helper functions
  const shopStats = [
    { icon: '🌽', label: 'Produits', value: products.length, color: 'blue' },
    { icon: '🌿', label: 'Produits frais', value: products.filter(p => p.product_type === 'fresh').length, color: 'green' },
    { icon: '🧀', label: 'Produits secs', value: products.filter(p => p.product_type === 'dry').length, color: 'orange' },
    { icon: '🗑️', label: 'Anti-gaspi', value: products.filter(p => hasAntigaspiStock(p)).length, color: 'red' }
  ]

  const handleChange = (e) => {
    setShopData({
      ...shopData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
    alert('Boutique mise à jour avec succès!')
  }

  const handleProductChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setProductFormData({
      ...productFormData,
      [e.target.name]: value
    })
  }

  const handleBatchChange = (e) => {
    setBatchFormData({
      ...batchFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productFormData.name,
        description: productFormData.description,
        price: parseFloat(productFormData.price),
        sale_unit: productFormData.sale_unit,
        photo: productFormData.photo
      })
      alert('Produit modifié avec succès!')
    } else {
      try {
        const name = (productFormData.name || '').trim()
        const description = (productFormData.description || '').trim()
        const price = parseFloat(productFormData.price)

        if (!name) {
          alert('Nom du produit requis')
          return
        }
        if (!description) {
          alert('Description du produit requise')
          return
        }
        if (!Number.isFinite(price) || price <= 0) {
          alert('Prix invalide')
          return
        }

        const initialStock = productFormData.initial_stock === '' ? undefined : parseFloat(productFormData.initial_stock)
        const stockQuantity = productFormData.stock === '' ? undefined : parseFloat(productFormData.stock)

        if (productFormData.product_type === 'fresh' && Number.isFinite(initialStock) && !productFormData.initial_harvest_date) {
          alert('Pour un produit frais, la date de récolte est requise si vous ajoutez un stock initial')
          return
        }

        const newProductData = {
          name,
          description,
          price,
          unit_type: productFormData.sale_unit,
          product_type: productFormData.product_type,
          category: productFormData.category || 'autres',
          stock_quantity: productFormData.product_type === 'dry' ? stockQuantity : undefined,
          initial_harvest_date: productFormData.product_type === 'fresh' ? (productFormData.initial_harvest_date || undefined) : undefined,
          initial_stock: productFormData.product_type === 'fresh' ? initialStock : undefined,
        }

        await addProduct(newProductData)
        alert('Produit ajouté avec succès!')
      } catch (err) {
        alert(err?.message || 'Erreur lors de l\'ajout du produit')
        return
      }
    }

    resetProductForm()
  }

  const handleBatchSubmit = (e) => {
    e.preventDefault()
    if (isAddingBatch) {
      addBatch(isAddingBatch, {
        harvest_date: batchFormData.harvest_date,
        stock: parseFloat(batchFormData.stock)
      })
      alert('Nouveau lot ajouté avec succès!')
      setIsAddingBatch(null)
      setBatchFormData({ harvest_date: '', stock: '' })
    }
  }

  const handleBatchStockChange = (batchId, value) => {
    setBatchStockEdits((prev) => ({ ...prev, [batchId]: value }))
  }

  const handleBatchStockSave = async (productId, batch) => {
    const rawValue = batchStockEdits[batch.id]
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed) || parsed < 0) {
      alert('Quantité invalide pour ce lot')
      return
    }
    try {
      await updateBatchStock(productId, batch.id, parsed)
      alert('Stock du lot mis à jour')
    } catch (err) {
      alert(err?.message || 'Erreur lors de la mise à jour du lot')
    }
  }

  const harvestTag = (harvestDate) => {
    if (!harvestDate) return null
    const today = new Date()
    const target = new Date(harvestDate)
    const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Hier'
    if (diffDays === 2) return 'Avant-hier'
    return null
  }

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      description: '',
      price: '',
      sale_unit: 'kg',
      product_type: 'fresh',
      photo: '',
      stock: '',
      initial_harvest_date: '',
      initial_stock: ''
    })
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (product) => {
    setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      sale_unit: product.sale_unit,
      product_type: product.product_type,
      photo: product.photo || '',
      stock: product.stock || '',
      initial_harvest_date: '',
      initial_stock: ''
    })
    setEditingProduct(product)
    setIsAddingProduct(true)
    setActiveTab('products')
  }

  const handleDeleteProduct = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      deleteProduct(id)
      alert('Produit supprimé!')
    }
  }

  const handleNewProductClick = () => {
    setIsAddingProduct(true)
    setActiveTab('products')
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <ProducerLayout>
        <div className="shop-management enhanced-shop">
          <div className="container">
            {/* Shop Hero Banner */}
            <div className="shop-hero-banner">
              <div className="shop-banner-image" style={{ backgroundImage: `url(${shopData.photo})` }}>
                <div className="shop-banner-overlay"></div>
                <div className="shop-banner-content">
                  <div className="shop-identity">
                    <span className="shop-badge">🏡 Boutique Producteur</span>
                    <h1>{shopData.name}</h1>
                    <p className="shop-tagline">{shopData.description}</p>
                    <div className="shop-meta">
                      <span><span>📍</span> {shopData.address}</span>
                      <span><span>📞</span> {shopData.phone}</span>
                    </div>
                  </div>
                  <div className="shop-banner-actions">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => { setActiveTab('info'); setIsEditing(true); }}
                    >
                      <span>✏️</span> Modifier boutique
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="shop-stats-row">
              {shopStats.map((stat, index) => (
                <div key={index} className={`shop-stat-card stat-${stat.color}`}>
                  <div className="stat-icon-wrapper">
                    <span>{stat.icon}</span>
                  </div>
                  <div className="stat-details">
                    <span className="stat-number">{stat.value}</span>
                    <span className="stat-text">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <div className="shop-tabs-container">
              <div className="shop-tabs-nav">
                <button
                  className={`shop-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <span>🌾</span> Mes Produits
                  <span className="tab-count">{products.length}</span>
                </button>
                <button
                  className={`shop-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <span>📋</span> Informations
                </button>
              </div>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="shop-products-section">
                {/* Product Form Modal */}
                {isAddingProduct && (
                  <div className="product-form-card">
                    <div className="form-card-header">
                      <h3>
                        <span>{editingProduct ? '✏️' : '➕'}</span>
                        {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                      </h3>
                      <button className="close-btn" onClick={resetProductForm}>✕</button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="product-form-enhanced">
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label><span>🏷️</span> Nom du produit</label>
                          <input
                            type="text"
                            name="name"
                            value={productFormData.name}
                            onChange={handleProductChange}
                            placeholder="Ex: Tomates cerises"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label><span>💰</span> Prix (DA)</label>
                          <input
                            type="number"
                            name="price"
                            value={productFormData.price}
                            onChange={handleProductChange}
                            placeholder="0"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label><span>📏</span> Unité de vente</label>
                          <select
                            name="sale_unit"
                            value={productFormData.sale_unit}
                            onChange={handleProductChange}
                            required
                          >
                            <option value="kg">Kilogramme (kg)</option>
                            <option value="piece">Pièce</option>
                            <option value="litre">Litre</option>
                            <option value="botte">Botte</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label><span>🥬</span> Type de produit</label>
                          <select
                            name="product_type"
                            value={productFormData.product_type}
                            onChange={handleProductChange}
                            disabled={editingProduct} // Can't change type after creation
                          >
                            <option value="fresh">🌿 Produit frais (avec lots/récoltes)</option>
                            <option value="dry">📦 Produit sec (stock ajustable)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label><span>🖼️</span> URL de l'image</label>
                          <input
                            type="url"
                            name="photo"
                            value={productFormData.photo}
                            onChange={handleProductChange}
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label><span>📝</span> Description</label>
                        <textarea
                          name="description"
                          value={productFormData.description}
                          onChange={handleProductChange}
                          placeholder="Description du produit..."
                          rows="2"
                        />
                      </div>

                      {/* Stock fields based on product type */}
                      {!editingProduct && (
                        <>
                          {productFormData.product_type === 'dry' ? (
                            <div className="form-group">
                              <label><span>📦</span> Stock initial</label>
                              <input
                                type="number"
                                name="stock"
                                value={productFormData.stock}
                                onChange={handleProductChange}
                                placeholder="Quantité en stock"
                                min="0"
                                required
                              />
                            </div>
                          ) : (
                            <div className="form-grid-2">
                              <div className="form-group">
                                <label><span>📅</span> Date de récolte initiale</label>
                                <input
                                  type="date"
                                  name="initial_harvest_date"
                                  value={productFormData.initial_harvest_date}
                                  onChange={handleProductChange}
                                />
                              </div>
                              <div className="form-group">
                                <label><span>📦</span> Stock initial du lot</label>
                                <input
                                  type="number"
                                  name="initial_stock"
                                  value={productFormData.initial_stock}
                                  onChange={handleProductChange}
                                  placeholder="0"
                                  min="0"
                                />
                              </div>
                              <p className="form-hint">
                                💡 Les produits frais sont gérés par lots. Vous pourrez ajouter d'autres lots plus tard.
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      <div className="form-actions-enhanced">
                        <button type="submit" className="btn btn-primary btn-lg">
                          {editingProduct ? '💾 Enregistrer les modifications' : '✓ Ajouter le produit'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={resetProductForm}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Batch Modal for Fresh Products */}
                {isAddingBatch && (
                  <div className="product-form-card batch-form-card">
                    <div className="form-card-header">
                      <h3><span>🌾</span> Ajouter un nouveau lot</h3>
                      <button className="close-btn" onClick={() => setIsAddingBatch(null)}>✕</button>
                    </div>

                    <form onSubmit={handleBatchSubmit} className="product-form-enhanced">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label><span>📅</span> Date de récolte</label>
                          <input
                            type="date"
                            name="harvest_date"
                            value={batchFormData.harvest_date}
                            onChange={handleBatchChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label><span>📦</span> Quantité</label>
                          <input
                            type="number"
                            name="stock"
                            value={batchFormData.stock}
                            onChange={handleBatchChange}
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      <p className="form-hint">
                        ⚠️ Nouveau lot possible uniquement si le stock existant est épuisé ou en anti-gaspi (récolté il y a 2+ jours).
                      </p>
                      <div className="form-actions-enhanced">
                        <button type="submit" className="btn btn-primary">✓ Ajouter le lot</button>
                        <button type="button" className="btn btn-outline" onClick={() => setIsAddingBatch(null)}>Annuler</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Products Toolbar */}
                <div className="products-toolbar">
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="toolbar-right">
                    <div className="view-toggle">
                      <button
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Vue grille"
                      >
                        ▦
                      </button>
                      <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="Vue liste"
                      >
                        ☰
                      </button>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleNewProductClick}
                    >
                      <span>+</span> Ajouter
                    </button>
                  </div>
                </div>

                {/* Products Grid/List */}
                {filteredProducts.length === 0 ? (
                  <div className="empty-products-state">
                    <div className="empty-illustration">🌱</div>
                    <h3>Aucun produit trouvé</h3>
                    <p>
                      {searchQuery
                        ? `Aucun résultat pour "${searchQuery}"`
                        : 'Commencez par ajouter votre premier produit à votre boutique'
                      }
                    </p>
                    {!searchQuery && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsAddingProduct(true)}
                      >
                        <span>+</span> Ajouter un produit
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`products-display ${viewMode}`}>
                    {filteredProducts.map(product => {
                      const totalStock = getTotalStock(product)
                      const antigaspiStock = getAntigaspiStock(product)
                      const regularStock = getRegularStock(product)
                      const hasAntigaspi = hasAntigaspiStock(product)

                      return (
                        <div key={product.id} className="product-manage-card">
                          <div className="product-card-image">
                            <img src={product.photo} alt={product.name} />
                            <div className="product-badges">
                              <span className={`badge badge-type-${product.product_type}`}>
                                {product.product_type === 'fresh' ? '🌿 Frais' : '📦 Sec'}
                              </span>
                              {hasAntigaspi && (
                                <span className="badge badge-antigaspi">🏷️ Anti-gaspi</span>
                              )}
                              {totalStock <= 10 && totalStock > 0 && (
                                <span className="badge badge-warning">⚠️ Stock faible</span>
                              )}
                              {totalStock === 0 && (
                                <span className="badge badge-danger">Rupture</span>
                              )}
                            </div>
                            <div className="product-quick-actions">
                              <button
                                className="quick-action-btn edit"
                                onClick={() => handleEditProduct(product)}
                                title="Modifier"
                              >
                                ✏️
                              </button>
                              <button
                                className="quick-action-btn delete"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Supprimer"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <div className="product-card-body">
                            <h4 className="product-name">{product.name}</h4>
                            <div className="product-price-row">
                              <span className="product-price">{product.price} DA</span>
                              <span className="product-unit">/ {product.sale_unit}</span>
                            </div>
                            {hasAntigaspi && (
                              <div className="antigaspi-price">
                                <span>🏷️ Prix anti-gaspi:</span>
                                <strong>{getEffectivePrice(product, true)} DA</strong>
                              </div>
                            )}

                            {/* Stock Display - Different for Fresh vs Dry */}
                            {product.product_type === 'fresh' ? (
                              <div className="batch-stock-display">
                                <div className="stock-row regular-stock">
                                  <span className="stock-label">🌿 Stock frais:</span>
                                  <span className="stock-value">{regularStock} {product.sale_unit}</span>
                                </div>
                                {antigaspiStock > 0 && (
                                  <div className="stock-row antigaspi-stock">
                                    <span className="stock-label">🏷️ Stock anti-gaspi:</span>
                                    <span className="stock-value">{antigaspiStock} {product.sale_unit}</span>
                                  </div>
                                )}
                                <div className="stock-row total-stock">
                                  <span className="stock-label">📦 Total:</span>
                                  <span className="stock-value">{totalStock} {product.sale_unit}</span>
                                </div>

                                {/* Batch details */}
                                {product.batches && product.batches.length > 0 && (
                                  <div className="batches-list">
                                    <h5>Lots en stock:</h5>
                                    {product.batches.filter(b => b.stock > 0).map(batch => {
                                      const tag = harvestTag(batch.harvest_date)
                                      return (
                                        <div key={batch.id} className={`batch-item ${batch.is_antigaspi ? 'antigaspi' : ''}`}>
                                          <div className="batch-meta">
                                            <span className="batch-date">📅 {formatDate(batch.harvest_date)}</span>
                                            {tag && <span className="batch-badge subtle">{tag}</span>}
                                            {batch.is_antigaspi && <span className="batch-badge">Anti-gaspi</span>}
                                          </div>
                                          <div className="batch-stock-row">
                                            <span className="batch-stock">{batch.stock} {product.sale_unit}</span>
                                            <div className="batch-stock-edit">
                                              <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={batchStockEdits[batch.id] ?? batch.stock}
                                                onChange={(e) => handleBatchStockChange(batch.id, e.target.value)}
                                              />
                                              <button
                                                type="button"
                                                className="btn btn-outline btn-xs"
                                                onClick={() => handleBatchStockSave(product.id, batch)}
                                              >
                                                Mettre à jour
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="stock-indicator">
                                <div className="stock-bar-container">
                                  <div
                                    className={`stock-bar-fill ${totalStock > 20 ? 'high' : totalStock > 10 ? 'medium' : 'low'}`}
                                    style={{ width: `${Math.min(totalStock * 2, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="stock-text">
                                  {totalStock} {product.sale_unit === 'kg' ? 'kg' : 'unités'} en stock
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="product-card-footer">
                            {product.product_type === 'fresh' && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => setIsAddingBatch(product.id)}
                              >
                                🌾 Ajouter un lot
                              </button>
                            )}
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn btn-danger-outline btn-sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="shop-info-section">
                <div className="info-cards-grid">
                  <div className="info-display-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">📞</span>
                      <h4>Contact</h4>
                    </div>
                    <div className="info-card-content">
                      <div className="info-row">
                        <span className="info-label">Téléphone</span>
                        <span className="info-value">{shopData.phone}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email</span>
                        <span className="info-value">{user?.email || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-display-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">📍</span>
                      <h4>Localisation</h4>
                    </div>
                    <div className="info-card-content">
                      <div className="info-row">
                        <span className="info-label">Adresse</span>
                        <span className="info-value">{shopData.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-display-card full-width">
                    <div className="info-card-header">
                      <span className="info-card-icon">📝</span>
                      <h4>Description</h4>
                    </div>
                    <div className="info-card-content">
                      <p className="shop-description-text">{shopData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing ? (
                  <div className="shop-edit-form-card">
                    <div className="form-card-header">
                      <h3><span>✏️</span> Modifier les informations</h3>
                      <button className="close-btn" onClick={() => setIsEditing(false)}>✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="shop-edit-form">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label><span>🏪</span> Nom de la boutique</label>
                          <input
                            type="text"
                            name="name"
                            value={shopData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label><span>📞</span> Téléphone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={shopData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label><span>📍</span> Adresse</label>
                        <input
                          type="text"
                          name="address"
                          value={shopData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label><span>📝</span> Description</label>
                        <textarea
                          name="description"
                          value={shopData.description}
                          onChange={handleChange}
                          rows="4"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label><span>🖼️</span> URL Photo de couverture</label>
                        <input
                          type="url"
                          name="photo"
                          value={shopData.photo}
                          onChange={handleChange}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="form-actions-enhanced">
                        <button type="submit" className="btn btn-primary btn-lg">
                          💾 Enregistrer les modifications
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="edit-cta">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => setIsEditing(true)}
                    >
                      <span>✏️</span> Modifier les informations de la boutique
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
    </ProducerLayout>
  )
}
export default Shop
