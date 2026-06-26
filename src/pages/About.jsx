import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../photos/DZ-fellah.png'
import fieldImage from '../photos/field.jpg'
import './About.css'

const About = () => {
  return (
    <>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-bg"></div>
          <div className="about-hero-content">
            <img src={logo} alt="DZ-Fellah" className="about-hero-logo" />
            <h1>À propos de DZ-Fellah</h1>
            <p>La plateforme qui révolutionne l'agriculture algérienne en connectant directement producteurs et consommateurs</p>
            <div className="about-hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Utilisateurs</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">120+</span>
                <span className="hero-stat-label">Producteurs</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">58</span>
                <span className="hero-stat-label">Wilayas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="about-mission-container">
            <div className="about-mission-image">
              <img src={fieldImage} alt="Agriculture algérienne" />
              <div className="mission-image-overlay"></div>
              <div className="mission-badge">
                <span>🌾</span>
                <span>Depuis 2024</span>
              </div>
            </div>
            <div className="about-mission-content">
              <span className="section-badge">Notre Mission</span>
              <h2>Valoriser l'agriculture algérienne</h2>
              <p>
                DZ-Fellah est née d'une vision simple mais ambitieuse : créer un pont entre 
                les producteurs agricoles algériens et les consommateurs. Nous croyons que 
                chaque agriculteur mérite un accès direct au marché, sans les contraintes 
                des intermédiaires traditionnels.
              </p>
              <p>
                Notre plateforme offre aux producteurs les outils nécessaires pour vendre 
                leurs produits directement, tout en garantissant aux consommateurs la 
                fraîcheur et la qualité qu'ils recherchent.
              </p>
              <div className="mission-highlights">
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>Traçabilité garantie</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>Circuit court</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>Prix équitables</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="about-values-container">
            <span className="section-badge center">Nos Valeurs</span>
            <h2 className="section-title-about">Ce qui nous guide au quotidien</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Confiance</h3>
                <p>Nous construisons des relations durables basées sur la transparence et l'honnêteté</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Durabilité</h3>
                <p>Nous encourageons les pratiques agricoles respectueuses de l'environnement</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💪</div>
                <h3>Équité</h3>
                <p>Des prix justes qui valorisent le travail des producteurs</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Innovation</h3>
                <p>Nous utilisons la technologie pour simplifier le commerce agricole</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="about-how">
          <div className="about-how-container">
            <span className="section-badge center">Comment ça marche</span>
            <h2 className="section-title-about">Simple, rapide et efficace</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Inscription</h3>
                  <p>Créez votre compte en tant que producteur ou client en quelques minutes</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Découverte</h3>
                  <p>Parcourez les produits frais disponibles ou créez votre boutique</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Transaction</h3>
                  <p>Achetez ou vendez directement, sans intermédiaires</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Livraison</h3>
                  <p>Recevez vos produits frais directement chez vous</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="about-audience">
          <div className="about-audience-container">
            <span className="section-badge center">Pour qui ?</span>
            <h2 className="section-title-about">Une plateforme pour tous</h2>
            <div className="audience-grid">
              <div className="audience-card producer">
                <div className="audience-header">
                  <div className="audience-icon">🌾</div>
                  <h3>Producteurs</h3>
                </div>
                <p className="audience-desc">Vendez vos produits directement aux consommateurs</p>
                <ul className="audience-features">
                  <li>
                    <span className="check">✓</span>
                    <span>Créez votre boutique en ligne gratuitement</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Gérez vos produits et commandes facilement</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Atteignez des clients dans toute l'Algérie</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Tableau de bord avec statistiques</span>
                  </li>
                </ul>
                <Link to="/register" className="audience-cta producer-cta">
                  Devenir producteur →
                </Link>
              </div>
              <div className="audience-card client">
                <div className="audience-header">
                  <div className="audience-icon">🛒</div>
                  <h3>Clients</h3>
                </div>
                <p className="audience-desc">Achetez des produits frais directement à la source</p>
                <ul className="audience-features">
                  <li>
                    <span className="check">✓</span>
                    <span>Accédez à des produits locaux de qualité</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Comparez les prix et les offres</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Livraison partout en Algérie</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>Paiement sécurisé</span>
                  </li>
                </ul>
                <Link to="/register" className="audience-cta client-cta">
                  S'inscrire gratuitement →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision CTA */}
        <section className="about-cta-section">
          <div className="about-cta-container">
            <div className="cta-content">
              <h2>Rejoignez la communauté DZ-Fellah</h2>
              <p>
                Que vous soyez producteur souhaitant élargir votre clientèle ou consommateur 
                à la recherche de produits frais et locaux, DZ-Fellah est fait pour vous.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="cta-btn primary">
                  Créer un compte
                </Link>
                <Link to="/" className="cta-btn secondary">
                  Découvrir les produits
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
