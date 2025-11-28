import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomates Bio',
      price: 250,
      unit: 'kg',
      photo: 'https://via.placeholder.com/300x200?text=Tomates',
      stock: 50,
      inSeason: true
    },
    {
      id: 2,
      name: 'Oranges',
      price: 180,
      unit: 'kg',
      photo: 'https://via.placeholder.com/300x200?text=Oranges',
      stock: 30,
      inSeason: true
    }
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    photo: '',
    stock: '',
    inSeason: true
  })

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: p.id } : p
      ))
      alert('Produit modifié avec succès!')
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }
      setProducts([...products, newProduct])
      alert('Produit ajouté avec succès!')
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      unit: 'kg',
      photo: '',
      stock: '',
      inSeason: true
    })
    setIsAdding(false)
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingProduct(product)
    setIsAdding(true)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      setProducts(products.filter(p => p.id !== id))
      alert('Produit supprimé!')
    }
  }

  return (
    <ProducerLayout>
      <div className="products-management">
        <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Mes Produits</h1>
            <p className="page-subtitle">Gérez votre catalogue de produits</p>
          </div>
          <div className="header-actions">
            <Link to="/producer/dashboard" className="btn btn-secondary">
              ← Retour
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              + Ajouter un produit
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="product-form">
            <h3>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nom du produit *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prix *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Unité de vente *</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
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
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>URL Photo</label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="inSeason"
                  checked={formData.inSeason}
                  onChange={handleChange}
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
                onClick={resetForm}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card-manage">
              <div className="product-image">
                <img src={product.photo} alt={product.name} />
                {product.inSeason && (
                  <span className="badge badge-season">De saison</span>
                )}
                <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.price} DA / {product.unit}</p>
                <div className="product-actions">
                  <button 
                    className="btn btn-small btn-primary"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <p>Aucun produit pour le moment</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              Ajouter votre premier produit
            </button>
          </div>
        )}
      </div>
    </div>
  </ProducerLayout>
  )
}

export default Products
