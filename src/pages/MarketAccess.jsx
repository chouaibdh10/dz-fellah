import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ClientLayout from '../components/client/ClientLayout'
import './MarketAccess.css'

const MarketAccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [markets, setMarkets] = useState([])
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('all')

  const wilayas = [
    'Alger', 'Blida', 'Tipaza', 'Boumerdès', 'Médéa', 'Oran', 'Tlemcen',
    'Sétif', 'Constantine', 'Annaba', 'Biskra', 'Tizi Ouzou', 'Béjaïa'
  ]

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Mock markets data
    const mockMarkets = [
      {
        id: 1,
        name: 'Marché Agricole Blida',
        phone: '+213 541 98 76 54',
        location: 'Blida, Algérie',
        wilaya: 'Blida',
        description: 'Marché principal pour les produits agricoles de la région de Blida',
        producersCount: 45,
        productsCount: 120,
        hours: 'Lundi - Dimanche: 06:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1488459716781-6918f33427d7?w=400',
        specialties: ['Tomates', 'Oranges', 'Poivrons', 'Oignons']
      },
      {
        id: 2,
        name: 'Marché Apicole Kabylie',
        phone: '+213 534 55 66 77',
        location: 'Tizi Ouzou, Algérie',
        wilaya: 'Tizi Ouzou',
        description: 'Spécialisé dans les produits apicoles et miel',
        producersCount: 28,
        productsCount: 85,
        hours: 'Samedi - Jeudi: 08:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1537640521293-c7b1f1b20407?w=400',
        specialties: ['Miel', 'Propolis', 'Pollen', 'Pains d\'épices']
      },
      {
        id: 3,
        name: 'Marché Légumes Médéa',
        phone: '+213 541 77 88 99',
        location: 'Médéa, Algérie',
        wilaya: 'Médéa',
        description: 'Grand marché de légumes frais et produits biologiques',
        producersCount: 52,
        productsCount: 150,
        hours: 'Lundi - Samedi: 06:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1488895714781-ce4cc2b98009?w=400',
        specialties: ['Pommes de terre', 'Carottes', 'Courges', 'Oignons']
      },
      {
        id: 4,
        name: 'Marché Dattes Sahara',
        phone: '+213 545 11 22 33',
        location: 'Biskra, Algérie',
        wilaya: 'Biskra',
        description: 'Marché spécialisé dans les dattes et fruits secs',
        producersCount: 38,
        productsCount: 95,
        hours: 'Mardi - Dimanche: 07:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1585329967900-85d6455acb84?w=400',
        specialties: ['Dattes Deglet Nour', 'Dattes Mech Degla', 'Figues sèches', 'Amandes']
      },
      {
        id: 5,
        name: 'Marché Fruits Oran',
        phone: '+213 541 55 66 77',
        location: 'Oran, Algérie',
        wilaya: 'Oran',
        description: 'Marché principal pour les fruits frais',
        producersCount: 35,
        productsCount: 110,
        hours: 'Lundi - Samedi: 05:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1599599810694-6b6e5e3c5e4e?w=400',
        specialties: ['Pommes', 'Poires', 'Raisins', 'Grenades']
      },
      {
        id: 6,
        name: 'Marché Herbes Alger',
        phone: '+213 541 00 11 22',
        location: 'Alger, Algérie',
        wilaya: 'Alger',
        description: 'Marché des herbes aromatiques et épices',
        producersCount: 40,
        productsCount: 130,
        hours: 'Lundi - Dimanche: 07:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1599599810026-e9a5370d3a6a?w=400',
        specialties: ['Menthe', 'Persil', 'Coriandre', 'Thym']
      },
      {
        id: 7,
        name: 'Marché Agrumes Boumerdès',
        phone: '+213 541 22 33 44',
        location: 'Boumerdès, Algérie',
        wilaya: 'Boumerdès',
        description: 'Spécialisé dans les agrumes de qualité',
        producersCount: 30,
        productsCount: 75,
        hours: 'Lundi - Vendredi: 06:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1599599810694-6b6e5e3c5e4e?w=400',
        specialties: ['Citrons', 'Oranges', 'Mandarines', 'Limes']
      }
    ]

    setMarkets(mockMarkets)
    
    // Si un marché est passé en paramètre, l'afficher automatiquement
    const params = new URLSearchParams(location.search)
    const marketName = params.get('market')
    if (marketName) {
      const market = mockMarkets.find(m => m.name === marketName)
      if (market) {
        setSelectedMarket(market)
      }
    }
  }, [user, navigate, location.search])

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = 
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesWilaya = selectedWilaya === 'all' || market.wilaya === selectedWilaya
    
    return matchesSearch && matchesWilaya
  })

  return (
    <ClientLayout>
      <div className="market-access">
        <div className="container">
          {/* Page Header */}
          <div className="market-header">
            <h1>🏪 Accédez aux Marchés des Producteurs</h1>
            <p>Découvrez les marchés locaux et contactez les producteurs directement</p>
          </div>

          {/* Search & Filters */}
          <div className="market-filters">
            <div className="search-box-market">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Rechercher un marché, une spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-wilaya">
              <label>📍 Filtre par Wilaya</label>
              <select value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}>
                <option value="all">Toutes les wilayas</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya} value={wilaya}>{wilaya}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Markets Grid */}
          {filteredMarkets.length > 0 ? (
            <div className="markets-grid">
              {filteredMarkets.map(market => (
                <div key={market.id} className="market-card">
                  <div className="market-image">
                    <img src={market.image} alt={market.name} />
                    <div className="market-badge">
                      <span className="producers-badge">{market.producersCount} producteurs</span>
                      <span className="products-badge">{market.productsCount} produits</span>
                    </div>
                  </div>

                  <div className="market-info">
                    <h3>{market.name}</h3>
                    <p className="market-location">📍 {market.location}</p>
                    
                    <div className="market-stats">
                      <div className="stat">
                        <span className="stat-label">Producteurs</span>
                        <span className="stat-value">{market.producersCount}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Produits</span>
                        <span className="stat-value">{market.productsCount}</span>
                      </div>
                    </div>

                    <p className="market-description">{market.description}</p>

                    <div className="market-hours">
                      <strong>⏰ Horaires</strong>
                      <p>{market.hours}</p>
                    </div>

                    <div className="market-specialties">
                      <strong>🌾 Spécialités</strong>
                      <div className="specialty-tags">
                        {market.specialties.map((specialty, idx) => (
                          <span key={idx} className="specialty-tag">{specialty}</span>
                        ))}
                      </div>
                    </div>

                    <div className="market-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSelectedMarket(market)}
                      >
                        Plus d'infos
                      </button>
                      <a 
                        href={`tel:${market.phone}`}
                        className="btn btn-contact"
                      >
                        📞 {market.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>❌ Aucun marché trouvé pour votre recherche</p>
            </div>
          )}

          {/* Detail Modal */}
          {selectedMarket && (
            <div className="modal-overlay" onClick={() => setSelectedMarket(null)}>
              <div className="market-modal" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedMarket(null)}
                >
                  ✕
                </button>

                <div className="market-modal-image">
                  <img src={selectedMarket.image} alt={selectedMarket.name} />
                </div>

                <div className="market-modal-content">
                  <h2>{selectedMarket.name}</h2>
                  
                  <div className="market-modal-details">
                    <div className="detail-item">
                      <strong>📍 Localisation</strong>
                      <p>{selectedMarket.location}</p>
                    </div>

                    <div className="detail-item">
                      <strong>📞 Contact</strong>
                      <p>{selectedMarket.phone}</p>
                      <a href={`tel:${selectedMarket.phone}`} className="btn btn-call">
                        Appeler
                      </a>
                    </div>

                    <div className="detail-item">
                      <strong>⏰ Horaires</strong>
                      <p>{selectedMarket.hours}</p>
                    </div>

                    <div className="detail-item">
                      <strong>📊 Statistiques</strong>
                      <div className="market-modal-stats">
                        <div className="stat-box">
                          <span className="stat-number">{selectedMarket.producersCount}</span>
                          <span className="stat-name">Producteurs</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-number">{selectedMarket.productsCount}</span>
                          <span className="stat-name">Produits</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <strong>🌾 Spécialités du marché</strong>
                      <div className="specialty-tags">
                        {selectedMarket.specialties.map((specialty, idx) => (
                          <span key={idx} className="specialty-tag">{specialty}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-item">
                      <strong>📝 Description</strong>
                      <p>{selectedMarket.description}</p>
                    </div>
                  </div>

                  <div className="market-modal-actions">
                    <a 
                      href={`tel:${selectedMarket.phone}`}
                      className="btn btn-primary btn-large"
                    >
                      📞 Appeler le marché
                    </a>
                    <button 
                      className="btn btn-secondary btn-large"
                      onClick={() => navigate('/products')}
                    >
                      🛍️ Voir les produits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

export default MarketAccess
