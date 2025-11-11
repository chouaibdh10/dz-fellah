import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()

  return (
    <div className="container">
      <h1 className="page-title">Détail du Produit #{id}</h1>
      <p>Cette page sera complétée prochainement</p>
    </div>
  )
}

export default ProductDetail
