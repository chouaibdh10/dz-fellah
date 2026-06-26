import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../utils/api'
import logo from '../photos/DZ-fellah.png'
import '../styles/PasswordReset.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Veuillez entrer votre adresse email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    setLoading(true)

    try {
      await authAPI.forgotPassword(email)
      navigate('/check-email', { state: { email } })
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="password-reset-page">
      <div className="password-reset-container">
        <Link to="/login" className="back-link">
          <span>←</span> Retour à la connexion
        </Link>

        <img src={logo} alt="DZ-Fellah" className="auth-logo" />
        
        <div className="reset-header">
          <div className="reset-icon">🔑</div>
          <h1 className="reset-title">Mot de passe oublié ?</h1>
          <p className="reset-subtitle">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
            <label htmlFor="email">
              <span>📧</span> Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Envoi en cours...
              </>
            ) : (
              <>
                <span>📨</span>
                Envoyer le lien de réinitialisation
              </>
            )}
          </button>
        </form>

        <div className="reset-footer">
          <p>Vous vous souvenez de votre mot de passe ?</p>
          <Link to="/login" className="login-link">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
