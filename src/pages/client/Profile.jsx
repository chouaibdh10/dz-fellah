import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClientLayout from '../../components/client/ClientLayout'
import './Profile.css'

const Profile = () => {
  const { user, updateUserPhoto, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [photoFile, setPhotoFile] = useState(null)
  const [activeSection, setActiveSection] = useState('info')
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    wilaya: user?.wilaya || '',
    commune: user?.commune || ''
  })

  useEffect(() => {
    setPhotoPreview(user?.photo || null)
  }, [user?.photo])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 5 MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const photoDataUrl = reader.result
        setPhotoPreview(photoDataUrl)
        setPhotoFile(file)
        updateUserPhoto(photoDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
    updateUserPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (photoPreview && photoPreview !== user?.photo) {
      updateUserPhoto(photoPreview)
    }
    
    updateUserProfile(formData)
    setIsEditing(false)
    alert('Profil mis à jour avec succès!')
  }

  const clientStats = [
    { icon: '🛒', label: 'Commandes', value: user?.totalOrders || 12, color: 'blue' },
    { icon: '💰', label: 'Total dépensé', value: `${(user?.totalSpent || 45600).toLocaleString()} DA`, color: 'green' },
    { icon: '⭐', label: 'Points fidélité', value: user?.loyaltyPoints || 456, color: 'orange' },
    { icon: '❤️', label: 'Favoris', value: user?.favorites || 8, color: 'red' }
  ]

  const recentOrders = [
    { id: 'CMD-2024-001', date: '12 Déc 2024', status: 'Livré', total: '2,450 DA' },
    { id: 'CMD-2024-002', date: '08 Déc 2024', status: 'En cours', total: '1,890 DA' },
    { id: 'CMD-2024-003', date: '01 Déc 2024', status: 'Livré', total: '3,200 DA' }
  ]

  return (
    <ClientLayout>
      <div className="client-profile enhanced-profile">
        <div className="container">
          {/* Hero Header */}
          <div className="profile-hero">
            <div className="profile-hero-bg"></div>
            <div className="profile-hero-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar" onClick={handlePhotoClick}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Photo de profil" />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>👤</span>
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <span>📷</span>
                    </div>
                  </div>
                  {photoPreview && (
                    <button 
                      className="avatar-remove-btn"
                      onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                      title="Supprimer la photo"
                    >
                      ✕
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="profile-identity">
                  <h1 className="profile-name">{user?.name || 'Client'}</h1>
                  <p className="profile-email">{user?.email}</p>
                  <div className="profile-badges">
                    <span className="badge badge-member">
                      <span>🏆</span> Client fidèle
                    </span>
                    <span className="badge badge-verified">
                      <span>✓</span> Vérifié
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="profile-stats-grid">
            {clientStats.map((stat, index) => (
              <div key={index} className={`stat-card stat-card-${stat.color}`}>
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="profile-content-grid">
            {/* Left Column - Profile Info */}
            <div className="profile-main-card">
              <div className="card-tabs">
                <button 
                  className={`tab-btn ${activeSection === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveSection('info')}
                >
                  <span>👤</span> Informations
                </button>
                <button 
                  className={`tab-btn ${activeSection === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveSection('security')}
                >
                  <span>🔐</span> Sécurité
                </button>
                <button 
                  className={`tab-btn ${activeSection === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveSection('preferences')}
                >
                  <span>⚙️</span> Préférences
                </button>
              </div>

              <div className="card-content">
                {activeSection === 'info' && (
                  <>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-grid">
                          <div className="form-group">
                            <label><span>👤</span> Nom complet</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Votre nom complet"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label><span>📧</span> Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="votre@email.com"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label><span>📱</span> Téléphone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+213 5XX XXX XXX"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label><span>🏠</span> Wilaya</label>
                            <select
                              name="wilaya"
                              value={formData.wilaya}
                              onChange={handleChange}
                            >
                              <option value="">Sélectionner une wilaya</option>
                              <option value="Alger">Alger</option>
                              <option value="Oran">Oran</option>
                              <option value="Constantine">Constantine</option>
                              <option value="Blida">Blida</option>
                              <option value="Tizi Ouzou">Tizi Ouzou</option>
                              <option value="Béjaïa">Béjaïa</option>
                              <option value="Sétif">Sétif</option>
                            </select>
                          </div>

                          <div className="form-group full-width">
                            <label><span>📍</span> Adresse complète</label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="Numéro, rue, quartier..."
                              rows="2"
                            />
                          </div>
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="btn btn-primary btn-save">
                            <span>💾</span> Enregistrer les modifications
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
                    ) : (
                      <div className="profile-info-display">
                        <div className="info-grid">
                          <div className="info-item">
                            <div className="info-icon">👤</div>
                            <div className="info-content">
                              <span className="info-label">Nom complet</span>
                              <span className="info-value">{user?.name || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div className="info-content">
                              <span className="info-label">Email</span>
                              <span className="info-value">{user?.email}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">📱</div>
                            <div className="info-content">
                              <span className="info-label">Téléphone</span>
                              <span className="info-value">{user?.phone || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">🏠</div>
                            <div className="info-content">
                              <span className="info-label">Wilaya</span>
                              <span className="info-value">{user?.wilaya || formData.wilaya || 'Non renseignée'}</span>
                            </div>
                          </div>
                          <div className="info-item full-width">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                              <span className="info-label">Adresse</span>
                              <span className="info-value">{user?.address || 'Non renseignée'}</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          className="btn btn-primary btn-edit"
                          onClick={() => setIsEditing(true)}
                        >
                          <span>✏️</span> Modifier mes informations
                        </button>
                      </div>
                    )}
                  </>
                )}

                {activeSection === 'security' && (
                  <div className="security-section">
                    <div className="security-item">
                      <div className="security-info">
                        <span className="security-icon">🔑</span>
                        <div>
                          <h4>Mot de passe</h4>
                          <p>Dernière modification il y a 30 jours</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-small">Modifier</button>
                    </div>
                    <div className="security-item">
                      <div className="security-info">
                        <span className="security-icon">📱</span>
                        <div>
                          <h4>Authentification à deux facteurs</h4>
                          <p>Non activée</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-small">Activer</button>
                    </div>
                    <div className="security-item">
                      <div className="security-info">
                        <span className="security-icon">📋</span>
                        <div>
                          <h4>Sessions actives</h4>
                          <p>1 appareil connecté</p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-small">Voir</button>
                    </div>
                  </div>
                )}

                {activeSection === 'preferences' && (
                  <div className="preferences-section">
                    <div className="preference-item">
                      <div className="preference-info">
                        <span className="preference-icon">🔔</span>
                        <div>
                          <h4>Notifications par email</h4>
                          <p>Recevoir les mises à jour de commandes</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="preference-item">
                      <div className="preference-info">
                        <span className="preference-icon">📲</span>
                        <div>
                          <h4>Notifications SMS</h4>
                          <p>Alertes pour les promotions</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="preference-item">
                      <div className="preference-info">
                        <span className="preference-icon">🌙</span>
                        <div>
                          <h4>Mode sombre</h4>
                          <p>Interface en mode sombre</p>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="profile-sidebar">
              <div className="sidebar-card">
                <h3><span>📦</span> Commandes récentes</h3>
                <div className="recent-orders-list">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="order-item">
                      <div className="order-info">
                        <span className="order-id">{order.id}</span>
                        <span className="order-date">{order.date}</span>
                      </div>
                      <div className="order-details">
                        <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                          {order.status}
                        </span>
                        <span className="order-total">{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/client/orders" className="see-all-link">
                  Voir toutes les commandes →
                </a>
              </div>

              <div className="sidebar-card quick-actions-card">
                <h3><span>⚡</span> Actions rapides</h3>
                <div className="quick-actions-grid">
                  <a href="/products" className="quick-action">
                    <span className="action-icon">🛒</span>
                    <span>Catalogue</span>
                  </a>
                  <a href="/client/orders" className="quick-action">
                    <span className="action-icon">📦</span>
                    <span>Commandes</span>
                  </a>
                  <a href="/cart" className="quick-action">
                    <span className="action-icon">🛍️</span>
                    <span>Panier</span>
                  </a>
                  <a href="/contact" className="quick-action">
                    <span className="action-icon">💬</span>
                    <span>Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Profile
