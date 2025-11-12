import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const [seasonalProducts, setSeasonalProducts] = useState([])

  useEffect(() => {
    // TODO: Remplacer par un véritable appel API
    const mockSeasonalProducts = [
      {
        id: 1,
        name: 'Tomates',
        image: 'https://via.placeholder.com/300x200?text=Tomates',
        price: 250,
        unit: 'kg',
        producer: 'Ferme Ben Ahmed',
        inSeason: true
      },
      {
        id: 2,
        name: 'Oranges',
        image: 'https://via.placeholder.com/300x200?text=Oranges',
        price: 180,
        unit: 'kg',
        producer: 'Verger El Hamri',
        inSeason: true
      },
      {
        id: 3,
        name: 'Miel Local',
        image: 'https://via.placeholder.com/300x200?text=Miel',
        price: 1200,
        unit: 'pot',
        producer: 'Rucher Bensalem',
        inSeason: true
      }
    ]
    setSeasonalProducts(mockSeasonalProducts)
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>🌾 DZ-Fellah</h1>
          <p className="hero-subtitle">Connectez-vous directement avec les producteurs locaux</p>
          <p className="hero-description">
            Des produits frais, de saison, directement de la ferme à votre table
          </p>
          <Link to="/products" className="btn btn-primary btn-large">
            Découvrir les produits
          </Link>
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
            <div className="about-contact">
              <p>📞 +213 555 12 34 56</p>
              <p>📧 contact@dz-fellah.com</p>
              <p>📍 Alger, Algérie</p>
            </div>
          </div>
        </div>
      </section>

      <section className="seasonal-section container">
        <h2 className="section-title">🍊 Produits de Saison</h2>
        <p className="section-subtitle">Découvrez les produits frais du moment</p>
        
        <div className="products-grid">
          {seasonalProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.inSeason && (
                  <span className="badge badge-season">De saison</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="producer-name">{product.producer}</p>
                <div className="product-price">
                  {product.price} DA / {product.unit}
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-primary btn-small">
                  Voir le produit
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all">
          <Link to="/products" className="btn btn-secondary">
            Voir tous les produits
          </Link>
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
    </div>
  )
}

export default Home
