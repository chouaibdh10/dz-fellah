import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/MarketAccess.css'

const AdminAccess = () => {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (!isAdmin) {
      navigate('/')
    } else {
      navigate('/admin/dashboard')
    }
  }, [user, isAdmin, navigate])

  return (
    <div className="market-access">
      <div className="access-loading">
        <div className="spinner"></div>
        <p>Vérification des accès administrateur...</p>
      </div>
    </div>
  )
}

export default AdminAccess
