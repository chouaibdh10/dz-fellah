import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ordersAPI } from '../../utils/api'
import { WILAYAS } from '../../utils/wilayas'
import ClientLayout from '../../components/client/ClientLayout'
import '../../styles/Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUserPhoto, updateUserProfile, isAuthenticated, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [photoFile, setPhotoFile] = useState(null)
  const [activeSection, setActiveSection] = useState('info')
  const fileInputRef = useRef(null)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    wilaya: user?.wilaya || '',
    city: user?.city || ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setPhotoPreview(user?.photo || null)
    setFormData({
      full_name: user?.full_name || user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      wilaya: user?.wilaya || '',
      city: user?.city || ''
    })
  }, [user, isAuthenticated, navigate])

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) return
      setOrdersLoading(true)
      setOrdersError(null)
      try {
        const data = await ordersAPI.listOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load orders:', err)
        setOrdersError(err?.message || 'Erreur de chargement des commandes')
      } finally {
        setOrdersLoading(false)
      }
    }
    loadOrders()
  }, [isAuthenticated])

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

      const objectUrl = URL.createObjectURL(file)
      setPhotoPreview(objectUrl)
      setPhotoFile(file)

      // Upload immediately to backend
      updateUserPhoto(file).catch((err) => {
        console.error('Photo upload failed:', err)
        alert(err?.message || 'Erreur lors du téléchargement de la photo')
      })
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
    updateUserPhoto(null).catch((err) => {
      console.error('Remove photo failed:', err)
      alert(err?.message || 'Erreur lors de la suppression de la photo')
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Only send fields supported by the backend profile serializer
      await updateUserProfile({
        full_name: formData.full_name,
        username: formData.username,
        phone: formData.phone,
        wilaya: formData.wilaya,
        city: formData.city,
        address: formData.address,
      })
      setIsEditing(false)
      alert('Profil mis à jour avec succès!')

      // Refresh in case backend normalized data
      refreshProfile?.()
    } catch (err) {
      console.error('Profile update error:', err)
      alert('Erreur lors de la mise à jour: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => {
    const amount = Number(o?.total_amount)
    return sum + (Number.isFinite(amount) ? amount : 0)
  }, 0)

  const clientStats = [
    { icon: '🛒', label: 'Commandes', value: ordersLoading ? '...' : totalOrders, color: 'blue' },
    { icon: '💰', label: 'Total dépensé', value: ordersLoading ? '...' : `${Math.round(totalSpent).toLocaleString()} DA`, color: 'green' },
    { icon: '❤️', label: 'Favoris', value: 0, color: 'red' }
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
                  <h1 className="profile-name">{user?.full_name || user?.name || 'Client'}</h1>
                  <p className="profile-email">{user?.email}</p>
                  <div className="profile-badges">
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
                  className={`tab-btn ${activeSection === 'verification' ? 'active' : ''}`}
                  onClick={() => setActiveSection('verification')}
                >
                  <span>🆔</span> Vérification
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
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleChange}
                              placeholder="Votre nom complet"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label><span>👤</span> Nom d'utilisateur</label>
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="Votre nom d'utilisateur"
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
                                {WILAYAS.map(wilaya => (
                                  <option key={wilaya.code} value={wilaya.code}>
                                    {wilaya.code.padStart(2, '0')} - {wilaya.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label><span>🏙️</span> Ville / Commune</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="Votre ville ou commune"
                              required
                            />
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
                              <span className="info-value">{user?.full_name || user?.name || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">👤</div>
                            <div className="info-content">
                              <span className="info-label">Nom d'utilisateur</span>
                              <span className="info-value">{user?.username || formData.username || 'Non renseigné'}</span>
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
                          <div className="info-item">
                            <div className="info-icon">🏙️</div>
                            <div className="info-content">
                              <span className="info-label">Ville / Commune</span>
                              <span className="info-value">{user?.city || formData.city || 'Non renseignée'}</span>
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
                        <div className="security-item password-section">
                          <div className="security-info">
                            <span className="security-icon">🔑</span>
                            <div>
                              <h4>Mot de passe</h4>
                            </div>
                          </div>
                          <button 
                            className="btn btn-outline btn-password-edit"
                            onClick={() => navigate('/client/change-password')}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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

                {activeSection === 'verification' && (
                  <div className="verification-section">
                    <div className="security-item">
                      <div className="security-info">
                        <span className="security-icon">🆔</span>
                        <div>
                          <h4>Pièce d'identité</h4>
                          <p>
                            {user?.isVerified
                              ? 'Compte vérifié ✅'
                              : user?.hasUploadedID
                                ? 'En cours de vérification ⏳'
                                : 'Non fournie'}
                          </p>
                        </div>
                      </div>
                      {!user?.hasUploadedID && (
                        <div className="upload-actions">
                          <input
                            type="file"
                            id="id-upload"
                            className="hidden-file-input"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              updateUserProfile({ id_image: file })
                                .then(() => {
                                  alert('Pièce d\'identité téléchargée avec succès. En attente de validation.')
                                  refreshProfile?.()
                                })
                                .catch((err) => {
                                  console.error('ID upload failed:', err)
                                  alert(err?.message || 'Erreur lors du téléchargement de la pièce')
                                })
                            }}
                          />
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => document.getElementById('id-upload').click()}
                          >
                            Télécharger
                          </button>
                        </div>
                      )}
                      {user?.hasUploadedID && !user?.isVerified && (
                        <button className="btn btn-outline btn-small" disabled>En attente</button>
                      )}
                    </div>
                    <div className="info-box verification-info">
                      <p>ℹ️ La vérification est nécessaire pour passer des commandes.</p>
                    </div>
                    {ordersError && (
                      <div className="info-box" style={{ marginTop: 12 }}>
                        <p style={{ margin: 0 }}>⚠️ {ordersError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Profile
