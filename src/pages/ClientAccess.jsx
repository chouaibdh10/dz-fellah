import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ClientAccess = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const autoLogin = async () => {
      // Si déjà connecté en tant que client, rediriger vers le dashboard
      if (user?.userType === 'client') {
        navigate('/client/dashboard')
        return
      }

      // Connexion automatique en tant que client
      try {
        await login('client@dzfellah.com', 'demo123', 'client')
        navigate('/client/dashboard')
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
      <p>Redirection vers votre espace client</p>
    </div>
  )
}

export default ClientAccess
