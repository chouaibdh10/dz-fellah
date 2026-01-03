import React, { useState } from 'react'
import Footer from '../components/Footer'
import '../styles/Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulation d'envoi
    console.log('Message envoyé:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <div className="contact-page">
        <div className="contact-hero">
          <h1>Contactez-nous</h1>
          <p>Une question ? Une suggestion ? Nous sommes là pour vous aider</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <h2>Informations de contact</h2>
            
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <h3>Adresse</h3>
                <p>Alger, Algérie</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📧</span>
              <div>
                <h3>Email</h3>
                <p>contact@dz-fellah.com</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📱</span>
              <div>
                <h3>Téléphone</h3>
                <p>+213 XX XX XX XX</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div>
                <h3>Horaires</h3>
                <p>Dimanche - Jeudi : 8h - 17h</p>
              </div>
            </div>

            <div className="social-links">
              <h3>Suivez-nous</h3>
              <div className="social-icons">
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">📸</a>
                <a href="#" className="social-icon">🐦</a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            {submitted ? (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <h3>Message envoyé !</h3>
                <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                <button onClick={() => setSubmitted(false)} className="new-message-btn">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom complet</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Sujet</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="producer">Je suis producteur</option>
                    <option value="client">Je suis client</option>
                    <option value="technical">Problème technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Écrivez votre message ici..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
