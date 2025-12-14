import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './Shop.css'

const Shop = () => {
  const { user } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  
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
  const [editingProduct, setEditingProduct] = useState(null)
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    photo: '',
    stock: '',
    inSeason: true,
    category: 'legumes'
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const shopStats = [
    { icon: '📦', label: 'Produits', value: products.length, color: 'blue' },
    { icon: '✅', label: 'En stock', value: products.filter(p => p.stock > 0).length, color: 'green' },
    { icon: '🌿', label: 'De saison', value: products.filter(p => p.inSeason).length, color: 'orange' },
    { icon: '⚠️', label: 'Stock faible', value: products.filter(p => p.stock <= 10 && p.stock > 0).length, color: 'red' }
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

  const handleProductSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      updateProduct(editingProduct.id, productFormData)
      alert('Produit modifié avec succès!')
    } else {
      addProduct(productFormData)
      alert('Produit ajouté avec succès!')
    }
    
    resetProductForm()
  }

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      price: '',
      unit: 'kg',
      photo: '',
      stock: '',
      inSeason: true,
      category: 'legumes'
    })
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (product) => {
    setProductFormData(product)
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
                    className="btn btn-primary btn-glow"
                    onClick={() => {
                      setIsAddingProduct(true)
                      setActiveTab('products')
                    }}
                  >
                    <span>+</span> Nouveau produit
                  </button>
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
                          name="unit"
                          value={productFormData.unit}
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

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label><span>📦</span> Stock disponible</label>
                        <input
                          type="number"
                          name="stock"
                          value={productFormData.stock}
                          onChange={handleProductChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label><span>📂</span> Catégorie</label>
                        <select
                          name="category"
                          value={productFormData.category}
                          onChange={handleProductChange}
                        >
                          <option value="legumes">Légumes</option>
                          <option value="fruits">Fruits</option>
                          <option value="laitiers">Produits laitiers</option>
                          <option value="miel">Miel & Dérivés</option>
                          <option value="huiles">Huiles</option>
                          <option value="autres">Autres</option>
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

                    <div className="form-group checkbox-enhanced">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="inSeason"
                          checked={productFormData.inSeason}
                          onChange={handleProductChange}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">🌿 Produit de saison</span>
                      </label>
                    </div>

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
                    onClick={() => setIsAddingProduct(true)}
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
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-manage-card">
                      <div className="product-card-image">
                        <img src={product.photo} alt={product.name} />
                        <div className="product-badges">
                          {product.inSeason && (
                            <span className="badge badge-season">🌿 Saison</span>
                          )}
                          {product.stock <= 10 && product.stock > 0 && (
                            <span className="badge badge-warning">⚠️ Stock faible</span>
                          )}
                          {product.stock === 0 && (
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
                        <span className="product-category">{product.category || 'Légumes'}</span>
                        <h4 className="product-name">{product.name}</h4>
                        <div className="product-price-row">
                          <span className="product-price">{product.price} DA</span>
                          <span className="product-unit">/ {product.unit}</span>
                        </div>
                        
                        <div className="stock-indicator">
                          <div className="stock-bar-container">
                            <div 
                              className={`stock-bar-fill ${product.stock > 20 ? 'high' : product.stock > 10 ? 'medium' : 'low'}`}
                              style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                            ></div>
                          </div>
                          <span className="stock-text">
                            {product.stock} {product.unit === 'kg' ? 'kg' : 'unités'} en stock
                          </span>
                        </div>
                      </div>

                      <div className="product-card-footer">
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
                  ))}
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
