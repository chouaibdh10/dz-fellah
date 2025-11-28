import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './Shop.css'

const Shop = () => {
  const { user } = useAuth()
  
  const [shopData, setShopData] = useState({
    name: 'Ferme Bio ' + (user?.name || 'Producteur'),
    description: 'Producteur local de fruits et légumes biologiques',
    phone: '+213 555 123 456',
    address: 'Wilaya d\'Alger, Algérie',
    photo: 'https://via.placeholder.com/800x400?text=Ma+Ferme'
  })

  const [isEditing, setIsEditing] = useState(false)

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

  return (
    <ProducerLayout>
      <div className="shop-management">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Ma Boutique</h1>
              <p className="page-subtitle">Gérez les informations de votre boutique</p>
            </div>
            <Link to="/producer/dashboard" className="btn btn-secondary">
              ← Retour
            </Link>
          </div>

          {/* Shop Preview */}
          <div className="shop-preview">
            <div className="shop-banner">
              <img src={shopData.photo} alt={shopData.name} />
              <div className="shop-overlay">
                <h2>{shopData.name}</h2>
              </div>
            </div>
            
            <div className="shop-info-card">
              <div className="info-row">
                <span className="info-label">📝 Description:</span>
                <span className="info-value">{shopData.description}</span>
              </div>
              <div className="info-row">
                <span className="info-label">📞 Téléphone:</span>
                <span className="info-value">{shopData.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">📍 Adresse:</span>
                <span className="info-value">{shopData.address}</span>
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
                ✏️ Modifier ma boutique
              </button>
            </div>
          )}
        </div>
      </div>
    </ProducerLayout>
  )
}

export default Shop
