import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/RegisterChoice.css'

const RegisterChoice = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="register-choice-page">
      <div className="choice-container">
        <h1 className="choice-title">{t('registerChoice.title')}</h1>
        <p className="choice-subtitle">{t('registerChoice.subtitle')}</p>
        
        <div className="choice-cards">
          <button 
            className="choice-card client-card"
            onClick={() => navigate('/register?type=client')}
          >
            <div className="card-icon">🛒</div>
            <h3>{t('registerChoice.clientTitle')}</h3>
            <p>{t('registerChoice.clientDesc')}</p>
          </button>

          <button 
            className="choice-card producer-card"
            onClick={() => navigate('/register?type=producer')}
          >
            <div className="card-icon">🌾</div>
            <h3>{t('registerChoice.producerTitle')}</h3>
            <p>{t('registerChoice.producerDesc')}</p>
          </button>
        </div>

        <p className="auth-link">
          {t('registerChoice.already')} <Link to="/login">{t('auth.loginCta')}</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterChoice
