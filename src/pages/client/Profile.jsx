import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user, logout } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Client DZ-Fellah',
    email: user?.email || 'client@dzfellah.com',
    phone: '+213 555 123 456',
    address: 'Alger, Algérie',
    photo: 'https://via.placeholder.com/200x200?text=Photo'
  })

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Sauvegarder via API
    setIsEditing(false)
    alert('Profil mis à jour avec succès!')
  }

  const stats = {
    totalOrders: 15,
    activeOrders: 3,
    totalSpent: 25000,
    favoriteProducers: 5
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Mon Profil</h1>
          <div className="header-actions">
            <Link to="/products" className="btn btn-secondary">
              🛒 Continuer mes achats
            </Link>
          </div>
        </div>

        <div className="profile-layout">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-photo-section">
              <div className="profile-photo">
                <img src={profileData.photo} alt={profileData.name} />
                {isEditing && (
                  <div className="photo-overlay">
                    <button className="change-photo-btn">
                      📷 Changer
                    </button>
                  </div>
                )}
              </div>
              <h2>{profileData.name}</h2>
              <p className="user-type">👤 Client</p>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-icon">📦</span>
                <div>
                  <strong>{stats.totalOrders}</strong>
                  <p>Commandes</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🚚</span>
                <div>
                  <strong>{stats.activeOrders}</strong>
                  <p>En cours</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💰</span>
                <div>
                  <strong>{stats.totalSpent.toLocaleString()} DA</strong>
                  <p>Dépensé</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <div>
                  <strong>{stats.favoriteProducers}</strong>
                  <p>Favoris</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <Link to="/client/orders" className="quick-link">
                📋 Mes commandes
              </Link>
              <Link to="/cart" className="quick-link">
                🛒 Mon panier
              </Link>
              <Link to="/products" className="quick-link">
                🌾 Produits
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            {!isEditing ? (
              <>
                <div className="info-header">
                  <h3>Informations Personnelles</h3>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Modifier
                  </button>
                </div>

                <div className="info-section">
                  <div className="info-row">
                    <span className="info-label">👤 Nom complet:</span>
                    <span className="info-value">{profileData.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">📧 Email:</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">📞 Téléphone:</span>
                    <span className="info-value">{profileData.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">📍 Adresse:</span>
                    <span className="info-value">{profileData.address}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Préférences</h4>
                  <div className="preferences">
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Recevoir les notifications par email</span>
                    </label>
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Alertes de nouveaux produits</span>
                    </label>
                    <label className="preference-item">
                      <input type="checkbox" />
                      <span>Newsletter hebdomadaire</span>
                    </label>
                  </div>
                </div>

                <div className="danger-zone">
                  <h4>Zone de danger</h4>
                  <button className="btn btn-danger">
                    🗑️ Supprimer mon compte
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="edit-form">
                <h3>Modifier mes informations</h3>
                
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adresse *</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>URL Photo de profil</label>
                  <input
                    type="url"
                    name="photo"
                    value={profileData.photo}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
