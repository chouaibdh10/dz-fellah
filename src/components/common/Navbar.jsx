import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../photos/DZ-fellah.png'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
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
          <>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register-choice">Inscription</Link></li>
          </>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
