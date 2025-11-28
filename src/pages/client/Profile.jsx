import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClientLayout from '../../components/client/ClientLayout'
import './Profile.css'

const Profile = () => {
  const { user, updateUserPhoto, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [photoFile, setPhotoFile] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  // Synchroniser la photo preview avec la photo de l'utilisateur
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
        // Mettre à jour immédiatement dans le contexte
        updateUserPhoto(photoDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
    // Mettre à jour immédiatement dans le contexte
    updateUserPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Sauvegarder la photo si elle a changé
    if (photoPreview && photoPreview !== user?.photo) {
      updateUserPhoto(photoPreview)
    }
    
    // Sauvegarder les autres données du profil
    updateUserProfile(formData)
    
    // TODO: Sauvegarder via API avec photoFile
    setIsEditing(false)
    alert('Profil mis à jour avec succès!')
  }

  return (
    <ClientLayout>
      <div className="client-profile">
        <div className="container">
          <div className="profile-header">
            <h1 className="page-title">Mon Profil</h1>
            <p className="page-subtitle">Gérez vos informations personnelles</p>
          </div>

          <div className="profile-card">
            {/* Photo Profile Section */}
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                <div className="profile-photo">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Photo de profil" />
                  ) : (
                    <div className="photo-placeholder">
                      <span className="placeholder-icon">👤</span>
                    </div>
                  )}
                </div>
                <div className="photo-actions">
                  <button 
                    type="button"
                    className="btn btn-icon btn-photo-edit"
                    onClick={handlePhotoClick}
                    title="Modifier la photo"
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
              <p className="photo-hint">Format accepté: JPG, PNG (max 5MB)</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
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
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">👤 Nom:</span>
                  <span className="info-value">{user?.name}</span>
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

                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Modifier mon profil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Profile
