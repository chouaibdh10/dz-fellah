import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../photos/DZ-fellah.png'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section">
          <img src={logo} alt="DZ-Fellah" className="footer-logo" />
          <p>Connectez-vous directement avec les producteurs locaux algériens.</p>
        </div>

        <div className="footer-section">
          <h4>Liens Utiles</h4>
          <ul>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>📞 +213 555 12 34 56</li>
            <li>📧 contact@dz-fellah.com</li>
            <li>📍 Alger, Algérie</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 DZ-Fellah. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
