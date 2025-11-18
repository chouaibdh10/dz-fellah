import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isProducer, isClient } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌾 DZ-Fellah
        </Link>
        
        <ul className="navbar-menu">
          {user && (
            <>
              <li>
                <Link to="/products">
                  Produits
                </Link>
              </li>
              
              <li>
                <Link to="/cart" className="cart-link">
                  🛒 Panier ({getItemCount()})
                </Link>
              </li>
            </>
          )}
          
          {!user && (
            <>
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/register-choice">Inscription</Link></li>
            </>
          )}
          
          {isProducer && (
            <>
              <li><Link to="/producer/dashboard">Tableau de bord</Link></li>
              <li><Link to="/producer/orders">Mes commandes</Link></li>
              <li><Link to="/producer/shop">Ma boutique</Link></li>
              <li><Link to="/producer/products">Mes produits</Link></li>
            </>
          )}
          
          {isClient && (
            <>
              <li><Link to="/client/profile">Mon profil</Link></li>
              <li><Link to="/client/orders">Mes commandes</Link></li>
            </>
          )}
          
          {user && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
