import React from 'react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, getTotalPrice, getItemCount } = useCart()

  return (
    <div className="container">
      <h1 className="page-title">Mon Panier</h1>
      <p>Articles: {getItemCount()}</p>
      <p>Total: {getTotalPrice()} DA</p>
      <p>Cette page sera complétée prochainement</p>
    </div>
  )
}

export default Cart
