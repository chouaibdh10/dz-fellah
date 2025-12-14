import React, { useState, useEffect, useMemo } from 'react'
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

  const [testimonialPage, setTestimonialPage] = useState(0)

  const testimonials = useMemo(
    () => [
      {
        initial: 'A',
        name: 'Amine, Client',
        city: 'Alger',
        text:
          'Je trouve enfin des produits frais directement auprès des producteurs, sans passer par plusieurs intermédiaires. La plateforme est simple et fiable.'
      },
      {
        initial: 'F',
        name: 'Fatima, Productrice',
        city: 'Blida',
        text:
          "DZ-Fellah m'a permis de vendre ma production directement aux clients et d'élargir ma clientèle partout en Algérie."
      },
      {
        initial: 'S',
        name: 'Salim, Restaurateur',
        city: 'Oran',
        text:
          'Pour mon restaurant, je peux commander des produits frais en quelques clics, directement chez les fellahs. Un vrai gain de temps.'
      },
      {
        initial: 'L',
        name: 'Leïla, Mère de famille',
        city: 'Constantine',
        text:
          'Je peux acheter des fruits et légumes de saison pour ma famille en toute confiance, tout en soutenant les producteurs de chez nous.'
      },
      {
        initial: 'H',
        name: 'Hicham, Producteur',
        city: 'Tizi Ouzou',
        text:
          'Avant, je dépendais uniquement du marché local. Avec DZ-Fellah, je vends maintenant dans plusieurs wilayas sans me déplacer.'
      },
      {
        initial: 'N',
        name: 'Nadia, Nutritionniste',
        city: 'Annaba',
        text:
          "Je recommande DZ-Fellah à mes patients pour accéder à des produits frais et locaux, meilleurs pour la santé et pour l'environnement."
      }
    ],
    []
  )

  const visibleTestimonials = useMemo(() => {
    const start = testimonialPage * 3
    return testimonials.slice(start, start + 3)
  }, [testimonialPage, testimonials])

  const hasNextPage = (testimonialPage + 1) * 3 < testimonials.length
  const hasPrevPage = testimonialPage > 0

  return (
    <div className="home">
      {/* Hero Banner moderne */}
      <section className="hero-banner">
        <div className="hero-floating-elements">
          <span className="floating-icon">🌾</span>
          <span className="floating-icon">🥕</span>
          <span className="floating-icon">🍅</span>
          <span className="floating-icon">🌿</span>
        </div>
        
        <div className="hero-content">
          <span className="hero-badge">🇩🇿 100% Algérien</span>
          <h1>Bienvenue sur <span className="highlight">DZ-Fellah</span></h1>
          <p className="hero-subtitle">Du producteur à votre table</p>
          <p className="hero-description">
            La première plateforme algérienne qui connecte directement 
            les agriculteurs locaux aux consommateurs. Produits frais, 
            prix justes, livraison rapide.
          </p>
          <div className="hero-stats-mini">
            <div className="mini-stat">
              <strong>500+</strong>
              <span>Utilisateurs</span>
            </div>
            <div className="mini-stat">
              <strong>120+</strong>
              <span>Producteurs</span>
            </div>
            <div className="mini-stat">
              <strong>58</strong>
              <span>Wilayas</span>
            </div>
          </div>
          <div className="hero-buttons">
            <Link to="/register-choice" className="hero-btn primary">
              <span>👤</span> Rejoindre la communauté
            </Link>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-badge">🌟 Qualité garantie</div>
          <div className="hero-image-frame">
            <img src={homeImage} alt="Agriculture Algérienne" className="hero-banner-image" />
            <div className="hero-image-shine"></div>
          </div>
          <div className="hero-image-decoration"></div>
          <div className="hero-image-decoration-2"></div>
          <div className="hero-image-dots"></div>
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
        <p className="section-subtitle">Une plateforme conçue pour faciliter l'échange entre producteurs et consommateurs</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>Direct Producteur</h3>
            <p>Achetez directement auprès des agriculteurs locaux sans intermédiaires</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥬</div>
            <h3>Produits Frais</h3>
            <p>Des produits fraîchement récoltés, de saison et de qualité</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💚</div>
            <h3>Circuit Court</h3>
            <p>Réduisez votre empreinte écologique et soutenez le local</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Commerce Équitable</h3>
            <p>Des prix justes pour les producteurs et les consommateurs</p>
          </div>
        </div>
      </section>
       

      <section className="testimonials">
        <h2 className="section-title">Avis de nos utilisateurs</h2>
        <p className="section-subtitle">
          Ils utilisent DZ-Fellah au quotidien pour acheter et vendre des produits agricoles.
        </p>
        <div className="testimonials-grid">
          {visibleTestimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-header">
                <div className="testimonial-avatar">{t.initial}</div>
                <div>
                  <h3>{t.name}</h3>
                  <span>{t.city}</span>
                </div>
              </div>
              <div className="testimonial-rating">
                {'★★★★★'}
              </div>
              <p className="testimonial-text">{`"${t.text}"`}</p>
            </div>
          ))}
        </div>
        <div className="testimonials-controls">
          <button
            type="button"
            className="testimonials-arrow"
            disabled={!hasPrevPage}
            onClick={() => setTestimonialPage((p) => p - 1)}
            aria-label="Avis précédents"
          >
            ‹
          </button>
          <div className="testimonials-dots">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`testimonials-dot ${testimonialPage === i ? 'active' : ''}`}
                onClick={() => setTestimonialPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="testimonials-arrow"
            disabled={!hasNextPage}
            onClick={() => setTestimonialPage((p) => p + 1)}
            aria-label="Avis suivants"
          >
            ›
          </button>
        </div>
      </section>
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <span className="stat-number">500+</span>
            <span className="stat-label">Utilisateurs actifs</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🌾</div>
            <span className="stat-number">120+</span>
            <span className="stat-label">Producteurs partenaires</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📦</div>
            <span className="stat-number">1000+</span>
            <span className="stat-label">Produits disponibles</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📍</div>
            <span className="stat-number">58</span>
            <span className="stat-label">Wilayas couvertes</span>
          </div>
        </div>
      </section>

      <section className="home-contact">
        <div className="home-contact-container">
          <div className="home-contact-text">
            <h2>Contactez-nous</h2>
            <p>
              Une question, une suggestion ou un partenariat ?
              Notre équipe est à votre écoute pour vous accompagner.
            </p>
            <ul>
              <li>
                <span>📞</span>
                <span>+213 555 12 34 56</span>
              </li>
              <li>
                <span>📧</span>
                <span>contact@dz-fellah.com</span>
              </li>
              <li>
                <span>📍</span>
                <span>Alger, Algérie</span>
              </li>
            </ul>
          </div>
          <form
            className="home-contact-form"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Merci pour votre message !')
            }}
          >
            <div className="form-row">
              <input type="text" placeholder="Votre nom" required />
              <input type="email" placeholder="Votre email" required />
            </div>
            <input type="text" placeholder="Sujet" />
            <textarea
              rows="5"
              placeholder="Votre message..."
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
