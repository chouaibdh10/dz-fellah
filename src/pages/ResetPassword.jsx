import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import logo from '../photos/DZ-fellah.png'
import '../styles/PasswordReset.css'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
    if (!formData.newPassword) {
      setError('Veuillez entrer un nouveau mot de passe')
      return false
    }
    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
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
      
      // Here you would call your API to reset password
      // await resetPassword(token, formData.newPassword)
      
      alert('Mot de passe réinitialisé avec succès!')
      navigate('/login')
    } catch (err) {
      setError('Une erreur est survenue. Le lien a peut-être expiré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="password-reset-page">
      <div className="password-reset-container">
        <img src={logo} alt="DZ-Fellah" className="auth-logo" />
        
        <div className="reset-header">
          <div className="reset-icon">🔐</div>
          <h1 className="reset-title">Créer un nouveau mot de passe</h1>
          <p className="reset-subtitle">
            Entrez votre nouveau mot de passe ci-dessous
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group">
            <label htmlFor="newPassword">
              <span>🔐</span> Nouveau mot de passe
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
              <span>✅</span> Confirmer le mot de passe
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Réinitialisation...
              </>
            ) : (
              <>
                <span>🔑</span>
                Réinitialiser le mot de passe
              </>
            )}
          </button>
        </form>

        <div className="reset-footer">
          <Link to="/login" className="login-link">
            <span>←</span> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
