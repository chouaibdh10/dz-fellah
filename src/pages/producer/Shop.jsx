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
    description: 'Producteur local de fruits et légumes biologiques',
    phone: '+213 555 123 456',
    address: 'Wilaya d\'Alger, Algérie',
    photo: 'https://via.placeholder.com/800x400?text=Ma+Ferme'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'info'
  
  // États pour la gestion des produits
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    photo: '',
    stock: '',
    inSeason: true
  })

  const handleChange = (e) => {
    setShopData({
      ...shopData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Sauvegarder via API
    setIsEditing(false)
    alert('Boutique mise à jour avec succès!')
  }

  // Gestion des produits
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
      inSeason: true
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
      <div className="shop-management">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Ma Boutique</h1>
              <p className="page-subtitle">Vitrine publique et gestion de vos produits</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsAddingProduct(true)
                  setActiveTab('products')
                }}
              >
                + Ajouter un produit
              </button>
              <Link to="/producer/dashboard" className="btn btn-secondary">
                ← Tableau de bord
              </Link>
            </div>
          </div>

          {/* Shop Banner */}
          <div className="shop-preview">
            <div className="shop-banner">
              <img src={shopData.photo} alt={shopData.name} />
              <div className="shop-overlay">
                <h2>{shopData.name}</h2>
                <p className="shop-description">{shopData.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="shop-tabs">
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              🌾 Mes Produits ({products.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              📋 Informations de contact
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="shop-products-section">
              {/* Add/Edit Product Form */}
              {isAddingProduct && (
                <form onSubmit={handleProductSubmit} className="product-form">
                  <h3>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom du produit *</label>
                      <input
                        type="text"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Prix *</label>
                      <input
                        type="number"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Unité de vente *</label>
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

                  <div className="form-row">
                    <div className="form-group">
                      <label>Stock disponible *</label>
                      <input
                        type="number"
                        name="stock"
                        value={productFormData.stock}
                        onChange={handleProductChange}
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>URL Photo</label>
                      <input
                        type="url"
                        name="photo"
                        value={productFormData.photo}
                        onChange={handleProductChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="inSeason"
                        checked={productFormData.inSeason}
                        onChange={handleProductChange}
                      />
                      <span>Produit de saison</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? '💾 Enregistrer' : '✓ Ajouter'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetProductForm}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="empty-products">
                  <p>Aucun produit disponible pour le moment</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddingProduct(true)}
                  >
                    Ajouter votre premier produit
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card-manage">
                      <div className="product-image">
                        <img src={product.photo} alt={product.name} />
                        {product.inSeason && (
                          <span className="badge badge-season">🌿 De saison</span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-price">{product.price} DA / {product.unit}</p>
                        
                        <div className="stock-display">
                          <div className="stock-bar">
                            <div 
                              className={`stock-fill ${product.stock > 20 ? 'high' : product.stock > 10 ? 'medium' : 'low'}`}
                              style={{ width: `${Math.min(product.stock, 100)}%` }}
                            ></div>
                          </div>
                          <div className="stock-info">
                            <span className={`stock-count ${product.stock > 20 ? 'high' : product.stock > 10 ? 'medium' : 'low'}`}>
                              {product.stock > 20 ? '✅' : product.stock > 10 ? '⚠️' : '🔴'} {product.stock} en stock
                            </span>
                            {product.stock <= 10 && (
                              <span className="stock-alert">Stock faible !</span>
                            )}
                          </div>
                        </div>

                        <div className="product-actions">
                          <button 
                            className="btn btn-small btn-primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            className="btn btn-small btn-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
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
              <div className="shop-info-card">
                <h3>Informations de contact</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div>
                      <p className="info-label">Téléphone</p>
                      <p className="info-value">{shopData.phone}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <p className="info-label">Adresse</p>
                      <p className="info-value">{shopData.address}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📧</span>
                    <div>
                      <p className="info-label">Email</p>
                      <p className="info-value">{user?.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              </div>

                  {/* Edit Form */}
              {isEditing ? (
                <form onSubmit={handleSubmit} className="shop-form">
                  <h3>Modifier les informations</h3>
                  
                  <div className="form-group">
                    <label>Nom de la boutique *</label>
                    <input
                      type="text"
                      name="name"
                      value={shopData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={shopData.description}
                      onChange={handleChange}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shopData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse *</label>
                    <input
                      type="text"
                      name="address"
                      value={shopData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Photo de couverture</label>
                    <input
                      type="url"
                      name="photo"
                      value={shopData.photo}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      💾 Enregistrer
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="edit-section">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Modifier les informations
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
