import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌾 DZ-Fellah
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
          <>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register-choice">Inscription</Link></li>
          </>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
