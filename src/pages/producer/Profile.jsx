import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProducerLayout from '../../components/producer/ProducerLayout'
import '../client/Profile.css'
import './ProducerProfile.css'

const ProducerProfile = () => {
  const { user, updateUserPhoto, updateUserProfile } = useAuth()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    farmName: user?.farmName || '',
    farmLocation: user?.farmLocation || '',
    specialty: user?.specialty || user?.specialties || '',
    description: user?.description || ''
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
      description: user?.description || ''
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
    { icon: '🌾', label: 'Cultures actives', value: user?.activeCrops || 8 },
    { icon: '📦', label: 'Commandes livrées', value: user?.deliveredOrders || 42 },
    { icon: '💰', label: 'Chiffre du mois', value: `${(user?.monthlyRevenue || 0).toLocaleString()} DA` },
    { icon: '🏅', label: 'Années d\'expérience', value: user?.experienceYears || 5 }
  ]
  const specialtiesSource = user?.specialties || formData.specialty || ''
  const specialities = specialtiesSource
    ? specialtiesSource.split(',').map((item) => item.trim()).filter(Boolean)
    : []

  return (
    <ProducerLayout>
      <div className="producer-profile profile-page">
        <div className="container">
          <div className="profile-header">
            <div>
              <h1 className="page-title">Profil Producteur</h1>
              <p className="page-subtitle">Gérez l\'image publique de votre exploitation</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                <div className="profile-photo">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Photo de profil producteur" />
                  ) : (
                    <div className="photo-placeholder">
                      <span className="placeholder-icon">👨‍🌾</span>
                    </div>
                  )}
                </div>
                <div className="photo-actions">
                  <button
                    type="button"
                    className="btn btn-icon btn-photo-edit"
                    onClick={handlePhotoClick}
                    title="Changer de photo"
                  >
                    📷
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      className="btn btn-icon btn-photo-delete"
                      onClick={handleRemovePhoto}
                      title="Supprimer la photo"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
              <p className="photo-hint">Affichez votre ferme ou votre logo (max 5MB)</p>
            </div>

            <div className="profile-stats">
              {productionStats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <span className="stat-icon">{stat.icon}</span>
                  <div>
                    <strong>{stat.value}</strong>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
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
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Adresse personnelle</label>
                  <input name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Nom de l'exploitation</label>
                  <input name="farmName" value={formData.farmName} onChange={handleChange} placeholder="Ferme des Cèdres" />
                </div>

                <div className="form-group">
                  <label>Localisation de la ferme</label>
                  <input name="farmLocation" value={formData.farmLocation} onChange={handleChange} placeholder="Wilaya, Commune" />
                </div>

                <div className="form-group">
                  <label>Spécialités (séparées par des virgules)</label>
                  <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Agrumes, Olives, Miel" />
                </div>

                <div className="form-group">
                  <label>Présentation publique</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Présentez votre histoire, vos pratiques et vos engagements"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">💾 Enregistrer</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Annuler</button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">👤 Nom:</span>
                  <span className="info-value">{user?.name || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📧 Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📞 Téléphone:</span>
                  <span className="info-value">{user?.phone || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📍 Adresse:</span>
                  <span className="info-value">{user?.address || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🏡 Exploitation:</span>
                  <span className="info-value">{user?.farmName || formData.farmName || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🗺️ Localisation:</span>
                  <span className="info-value">{user?.farmLocation || formData.farmLocation || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🌱 Spécialités:</span>
                  <span className="info-value">
                    {specialities && specialities.length > 0 ? (
                      <div className="producer-tags">
                        {specialities.map((item) => (
                          <span key={item} className="producer-tag">{item}</span>
                        ))}
                      </div>
                    ) : (
                      'Non renseignées'
                    )}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">📝 Présentation:</span>
                  <span className="info-value">{user?.description || formData.description || 'Ajoutez une description pour inspirer confiance.'}</span>
                </div>

                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  ✏️ Modifier le profil producteur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProducerLayout>
  )
}

export default ProducerProfile
