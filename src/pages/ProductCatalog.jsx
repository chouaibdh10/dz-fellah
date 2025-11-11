import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ProductCatalog.css'

const ProductCatalog = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Remplacer par un véritable appel API
    const mockProducts = [
      {
        id: 1,
        name: 'Tomates',
        image: 'https://via.placeholder.com/300x200?text=Tomates',
        price: 250,
        saleType: 'weight',
        pricePerKg: 250,
        producer: 'Ferme Ben Ahmed',
        inSeason: true,
        type: 'frais'
      },
      {
        id: 2,
        name: 'Oranges',
        image: 'https://via.placeholder.com/300x200?text=Oranges',
        price: 180,
        saleType: 'weight',
        pricePerKg: 180,
        producer: 'Verger El Hamri',
        inSeason: true,
        type: 'frais'
      },
      {
        id: 3,
        name: 'Miel Local',
        image: 'https://via.placeholder.com/300x200?text=Miel',
        price: 1200,
        saleType: 'unit',
        producer: 'Rucher Bensalem',
        inSeason: false,
        type: 'sec'
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.producer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="container"><p>Chargement des produits...</p></div>
  }

  return (
    <div className="product-catalog">
      <div className="container">
        <h1 className="page-title">Catalogue des Produits</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un produit ou un producteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.inSeason && (
                  <span className="badge badge-season">De saison</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="producer-name">📍 {product.producer}</p>
                <div className="product-price">
                  {product.saleType === 'weight' 
                    ? `${product.pricePerKg} DA / kg`
                    : `${product.price} DA / unité`
                  }
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-primary btn-small">
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Aucun produit trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog
