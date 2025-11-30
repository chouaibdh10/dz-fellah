import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import homeImage from '../photos/home-page.jpg'
import fieldImage from '../photos/field.jpg'
import logo from '../photos/DZ-fellah.png'
import './Home.css'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* Hero Banner avec image */}
      <section className="hero-banner">
        <img src={homeImage} alt="DZ-Fellah - Agriculture Algérienne" className="hero-banner-image" />
        <div className="hero-banner-overlay">
          <img src={logo} alt="DZ-Fellah" className="hero-logo" />
          <p>Du producteur à votre table</p>
        </div>
      </section>



      <section className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img
              src={fieldImage}
              alt="Champs agricoles en Algérie"
              className="about-image"
              loading="lazy"
            />
            <div className="about-image-overlay"></div>
          </div>
          <div className="about-content">
            <span className="about-badge">🌾 Notre Histoire</span>
            <h2>C'est quoi DZ-Fellah ?</h2>
            <p>
              DZ-Fellah est la plateforme qui connecte les consommateurs algériens directement 
              aux agriculteurs locaux. Notre mission est de faciliter l'accès à des produits 
              frais, authentiques et de saison, tout en soutenant nos producteurs.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>Traçabilité complète et saisonnalité garanties</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>Mise en avant des pratiques agricoles durables</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>Plateforme sécurisée pour achats et ventes</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>Support direct aux agriculteurs algériens</span>
              </div>
            </div>
            <Link to="/about" className="about-cta">
              En savoir plus →
            </Link>
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
