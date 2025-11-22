import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const VerifyEmail = () => {
  const { user } = useAuth()
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState('')

  const handleResendEmail = async () => {
    setResending(true)
    setMessage('')
    
    try {
      // TODO: Appeler l'API pour renvoyer l'email de vérification
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Email de vérification renvoyé avec succès!')
    } catch (error) {
      setMessage('Erreur lors de l\'envoi de l\'email')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container verify-email-container">
        <div className="verify-icon">
          📧
        </div>
        
        <h1 className="auth-title">Vérifiez votre email</h1>
        
        <p className="verify-message">
          Un email de vérification a été envoyé à <strong>{user?.email || 'votre adresse email'}</strong>
        </p>
        
        <p className="verify-instructions">
          Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour activer votre compte.
        </p>

        <div className="verify-steps">
          <div className="verify-step">
            <span className="step-number">1</span>
            <span>Ouvrez votre boîte email</span>
          </div>
          <div className="verify-step">
            <span className="step-number">2</span>
            <span>Trouvez l'email de DZ-Fellah</span>
          </div>
          <div className="verify-step">
            <span className="step-number">3</span>
            <span>Cliquez sur le lien de vérification</span>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('succès') ? 'success-message' : 'error-message'}`}>
            {message}
          </div>
        )}

        <button 
          onClick={handleResendEmail}
          className="btn btn-secondary"
          disabled={resending}
        >
          {resending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
        </button>

        <div className="verify-help">
          <p>Vous n'avez pas reçu l'email ?</p>
          <ul>
            <li>Vérifiez votre dossier spam/courrier indésirable</li>
            <li>Assurez-vous que l'adresse email est correcte</li>
            <li>Attendez quelques minutes et réessayez</li>
          </ul>
        </div>

        <p className="auth-link">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
