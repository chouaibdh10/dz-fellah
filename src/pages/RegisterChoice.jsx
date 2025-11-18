import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './RegisterChoice.css'

const RegisterChoice = () => {
  const navigate = useNavigate()

  return (
    <div className="register-choice-page">
      <div className="choice-container">
        <h1 className="choice-title">Rejoignez DZ-Fellah</h1>
        <p className="choice-subtitle">Choisissez votre type de compte</p>
        
        <div className="choice-cards">
          <button 
            className="choice-card client-card"
            onClick={() => navigate('/register?type=client')}
          >
            <div className="card-icon">🛒</div>
            <h3>Client</h3>
            <p>Achetez des produits frais locaux</p>
          </button>

          <button 
            className="choice-card producer-card"
            onClick={() => navigate('/register?type=producer')}
          >
            <div className="card-icon">🌾</div>
            <h3>Producteur</h3>
            <p>Vendez vos produits agricoles</p>
          </button>
        </div>

        <p className="auth-link">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterChoice
