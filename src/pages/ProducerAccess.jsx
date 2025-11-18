import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProducerAccess = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const autoLogin = async () => {
      // Si déjà connecté en tant que producteur, rediriger vers le dashboard
      if (user?.userType === 'producer') {
        navigate('/producer/dashboard')
        return
      }

      // Connexion automatique en tant que producteur
      try {
        await login('producteur@dzfellah.com', 'demo123')
        navigate('/producer/dashboard')
      } catch (error) {
        console.error('Erreur de connexion:', error)
        navigate('/login')
      }
    }

    autoLogin()
  }, [])

  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Connexion en cours...</h2>
      <p>Redirection vers le tableau de bord producteur</p>
    </div>
  )
}

export default ProducerAccess
