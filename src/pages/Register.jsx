import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import logo from '../photos/DZ-fellah.png'
import '../styles/Auth.css'
import { WILAYAS } from '../utils/wilayas'

const Register = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const userTypeFromUrl = searchParams.get('type') || 'client'

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: userTypeFromUrl,
    phone: '',
    wilaya: '',
    city: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (userTypeFromUrl) {
      setFormData(prev => ({ ...prev, userType: userTypeFromUrl }))
    }
  }, [userTypeFromUrl])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.passwordMismatch'))
      return
    }

    if (formData.password.length < 6) {
      setError(t('errors.passwordTooShort'))
      return
    }

    setLoading(true)

    try {
      await register(formData, formData.userType)

      // Après inscription: demander la vérification email
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || t('errors.genericRegister'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/register-choice" className="back-link">
          ← {t('auth.back')}
        </Link>

        <img src={logo} alt="DZ-Fellah" className="auth-logo" />
        <h1 className="auth-title">{t('auth.registerTitle')}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('auth.fullName')}</label>
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
            <label>{t('auth.username')}</label>
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
            <label>{t('auth.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('auth.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0555 12 34 56"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('auth.wilaya')}</label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">{t('auth.select')}</option>
                {WILAYAS.map(wilaya => (
                  <option key={wilaya.code} value={wilaya.code}>
                    {wilaya.code.padStart(2, '0')} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('auth.city')}</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Votre ville"
                required
              />
            </div>
          </div>



          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('auth.confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('auth.registerLoading') : t('auth.registerCta')}
          </button>
        </form>

        <p className="auth-link">
          {t('auth.alreadyAccount')} <Link to="/login">{t('auth.loginCta')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
