import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import logo from '../photos/DZ-fellah.png'
import '../styles/PasswordReset.css'

const CheckEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'votre email'

  const handleContinue = () => {
    // Navigate to reset password page (simulating the user clicked the link in email)
    navigate('/reset-password', { state: { email } })
  }

  return (
    <div className="password-reset-page">
      <div className="password-reset-container check-email-container">
        <img src={logo} alt="DZ-Fellah" className="auth-logo" />
        
        <div className="success-icon">
          <div className="checkmark-circle">
            <span>✉️</span>
          </div>
        </div>

        <div className="reset-header">
          <h1 className="reset-title">Vérifiez votre email</h1>
          <p className="reset-subtitle">
            Nous avons envoyé un lien de réinitialisation à
          </p>
          <p className="email-display">{email}</p>
        </div>

        <div className="info-box">
          <p><strong>📧 Vérifiez votre boîte de réception</strong></p>
          <p>Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe.</p>
        </div>

        <div className="email-tips">
          <p className="tips-title">Vous ne voyez pas l'email ?</p>
          <ul>
            <li>Vérifiez votre dossier spam ou courrier indésirable</li>
            <li>Assurez-vous d'avoir entré la bonne adresse email</li>
            <li>Attendez quelques minutes, l'email peut prendre du temps à arriver</li>
          </ul>
        </div>

        
        <div className="reset-footer">
          <Link to="/forgot-password" className="resend-link">
            <span>🔄</span> Renvoyer l'email
          </Link>
          <Link to="/login" className="login-link">
            <span>←</span> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckEmail
