import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import logo from '../photos/DZ-fellah.png'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      
      // Redirection automatique selon le type d'utilisateur
      const userType = user.userType || user.user_type
      if (userType === 'producer') {
        navigate('/producer/dashboard')
      } else if (userType === 'admin') {
        navigate('/admin')
      } else {
        navigate('/client/profile')
      }
    } catch (err) {
      console.error('Login error:', err)
      const message = err?.message || t('errors.invalidCredentials')

      // Backend blocks login when email is not verified (403) and resends the email.
      // Redirect user to the verification help page.
      if (
        err?.code === 'EMAIL_NOT_VERIFIED' ||
        message.toLowerCase().includes('email non vérifié') ||
        message.toLowerCase().includes('email non verifie')
      ) {
        const targetEmail = err?.email || email
        navigate(`/verify-email?email=${encodeURIComponent(targetEmail)}`)
        return
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src={logo} alt="DZ-Fellah" className="auth-logo" />
        <h1 className="auth-title">{t('auth.loginTitle')}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
            />
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('auth.loginLoading') : t('auth.loginCta')}
          </button>
        </form>

        <p className="auth-link">
          {t('auth.noAccount')} <Link to="/register-choice">{t('auth.registerCta')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
