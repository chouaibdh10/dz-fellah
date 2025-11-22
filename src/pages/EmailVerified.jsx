import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const EmailVerified = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { user } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Token de vérification manquant')
        setVerifying(false)
        return
      }

      try {
        // TODO: Appeler l'API pour vérifier l'email avec le token
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSuccess(true)
        
        // Rediriger après 3 secondes
        setTimeout(() => {
          if (user?.userType === 'producer') {
            navigate('/producer/dashboard')
          } else {
            navigate('/products')
          }
        }, 3000)
      } catch (err) {
        setError('Erreur lors de la vérification. Le lien a peut-être expiré.')
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token, navigate, user])

  if (verifying) {
    return (
      <div className="auth-page">
        <div className="auth-container verify-email-container">
          <div className="verify-icon loading">
            ⏳
          </div>
          <h1 className="auth-title">Vérification en cours...</h1>
          <p className="verify-message">Veuillez patienter pendant que nous vérifions votre email.</p>
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
          <h1 className="auth-title">Erreur de vérification</h1>
          <p className="verify-message error-text">{error}</p>
          <div className="verify-actions">
            <Link to="/verify-email" className="btn btn-primary">
              Renvoyer l'email
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Retour à la connexion
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
        
        <h1 className="auth-title">Email vérifié avec succès !</h1>
        
        <p className="verify-message">
          Votre compte a été activé. Vous pouvez maintenant profiter de toutes les fonctionnalités de DZ-Fellah.
        </p>

        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <p className="redirect-message">
          Redirection automatique dans quelques secondes...
        </p>

        <div className="verify-actions">
          <Link 
            to={user?.userType === 'producer' ? '/producer/dashboard' : '/products'} 
            className="btn btn-primary"
          >
            Continuer
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailVerified
