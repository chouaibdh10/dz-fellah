import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import '../styles/Auth.css'

const EmailVerified = () => {
  const { t } = useTranslation()
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uidb64 || !token) {
        setError(t('emailVerified.invalidLink'))
        setVerifying(false)
        return
      }

      try {
        await authAPI.verifyEmail(uidb64, token)
        setSuccess(true)
        
        // Rediriger après 3 secondes
        setTimeout(() => {
          if (user?.userType === 'producer') {
            navigate('/producer/shop')
          } else if (user?.userType === 'client' || user?.user_type === 'client') {
            navigate('/products')
          } else {
            navigate('/login')
          }
        }, 3000)
      } catch (err) {
        setError(err?.message || t('emailVerified.verifyError'))
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token, uidb64, navigate, user])

  if (verifying) {
    return (
      <div className="auth-page">
        <div className="auth-container verify-email-container">
          <div className="verify-icon loading">
            ⏳
          </div>
          <h1 className="auth-title">{t('emailVerified.verifyingTitle')}</h1>
          <p className="verify-message">{t('emailVerified.verifyingSubtitle')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-container verify-email-container">
          <div className="verify-icon error">
            ❌
          </div>
          <h1 className="auth-title">{t('emailVerified.errorTitle')}</h1>
          <p className="verify-message error-text">{error}</p>
          <div className="verify-actions">
            <Link to="/verify-email" className="btn btn-primary">
              {t('emailVerified.resend')}
            </Link>
            <Link to="/login" className="btn btn-secondary">
              {t('emailVerified.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container verify-email-container">
        <div className="verify-icon success">
          ✅
        </div>
        
        <h1 className="auth-title">{t('emailVerified.successTitle')}</h1>
        
        <p className="verify-message">
          {t('emailVerified.successMessage')}
        </p>

        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <p className="redirect-message">
          {t('emailVerified.redirecting')}
        </p>

        <div className="verify-actions">
          <Link 
            to={user?.userType === 'producer' ? '/producer/dashboard' : '/products'} 
            className="btn btn-primary"
          >
            {t('emailVerified.continue')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailVerified
