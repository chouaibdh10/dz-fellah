import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import './Home.css'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>🌾 DZ-Fellah</h1>
          <p className="hero-subtitle">Connectez-vous directement avec les producteurs locaux</p>
          <p className="hero-description">
            Des produits frais, de saison, directement de la ferme à votre table
          </p>
          {user ? (
            <Link to="/products" className="btn btn-primary btn-large">
              Découvrir les produits
            </Link>
          ) : (
            <Link to="/register-choice" className="btn btn-primary btn-large">
              Commencer maintenant
            </Link>
          )}
        </div>
      </section>

      <section className="about-section container">
        <div className="about-content">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80"
              alt="Ferme verdoyante en Algérie"
              loading="lazy"
            />
          </div>
          <div className="about-text">
            <h2>À propos de DZ-Fellah</h2>
            <p>
              DZ-Fellah est la plateforme qui connecte les consommateurs algériens directement 
              aux agriculteurs locaux. Notre mission est de faciliter l'accès à des produits 
              frais, authentiques et de saison, tout en soutenant nos producteurs.
            </p>
            <ul className="about-highlights">
              <li>✅ Traçabilité complète et saisonnalité garanties</li>
              <li>✅ Mise en avant des pratiques agricoles durables</li>
              <li>✅ Plateforme sécurisée pour achats et ventes</li>
              <li>✅ Support direct aux agriculteurs algériens</li>
            </ul>
           
          </div>
        </div>
      </section>

      <section className="features container">
        <h2 className="section-title">Pourquoi choisir DZ-Fellah ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>Direct Producteur</h3>
            <p>Achetez directement auprès des agriculteurs locaux</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥬</div>
            <h3>Produits Frais</h3>
            <p>Des produits fraîchement récoltés et de saison</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💚</div>
            <h3>Circuit Court</h3>
            <p>Réduisez votre empreinte écologique</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Commerce Équitable</h3>
            <p>Soutenez l'économie locale et les producteurs</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
