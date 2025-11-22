import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClientLayout from '../../components/client/ClientLayout'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Sauvegarder via API
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
