import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/ChangePassword.css'

const ChangePassword = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validatePassword = () => {
    if (!formData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel')
      return false
    }
    if (!formData.newPassword) {
      setError('Veuillez entrer un nouveau mot de passe')
      return false
    }
    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }
    if (formData.newPassword === formData.currentPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien')
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePassword()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would call your API to change password
      // await changePassword(formData.currentPassword, formData.newPassword)
      
      alert('Mot de passe modifié avec succès!')
      navigate('/client/profile')
    } catch (err) {
      setError('Une erreur est survenue. Veuillez vérifier votre mot de passe actuel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="change-password-page">
        <div className="change-password-container">
          <div className="password-header">
            <button 
              className="back-btn"
              onClick={() => navigate('/client/profile')}
            >
              <span>←</span> Retour au profil
            </button>
            <h1 className="password-title">
              <span className="title-icon">🔑</span>
              Changer le mot de passe
            </h1>
            <p className="password-subtitle">
              Assurez-vous d'utiliser un mot de passe fort et unique
            </p>
          </div>

          <div className="password-card">
            <form onSubmit={handleSubmit} className="password-form">
              {error && (
                <div className="error-alert">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="currentPassword">
                  <span className="label-icon">🔒</span>
                  Mot de passe actuel
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe actuel"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <span className="label-icon">🔐</span>
                  Nouveau mot de passe
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <div className="password-requirements">
                  <p className="requirements-title">Le mot de passe doit contenir :</p>
                  <ul>
                    <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
                      Au moins 6 caractères
                    </li>
                    <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                      Une lettre majuscule (recommandé)
                    </li>
                    <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                      Un chiffre (recommandé)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">✅</span>
                  Confirmer le nouveau mot de passe
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => navigate('/client/profile')}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-save"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Modification...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="security-tips">
              <h3>
                <span>💡</span>
                Conseils de sécurité
              </h3>
              <ul>
                <li>Utilisez un mot de passe unique que vous n'utilisez nulle part ailleurs</li>
                <li>Évitez d'utiliser des informations personnelles facilement devinables</li>
                <li>Changez votre mot de passe régulièrement</li>
                <li>Ne partagez jamais votre mot de passe avec qui que ce soit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ChangePassword
