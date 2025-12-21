import React from 'react'
import { Link } from 'react-router-dom'
import './DemoPage.css'

const DemoPage = () => {
  const demoAccounts = [
    {
      role: 'Admin',
      icon: '👑',
      email: 'admin@dzfellah.dz',
      password: 'demo123',
      access: '/administrateur',
      color: '#667eea',
      features: [
        'Gestion complète des utilisateurs',
        'Gestion des produits et stock',
        'Suivi des commandes',
        'Analytiques et statistiques',
        'Configuration de la plateforme'
      ]
    },
    {
      role: 'Producteur',
      icon: '🌾',
      email: 'producteur@ferme.dz',
      password: 'demo123',
      access: '/producteur',
      color: '#84fab0',
      features: [
        'Gérer ma boutique',
        'Ajouter/modifier des produits',
        'Suivre mes commandes',
        'Voir mes statistiques',
        'Gérer mon profil'
      ]
    },
    {
      role: 'Client',
      icon: '👤',
      email: 'client@test.dz',
      password: 'demo123',
      access: '/client',
      color: '#a8edea',
      features: [
        'Parcourir les produits',
        'Passer des commandes',
        'Suivre mes commandes',
        'Gérer mon panier',
        'Mon profil'
      ]
    }
  ]

  return (
    <div className="demo-page">
      <div className="demo-container">
        <div className="demo-header">
          <h1>🎯 Comptes de Démonstration</h1>
          <p>Testez les différents rôles de la plateforme DZ Fellah</p>
        </div>

        <div className="demo-cards">
          {demoAccounts.map((account, index) => (
            <div key={index} className="demo-card" style={{ borderTopColor: account.color }}>
              <div className="demo-card-header">
                <span className="demo-icon" style={{ background: account.color }}>
                  {account.icon}
                </span>
                <h2>{account.role}</h2>
              </div>

              <div className="demo-credentials">
                <div className="credential-item">
                  <label>📧 Email :</label>
                  <code>{account.email}</code>
                </div>
                <div className="credential-item">
                  <label>🔑 Mot de passe :</label>
                  <code>{account.password}</code>
                </div>
              </div>

              <div className="demo-features">
                <h3>Fonctionnalités :</h3>
                <ul>
                  {account.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="demo-actions">
                <Link 
                  to="/login" 
                  className="btn-login"
                  style={{ background: account.color }}
                >
                  Se connecter
                </Link>
                <Link 
                  to={account.access} 
                  className="btn-access"
                >
                  Accès Direct
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="demo-info">
          <h3>ℹ️ Informations</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🚀 Comment tester ?</h4>
              <p>
                1. Cliquez sur "Se connecter"<br />
                2. Utilisez les identifiants ci-dessus<br />
                3. Explorez les fonctionnalités
              </p>
            </div>
            <div className="info-item">
              <h4>🔐 Détection automatique</h4>
              <p>
                Le système détecte automatiquement votre rôle basé sur votre email :
                <br />• "admin" → Administrateur
                <br />• "producteur/producer/ferme" → Producteur
                <br />• Autre → Client
              </p>
            </div>
            <div className="info-item">
              <h4>💡 Accès direct</h4>
              <p>
                Utilisez le bouton "Accès Direct" pour accéder directement à l'interface
                correspondante (connexion requise).
              </p>
            </div>
          </div>
        </div>

        <div className="demo-footer">
          <Link to="/" className="btn-home">
            🏠 Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DemoPage
