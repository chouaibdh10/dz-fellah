import React from 'react'
import Footer from '../components/Footer'
import './About.css'

const About = () => {
  return (
    <>
      <div className="about-page">
        <div className="about-hero">
          <h1>À propos de DZ-Fellah</h1>
          <p>Connecter les producteurs agricoles algériens aux consommateurs</p>
        </div>

        <div className="about-container">
          <section className="about-section">
            <h2>🌾 Notre Mission</h2>
            <p>
              DZ-Fellah est une plateforme innovante qui vise à créer un lien direct entre 
              les producteurs agricoles algériens et les consommateurs. Notre objectif est de 
              valoriser le travail des agriculteurs locaux tout en offrant aux consommateurs 
              des produits frais et de qualité à des prix justes.
            </p>
          </section>

          <section className="about-section">
            <h2>🎯 Nos Objectifs</h2>
            <div className="objectives-grid">
              <div className="objective-card">
                <span className="objective-icon">🤝</span>
                <h3>Connexion Directe</h3>
                <p>Éliminer les intermédiaires pour un commerce plus équitable</p>
              </div>
              <div className="objective-card">
                <span className="objective-icon">🌱</span>
                <h3>Produits Frais</h3>
                <p>Garantir la fraîcheur et la qualité des produits agricoles</p>
              </div>
              <div className="objective-card">
                <span className="objective-icon">💰</span>
                <h3>Prix Justes</h3>
                <p>Des prix équitables pour les producteurs et les consommateurs</p>
              </div>
              <div className="objective-card">
                <span className="objective-icon">🇩🇿</span>
                <h3>Made in Algeria</h3>
                <p>Promouvoir et soutenir l'agriculture algérienne</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>👥 Pour qui ?</h2>
            <div className="audience-grid">
              <div className="audience-card producer">
                <h3>🌾 Producteurs</h3>
                <ul>
                  <li>Créez votre boutique en ligne gratuitement</li>
                  <li>Gérez vos produits et commandes facilement</li>
                  <li>Atteignez plus de clients dans toute l'Algérie</li>
                  <li>Recevez des paiements sécurisés</li>
                </ul>
              </div>
              <div className="audience-card client">
                <h3>🛒 Clients</h3>
                <ul>
                  <li>Achetez directement auprès des producteurs</li>
                  <li>Découvrez des produits locaux de qualité</li>
                  <li>Comparez les prix et les offres</li>
                  <li>Livraison partout en Algérie</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>🚀 Notre Vision</h2>
            <p>
              Nous croyons en un avenir où chaque producteur algérien peut vendre ses produits 
              directement aux consommateurs, sans barrières. DZ-Fellah aspire à devenir la 
              référence du commerce agricole en ligne en Algérie, en soutenant l'économie locale 
              et en promouvant une alimentation saine et durable.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
