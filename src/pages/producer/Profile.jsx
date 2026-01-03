import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { productsAPI, shopsAPI } from '../../utils/api'
import ProducerLayout from '../../components/producer/ProducerLayout'
import '../../styles/Profile.css'

const ProducerProfile = () => {
  const navigate = useNavigate()
  const { user, updateUserPhoto, updateUserProfile, refreshProfile } = useAuth()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('info')
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [dashboardOverview, setDashboardOverview] = useState(null)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [overviewError, setOverviewError] = useState(null)
  const [myShop, setMyShop] = useState(null)
  const [shopLoading, setShopLoading] = useState(false)
  const [shopError, setShopError] = useState(null)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    wilaya: user?.wilaya || '',
    city: user?.city || '',
    farmName: '',
    farmLocation: '',
    farmDescription: '',
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
      full_name: user?.full_name || user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      wilaya: user?.wilaya || '',
      city: user?.city || '',
      farmName: myShop?.name || '',
      farmLocation: myShop?.address || '',
      farmDescription: myShop?.description || '',
      specialty: user?.specialty || user?.specialties || '',
      description: user?.description || '',
      experience: user?.experienceYears || 5,
      certifications: user?.certifications || ''
    })
  }, [user, myShop])

  useEffect(() => {
    const loadMyShop = async () => {
      setShopLoading(true)
      setShopError(null)
      try {
        const shop = await shopsAPI.getMyShop()
        setMyShop(shop)
      } catch (err) {
        console.error('Failed to load my shop:', err)
        setMyShop(null)
        setShopError(err?.message || 'Impossible de charger la boutique')
      } finally {
        setShopLoading(false)
      }
    }

    loadMyShop()
  }, [])

  useEffect(() => {
    // Keep farm fields in sync with real shop when not editing.
    if (isEditing) return
    if (!myShop) return
    setFormData((prev) => ({
      ...prev,
      farmName: myShop?.name || '',
      farmLocation: myShop?.address || '',
      farmDescription: myShop?.description || '',
    }))
  }, [myShop, isEditing])

  useEffect(() => {
    const loadOverview = async () => {
      setOverviewLoading(true)
      setOverviewError(null)
      try {
        const payload = await productsAPI.getDashboardOverview()
        setDashboardOverview(payload)
      } catch (err) {
        // Endpoint requires IsVerified; if producer isn't verified it will 403.
        setDashboardOverview(null)
        setOverviewError(err?.message || 'Impossible de charger les statistiques')
      } finally {
        setOverviewLoading(false)
      }
    }

    loadOverview()
  }, [])

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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 5 MB')
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPhotoPreview(objectUrl)
      updateUserPhoto(file).catch((err) => {
        console.error('Photo upload failed:', err)
        alert(err?.message || 'Erreur lors du téléchargement de la photo')
      })
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
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

    try {
      await updateUserProfile({
        full_name: formData.full_name,
        username: formData.username,
        phone: formData.phone,
        wilaya: formData.wilaya,
        city: formData.city,
        address: formData.address,
      })

      if (myShop) {
        const updatedShop = await shopsAPI.updateShop(myShop.id, {
          name: formData.farmName,
          address: formData.farmLocation,
          description: formData.farmDescription,
        })
        setMyShop(updatedShop)
      }

      setIsEditing(false)
      alert('Profil producteur mis à jour !')
      refreshProfile?.()
    } catch (err) {
      console.error('Producer profile update error:', err)
      alert(err?.message || 'Erreur lors de la mise à jour du profil')
    }
  }

  const totalProducts = dashboardOverview?.total_products
  const activeOrders = dashboardOverview?.active_orders
  const monthlyRevenue = dashboardOverview?.monthly_revenue

  const producerStats = [
    {
      icon: '🌽',
      label: 'Produits actifs',
      value: overviewLoading ? '...' : (totalProducts ?? '—'),
      color: 'green'
    },
    {
      icon: '📦',
      label: 'Commandes actives',
      value: overviewLoading ? '...' : (activeOrders ?? '—'),
      color: 'blue'
    },
    {
      icon: '💰',
      label: 'CA du mois',
      value: overviewLoading
        ? '...'
        : (monthlyRevenue !== undefined && monthlyRevenue !== null
          ? `${Math.round(Number(monthlyRevenue) || 0).toLocaleString()} DA`
          : '—'),
      color: 'orange'
    }
  ]

  const specialtiesSource = user?.specialties || formData.specialty || ''
  const specialties = specialtiesSource
    ? specialtiesSource.split(',').map((item) => item.trim()).filter(Boolean)
    : []

  return (
    <ProducerLayout>
      <div className="producer-profile enhanced-profile">
        <div className="container">
          <div className="profile-hero">
            <div className="profile-hero-bg"></div>
            <div className="profile-hero-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar" onClick={handlePhotoClick}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Photo producteur" />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>👨‍🌾</span>
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
                  <h1 className="profile-name">{user?.full_name || user?.name || 'Producteur'}</h1>
                  <p className="profile-email">{user?.email}</p>
                  <p className="profile-email">
                    {shopLoading ? '...' : (myShop?.name || formData.farmName || 'Boutique sans nom')}
                  </p>
                  <div className="profile-badges">
                    <span className="badge badge-member">Producteur</span>
                    {user?.isVerified && (
                      <span className="badge badge-verified">Vérifié</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats-grid">
            {producerStats.map((stat, index) => (
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

          {overviewError && (
            <div className="info-box" style={{ marginTop: 12 }}>
              <p style={{ margin: 0 }}>⚠️ {overviewError}</p>
            </div>
          )}

          <div className="profile-content-grid">
            <div className="profile-main-card">
              <div className="card-tabs">
                <button
                  className={`tab-btn ${activeSection === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveSection('info')}
                >
                  <span>👤</span> Informations
                </button>
                <button
                  className={`tab-btn ${activeSection === 'farm' ? 'active' : ''}`}
                  onClick={() => setActiveSection('farm')}
                >
                  <span>🏡</span> Exploitation
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
                            <label><span>🏠</span> Wilaya</label>
                            <select
                              name="wilaya"
                              value={formData.wilaya}
                              onChange={handleChange}
                            >
                              <option value="">Sélectionner une wilaya</option>
                              <option value="16">16 - Alger</option>
                              <option value="09">09 - Blida</option>
                              <option value="15">15 - Tizi Ouzou</option>
                              <option value="31">31 - Oran</option>
                              <option value="25">25 - Constantine</option>
                              <option value="19">19 - Sétif</option>
                              <option value="06">06 - Béjaïa</option>
                              <option value="13">13 - Tlemcen</option>
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
                          <div className="form-group">
                            <label><span>📱</span> Téléphone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+213 5XX XXX XXX"
                            />
                          </div>
                          <div className="form-group full-width">
                            <label><span>📍</span> Adresse complète</label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="Numéro, rue, commune"
                              rows="2"
                            />
                          </div>
                          <div className="form-group">
                            <label><span>🏠</span> Nom de la ferme</label>
                            <input
                              type="text"
                              name="farmName"
                              value={formData.farmName}
                              onChange={handleChange}
                              placeholder="Ferme des Oliviers"
                            />
                          </div>
                          <div className="form-group">
                            <label><span>📍</span> Localisation</label>
                            <input
                              type="text"
                              name="farmLocation"
                              value={formData.farmLocation}
                              onChange={handleChange}
                              placeholder="Wilaya, Commune"
                            />
                          </div>
                          <div className="form-group full-width">
                            <label><span>📝</span> Description de la boutique</label>
                            <textarea
                              name="farmDescription"
                              value={formData.farmDescription}
                              onChange={handleChange}
                              placeholder="Décrivez votre ferme/boutique (produits, méthodes, horaires...)"
                              rows="3"
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
                          <div className="info-item">
                            <div className="info-icon">📱</div>
                            <div className="info-content">
                              <span className="info-label">Téléphone</span>
                              <span className="info-value">{user?.phone || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="info-item full-width">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                              <span className="info-label">Adresse</span>
                              <span className="info-value">{user?.address || 'Non renseignée'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">🏠</div>
                            <div className="info-content">
                              <span className="info-label">Nom de la ferme</span>
                              <span className="info-value">{user?.farmName || formData.farmName || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                              <span className="info-label">Localisation</span>
                              <span className="info-value">{user?.farmLocation || formData.farmLocation || 'Non renseignée'}</span>
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
                            onClick={() => navigate('/producer/change-password')}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeSection === 'farm' && (
                  <div className="profile-info-display">
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">🏡</div>
                        <div className="info-content">
                          <span className="info-label">Exploitant</span>
                          <span className="info-value">{myShop?.name || formData.farmName || 'Non renseigné'}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">📍</div>
                        <div className="info-content">
                          <span className="info-label">Localisation</span>
                          <span className="info-value">{myShop?.address || formData.farmLocation || 'Non renseignée'}</span>
                        </div>
                      </div>
                      <div className="info-item full-width">
                        <div className="info-icon">📝</div>
                        <div className="info-content">
                          <span className="info-label">Description</span>
                          <span className="info-value">{myShop?.description || formData.farmDescription || 'Non renseignée'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4><span>🌱</span> Spécialités cultivées</h4>
                      {specialties.length > 0 ? (
                        <div className="specialties-grid">
                          {specialties.map((item, index) => (
                            <div key={index} className="specialty-card">
                              <span className="specialty-icon">🌾</span>
                              <span className="specialty-name">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="verification-info">
                          <p>Ajoutez vos spécialités pour aider les clients à vous trouver.</p>
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-primary btn-edit"
                      onClick={() => { setActiveSection('info'); setIsEditing(true) }}
                    >
                      <span>✏️</span> Mettre à jour l'exploitation
                    </button>

                    {shopError && (
                      <div className="info-box verification-info" style={{ marginTop: 12 }}>
                        <p style={{ margin: 0 }}>⚠️ {shopError}</p>
                      </div>
                    )}
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
                            id="id-upload-producer"
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
                            onClick={() => document.getElementById('id-upload-producer').click()}
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
                      <p>ℹ️ La vérification est nécessaire pour vendre vos produits et accéder aux commandes.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default ProducerProfile
