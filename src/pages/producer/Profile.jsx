import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import './ProducerProfile.css'

const ProducerProfile = () => {
  const { user, updateUserPhoto, updateUserProfile } = useAuth()
  const fileInputRef = useRef(null)
  const bannerInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [bannerPreview, setBannerPreview] = useState(user?.banner || '/images/banners/farm-default.jpg')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    farmName: user?.farmName || '',
    farmLocation: user?.farmLocation || '',
    specialty: user?.specialty || user?.specialties || '',
    description: user?.description || '',
    experience: user?.experienceYears || 5,
    certifications: user?.certifications || ''
  })

  useEffect(() => {
    setPhotoPreview(user?.photo || null)
  }, [user?.photo])

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      farmName: user?.farmName || '',
      farmLocation: user?.farmLocation || '',
      specialty: user?.specialty || user?.specialties || '',
      description: user?.description || '',
      experience: user?.experienceYears || 5,
      certifications: user?.certifications || ''
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleBannerClick = () => {
    bannerInputRef.current?.click()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const photoDataUrl = reader.result
      setPhotoPreview(photoDataUrl)
      updateUserPhoto(photoDataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('La bannière ne doit pas dépasser 10 MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    updateUserPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUserProfile(formData)
    setIsEditing(false)
    alert('Profil producteur mis à jour !')
  }

  const productionStats = [
    { icon: '🌾', label: 'Produits actifs', value: user?.activeCrops || 12, color: 'green', trend: '+3' },
    { icon: '📦', label: 'Commandes livrées', value: user?.deliveredOrders || 156, color: 'blue', trend: '+24' },
    { icon: '💰', label: 'CA du mois', value: `${(user?.monthlyRevenue || 125000).toLocaleString()} DA`, color: 'orange' },
    { icon: '⭐', label: 'Note moyenne', value: '4.8/5', color: 'yellow', trend: '+0.2' }
  ]

  const achievements = [
    { icon: '🏆', title: 'Producteur Vérifié', desc: 'Identité confirmée' },
    { icon: '🌿', title: 'Bio Certifié', desc: 'Agriculture biologique' },
    { icon: '🚀', title: 'Top Vendeur', desc: '+100 ventes' },
    { icon: '💎', title: 'Client Fidèle', desc: '95% satisfaction' }
  ]

  const specialtiesSource = user?.specialties || formData.specialty || ''
  const specialities = specialtiesSource
    ? specialtiesSource.split(',').map((item) => item.trim()).filter(Boolean)
    : []

  return (
    <ProducerLayout>
      <div className="producer-profile enhanced-producer-profile">
        <div className="container">
          {/* Hero Banner */}
          <div className="producer-hero-banner">
            <div className="banner-image" style={{ backgroundImage: `url(${bannerPreview})` }}>
              <div className="banner-overlay"></div>
              <button className="banner-edit-btn" onClick={handleBannerClick}>
                <span>📷</span> Modifier la bannière
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="producer-hero-content">
              <div className="producer-avatar-wrapper" onClick={handlePhotoClick}>
                <div className="producer-avatar">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Photo producteur" />
                  ) : (
                    <div className="avatar-placeholder-producer">
                      <span>👨‍🌾</span>
                    </div>
                  )}
                  <div className="avatar-edit-overlay">
                    <span>📷</span>
                  </div>
                </div>
                {photoPreview && (
                  <button 
                    className="avatar-remove"
                    onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
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
              
              <div className="producer-identity">
                <div className="identity-main">
                  <h1>{user?.name || 'Producteur'}</h1>
                  <p className="farm-name">
                    <span>🏡</span> {user?.farmName || formData.farmName || 'Ma Ferme'}
                  </p>
                </div>
                <div className="identity-badges">
                  <span className="verified-badge">
                    <span>✓</span> Producteur Vérifié
                  </span>
                  <span className="location-badge">
                    <span>📍</span> {user?.farmLocation || formData.farmLocation || 'Algérie'}
                  </span>
                </div>
              </div>
              
              <div className="hero-actions">
                <Link to="/producer/shop" className="btn btn-primary">
                  <span>🏪</span> Voir ma boutique
                </Link>
                <button className="btn btn-outline-light" onClick={() => setIsEditing(true)}>
                  <span>✏️</span> Modifier
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="producer-stats-row">
            {productionStats.map((stat, index) => (
              <div key={index} className={`producer-stat-card stat-${stat.color}`}>
                <div className="stat-icon-box">
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
                {stat.trend && (
                  <span className="stat-trend positive">
                    {stat.trend}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="producer-content-layout">
            {/* Left Column */}
            <div className="producer-main-content">
              {/* Tabs */}
              <div className="producer-tabs-card">
                <div className="tabs-header">
                  <button 
                    className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    <span>👤</span> Informations
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'farm' ? 'active' : ''}`}
                    onClick={() => setActiveTab('farm')}
                  >
                    <span>🏡</span> Exploitation
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                  >
                    <span>🌾</span> Spécialités
                  </button>
                </div>

                <div className="tabs-content">
                  {activeTab === 'info' && (
                    <>
                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="producer-edit-form">
                          <div className="form-section">
                            <h4><span>👤</span> Informations personnelles</h4>
                            <div className="form-grid-2">
                              <div className="form-group">
                                <label>Nom complet</label>
                                <input name="name" value={formData.name} onChange={handleChange} required />
                              </div>
                              <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                              </div>
                              <div className="form-group">
                                <label>Téléphone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                              </div>
                              <div className="form-group">
                                <label>Adresse personnelle</label>
                                <input name="address" value={formData.address} onChange={handleChange} />
                              </div>
                            </div>
                          </div>

                          <div className="form-section">
                            <h4><span>🏡</span> Informations de l'exploitation</h4>
                            <div className="form-grid-2">
                              <div className="form-group">
                                <label>Nom de la ferme</label>
                                <input name="farmName" value={formData.farmName} onChange={handleChange} placeholder="Ferme des Oliviers" />
                              </div>
                              <div className="form-group">
                                <label>Localisation</label>
                                <input name="farmLocation" value={formData.farmLocation} onChange={handleChange} placeholder="Wilaya, Commune" />
                              </div>
                              <div className="form-group">
                                <label>Années d'expérience</label>
                                <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" />
                              </div>
                              <div className="form-group">
                                <label>Certifications</label>
                                <input name="certifications" value={formData.certifications} onChange={handleChange} placeholder="Bio, Label Rouge..." />
                              </div>
                            </div>
                          </div>

                          <div className="form-section">
                            <h4><span>🌾</span> Production</h4>
                            <div className="form-group">
                              <label>Spécialités (séparées par virgules)</label>
                              <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Agrumes, Olives, Miel, Légumes bio" />
                            </div>
                            <div className="form-group">
                              <label>Description publique</label>
                              <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Présentez votre histoire, vos pratiques agricoles et vos engagements..."
                              />
                            </div>
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                              <span>💾</span> Enregistrer les modifications
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                              Annuler
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="producer-info-display">
                          <div className="info-section">
                            <h4><span>👤</span> Informations personnelles</h4>
                            <div className="info-grid-display">
                              <div className="info-box">
                                <span className="info-icon">👤</span>
                                <div>
                                  <span className="info-label">Nom complet</span>
                                  <span className="info-value">{user?.name || 'Non renseigné'}</span>
                                </div>
                              </div>
                              <div className="info-box">
                                <span className="info-icon">📧</span>
                                <div>
                                  <span className="info-label">Email</span>
                                  <span className="info-value">{user?.email}</span>
                                </div>
                              </div>
                              <div className="info-box">
                                <span className="info-icon">📱</span>
                                <div>
                                  <span className="info-label">Téléphone</span>
                                  <span className="info-value">{user?.phone || 'Non renseigné'}</span>
                                </div>
                              </div>
                              <div className="info-box">
                                <span className="info-icon">📍</span>
                                <div>
                                  <span className="info-label">Adresse</span>
                                  <span className="info-value">{user?.address || 'Non renseignée'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button className="btn btn-primary btn-edit-profile" onClick={() => setIsEditing(true)}>
                            <span>✏️</span> Modifier mes informations
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'farm' && (
                    <div className="farm-info-display">
                      <div className="farm-header">
                        <h3>{user?.farmName || formData.farmName || 'Mon Exploitation'}</h3>
                        <p className="farm-location">
                          <span>📍</span> {user?.farmLocation || formData.farmLocation || 'Localisation non renseignée'}
                        </p>
                      </div>
                      
                      <div className="farm-details-grid">
                        <div className="farm-detail-card">
                          <span className="detail-icon">🗓️</span>
                          <div>
                            <span className="detail-label">Années d'expérience</span>
                            <span className="detail-value">{formData.experience || 5} ans</span>
                          </div>
                        </div>
                        <div className="farm-detail-card">
                          <span className="detail-icon">📜</span>
                          <div>
                            <span className="detail-label">Certifications</span>
                            <span className="detail-value">{formData.certifications || 'Agriculture traditionnelle'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="farm-description">
                        <h4><span>📝</span> Présentation</h4>
                        <p>{user?.description || formData.description || 'Ajoutez une description pour présenter votre exploitation aux clients potentiels.'}</p>
                      </div>
                      
                      <button className="btn btn-primary" onClick={() => { setActiveTab('info'); setIsEditing(true); }}>
                        <span>✏️</span> Modifier les informations
                      </button>
                    </div>
                  )}

                  {activeTab === 'products' && (
                    <div className="specialties-display">
                      <h4><span>🌾</span> Mes spécialités</h4>
                      {specialities && specialities.length > 0 ? (
                        <div className="specialties-grid">
                          {specialities.map((item, index) => (
                            <div key={index} className="specialty-card">
                              <span className="specialty-icon">🌱</span>
                              <span className="specialty-name">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-specialties">
                          <span>🌾</span>
                          <p>Aucune spécialité renseignée</p>
                          <button className="btn btn-outline" onClick={() => { setActiveTab('info'); setIsEditing(true); }}>
                            Ajouter des spécialités
                          </button>
                        </div>
                      )}
                      
                      <div className="products-cta">
                        <Link to="/producer/shop" className="btn btn-primary">
                          <span>🏪</span> Gérer mes produits
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="producer-sidebar">
              {/* Achievements */}
              <div className="sidebar-card achievements-card">
                <h3><span>🏅</span> Badges & Récompenses</h3>
                <div className="achievements-grid">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div>
                        <span className="achievement-title">{achievement.title}</span>
                        <span className="achievement-desc">{achievement.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="sidebar-card quick-links-card">
                <h3><span>⚡</span> Accès rapide</h3>
                <div className="quick-links-list">
                  <Link to="/producer/shop" className="quick-link-item">
                    <span className="link-icon">🏪</span>
                    <span>Ma boutique</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link to="/producer/orders" className="quick-link-item">
                    <span className="link-icon">📦</span>
                    <span>Mes commandes</span>
                    <span className="link-arrow">→</span>
                  </Link>
                  <Link to="/producer/dashboard" className="quick-link-item">
                    <span className="link-icon">📊</span>
                    <span>Tableau de bord</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div className="sidebar-card support-card">
                <span className="support-icon">💬</span>
                <h4>Besoin d'aide ?</h4>
                <p>Notre équipe est là pour vous accompagner</p>
                <Link to="/contact" className="btn btn-outline btn-small">
                  Contacter le support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default ProducerProfile
