import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ClientLayout from '../components/client/ClientLayout'
import '../styles/MarketAccess.css'
import { shopsAPI } from '../utils/api'

const buildLocationLabel = (shop) => {
  const parts = []
  if (shop?.address) parts.push(shop.address)
  if (shop?.producer_city) parts.push(shop.producer_city)
  if (shop?.producer_wilaya_label) parts.push(shop.producer_wilaya_label)
  return parts.filter(Boolean).join(', ')
}

const MarketAccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [markets, setMarkets] = useState([])
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('all')

  const wilayas = Array.from(
    new Set(
      markets
        .map((s) => ({ code: s.producer_wilaya, label: s.producer_wilaya_label || s.producer_wilaya }))
        .filter((w) => w.code)
        .map((w) => JSON.stringify(w))
    )
  )
    .map((s) => JSON.parse(s))
    .sort((a, b) => String(a.label).localeCompare(String(b.label)))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const load = async () => {
      try {
        const shops = await shopsAPI.listAll()
        // Keep existing variable names to minimize UI churn
        setMarkets(shops || [])

        // Si une boutique est passée en paramètre, l'afficher automatiquement
        const params = new URLSearchParams(location.search)
        const marketName = params.get('market')
        if (marketName && shops?.length) {
          const found = shops.find((s) => s.name === marketName)
          if (found) setSelectedMarket(found)
        }
      } catch {
        setMarkets([])
      }
    }

    load()
    
  }, [user, navigate, location.search])

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = 
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (market.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (market.producer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesWilaya = selectedWilaya === 'all' || market.producer_wilaya === selectedWilaya
    
    return matchesSearch && matchesWilaya
  })

  return (
    <ClientLayout>
      <div className="market-access">
        <div className="container">
          {/* Page Header */}
          <div className="market-header">
            <h1>🏪 Boutiques des Producteurs</h1>
            <p>Découvrez les boutiques et contactez les producteurs directement</p>
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
                {wilayas.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.code}>{wilaya.label}</option>
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
                    {market.photo ? (
                      <img src={market.photo} alt={market.name} />
                    ) : (
                      <div className="market-image" style={{ display: 'grid', placeItems: 'center' }}>
                        <span style={{ fontWeight: 900 }}>🏪</span>
                      </div>
                    )}
                    <div className="market-badge">
                      <span className="products-badge">{market.products_count || 0} produits</span>
                    </div>
                  </div>

                  <div className="market-info">
                    <h3>{market.name}</h3>
                    <p className="market-location">📍 {buildLocationLabel(market) || '—'}</p>
                    
                    <div className="market-stats">
                      <div className="stat">
                        <span className="stat-label">Produits</span>
                        <span className="stat-value">{market.products_count || 0}</span>
                      </div>
                    </div>

                    <p className="market-description">{market.description}</p>

                    <div className="market-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSelectedMarket(market)}
                      >
                        Plus d'infos
                      </button>
                      <a 
                        href={market.phone ? `tel:${market.phone}` : undefined}
                        className="btn btn-contact"
                      >
                        📞 {market.phone || 'Non disponible'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>❌ Aucune boutique trouvée pour votre recherche</p>
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
                  {selectedMarket.photo ? (
                    <img src={selectedMarket.photo} alt={selectedMarket.name} />
                  ) : (
                    <div style={{ height: 220, display: 'grid', placeItems: 'center' }}>
                      <span style={{ fontWeight: 900 }}>🏪</span>
                    </div>
                  )}
                </div>

                <div className="market-modal-content">
                  <h2>{selectedMarket.name}</h2>
                  
                  <div className="market-modal-details">
                    <div className="detail-item">
                      <strong>📍 Localisation</strong>
                      <p>{buildLocationLabel(selectedMarket) || '—'}</p>
                    </div>

                    <div className="detail-item">
                      <strong>📞 Contact</strong>
                      <p>{selectedMarket.phone || 'Non disponible'}</p>
                      {selectedMarket.phone && (
                        <a href={`tel:${selectedMarket.phone}`} className="btn btn-call">
                          Appeler
                        </a>
                      )}
                    </div>

                    <div className="detail-item">
                      <strong>📊 Statistiques</strong>
                      <div className="market-modal-stats">
                        <div className="stat-box">
                          <span className="stat-number">{selectedMarket.products_count || 0}</span>
                          <span className="stat-name">Produits</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <strong>📝 Description</strong>
                      <p>{selectedMarket.description}</p>
                    </div>
                  </div>

                  <div className="market-modal-actions">
                    <a 
                      href={selectedMarket.phone ? `tel:${selectedMarket.phone}` : undefined}
                      className="btn btn-primary btn-large"
                    >
                      📞 Appeler la boutique
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
