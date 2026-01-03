import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const VerifyEmail = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const targetEmail = useMemo(() => {
    return searchParams.get('email') || user?.email || ''
  }, [searchParams, user])

  return (
    <div className="auth-page">
      <div className="auth-container verify-email-container">
        <div className="verify-icon">
          📧
        </div>
        
        <h1 className="auth-title">Vérifiez votre email</h1>
        
        <p className="verify-message">
          {t('verifyEmail.sentTo')} <strong>{targetEmail || t('verifyEmail.yourEmail')}</strong>
        </p>
        
        <p className="verify-instructions">
          {t('verifyEmail.instructions')}
        </p>

        <div className="verify-steps">
          <div className="verify-step">
            <span className="step-number">1</span>
            <span>{t('verifyEmail.step1')}</span>
          </div>
          <div className="verify-step">
            <span className="step-number">2</span>
            <span>{t('verifyEmail.step2')}</span>
          </div>
          <div className="verify-step">
            <span className="step-number">3</span>
            <span>{t('verifyEmail.step3')}</span>
          </div>
        </div>

        <div className="verify-hint">
          <p>Si vous n'avez rien reçu, reconnectez-vous : un nouvel email de vérification sera envoyé automatiquement.</p>
        </div>

        <div className="verify-help">
          <p>{t('verifyEmail.noEmail')}</p>
          <ul>
            <li>{t('verifyEmail.help1')}</li>
            <li>{t('verifyEmail.help2')}</li>
            <li>{t('verifyEmail.help3')}</li>
          </ul>
        </div>

        <p className="auth-link">
          <Link to="/login">{t('verifyEmail.backToLogin')}</Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
