import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import './AdminProducts.css'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomates Bio',
      category: 'Légumes',
      price: 250,
      stock: 150,
      producer: 'Fatima Kouider',
      status: 'active',
      sales: 340,
      revenue: 85000,
      image: '🍅'
    },
    {
      id: 2,
      name: 'Pommes Rouges',
      category: 'Fruits',
      price: 350,
      stock: 200,
      producer: 'Amina Brahim',
      status: 'active',
      sales: 280,
      revenue: 98000,
      image: '🍎'
    },
    {
      id: 3,
      name: 'Lait Frais',
      category: 'Produits Laitiers',
      price: 120,
      stock: 5,
      producer: 'Karim Ferme',
      status: 'low_stock',
      sales: 450,
      revenue: 54000,
      image: '🥛'
    },
    {
      id: 4,
      name: 'Concombres',
      category: 'Légumes',
      price: 180,
      stock: 0,
      producer: 'Fatima Kouider',
      status: 'out_of_stock',
      sales: 120,
      revenue: 21600,
      image: '🥒'
    },
    {
      id: 5,
      name: 'Oranges',
      category: 'Fruits',
      price: 280,
      stock: 180,
      producer: 'Amina Brahim',
      status: 'active',
      sales: 350,
      revenue: 98000,
      image: '🍊'
    },
    {
      id: 6,
      name: 'Fromage Artisanal',
      category: 'Produits Laitiers',
      price: 450,
      stock: 45,
      producer: 'Karim Ferme',
      status: 'active',
      sales: 180,
      revenue: 81000,
      image: '🧀'
    }
  ])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.producer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const getStatusInfo = (product) => {
    if (product.stock === 0) {
      return { class: 'status-out', text: 'Rupture' }
    } else if (product.stock < 10) {
      return { class: 'status-low', text: 'Stock faible' }
    }
    return { class: 'status-active', text: 'En stock' }
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="admin-header">
          <div>
            <h1>Gestion des Produits</h1>
            <p>Gérez tous les produits de la plateforme</p>
          </div>
          <button className="btn-primary">
            ➕ Ajouter Produit
          </button>
        </div>

        {/* Stats */}
        <div className="products-stats">
          <div className="products-stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Produits</p>
            </div>
          </div>
          <div className="products-stat-card success">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{stats.active}</h3>
              <p>En Stock</p>
            </div>
          </div>
          <div className="products-stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div>
              <h3>{stats.lowStock}</h3>
              <p>Stock Faible</p>
            </div>
          </div>
          <div className="products-stat-card danger">
            <div className="stat-icon">❌</div>
            <div>
              <h3>{stats.outOfStock}</h3>
              <p>Rupture</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="products-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">Toutes catégories</option>
              <option value="Légumes">Légumes</option>
              <option value="Fruits">Fruits</option>
              <option value="Produits Laitiers">Produits Laitiers</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map(product => {
            const statusInfo = getStatusInfo(product)
            return (
              <div key={product.id} className="product-card">
                <div className={`product-status-badge ${statusInfo.class}`}>
                  {statusInfo.text}
                </div>
                <div className="product-image">
                  {product.image}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-producer">👨‍🌾 {product.producer}</p>
                  
                  <div className="product-metrics">
                    <div className="metric">
                      <span className="metric-label">Prix</span>
                      <span className="metric-value">{product.price} DA</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Stock</span>
                      <span className="metric-value">{product.stock}</span>
                    </div>
                  </div>

                  <div className="product-stats">
                    <div className="stat-item">
                      <span>🛒 {product.sales} ventes</span>
                    </div>
                    <div className="stat-item">
                      <span>💰 {product.revenue.toLocaleString()} DA</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button className="btn-edit">✏️ Modifier</button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Products
