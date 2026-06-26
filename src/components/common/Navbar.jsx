import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../photos/DZ-fellah.png'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isProducer, isClient, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const navigate = useNavigate()
  const cartCount = getItemCount()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="DZ-Fellah" className="navbar-logo-img" />
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><Link to="/about" onClick={closeMenu}>À propos</Link></li>

          {user ? (
            <>
              {isProducer && (
                <li><Link to="/producer/dashboard" onClick={closeMenu}>Espace Producteur</Link></li>
              )}
              {isClient && (
                <li><Link to="/client/profile" onClick={closeMenu}>Espace Client</Link></li>
              )}
              {isAdmin && (
                <li><Link to="/admin/dashboard" onClick={closeMenu}>Admin</Link></li>
              )}
              <li>
                <Link to="/products" onClick={closeMenu} className="cart-link">
                  🛒 Produits
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={closeMenu} className="cart-link">
                  🛒 Panier
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  aria-label="Toggle theme"
                  title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </li>
              <li className="user-menu-item">
                <Link
                  to={isProducer ? '/producer/profile' : isAdmin ? '/admin/dashboard' : '/client/profile'}
                  className="user-photo-btn"
                  onClick={closeMenu}
                  aria-label="Profil"
                  title="Profil"
                >
                  {user?.photo ? (
                    <img src={user.photo} alt="" className="navbar-user-photo" />
                  ) : (
                    <span className="navbar-user-placeholder">👤</span>
                  )}
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Connexion</Link></li>
              <li><Link to="/register-choice" onClick={closeMenu}>Inscription</Link></li>
              <li>
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  aria-label="Toggle theme"
                  title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
