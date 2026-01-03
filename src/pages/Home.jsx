import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import homeImage from '../photos/home-page.jpg'
import fieldImage from '../photos/field.jpg'
import logo from '../photos/DZ-fellah.png'
import '../styles/Home.css'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="home">
      {/* Hero Banner moderne */}
      <section className="hero-banner">
        <div className="hero-floating-elements">
          <span className="floating-icon">🌽</span>
          <span className="floating-icon">🥕</span>
          <span className="floating-icon">🍅</span>
          <span className="floating-icon">🌿</span>
        </div>
        
        <div className="hero-content">
          <span className="hero-badge">{t('home.heroBadge')}</span>
          <h1>{t('home.heroTitle')} <span className="highlight">DZ-Fellah</span></h1>
          <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
          <p className="hero-description">{t('home.heroDescription')}</p>
          <div className="hero-buttons">
            <Link to="/register-choice" className="hero-btn primary">
              <span>👤</span> {t('home.join')}
            </Link>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-frame">
            <img src={homeImage} alt="Agriculture Algérienne" className="hero-banner-image" />
            <div className="hero-image-shine"></div>
          </div>
          <div className="hero-image-decoration"></div>
          <div className="hero-image-decoration-2"></div>
          <div className="hero-image-dots"></div>
        </div>
      </section>



      <section className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img
              src={fieldImage}
              alt="Champs agricoles en Algérie"
              className="about-image"
              loading="lazy"
            />
            <div className="about-image-overlay"></div>
          </div>
          <div className="about-content">
            <span className="about-badge">{t('home.aboutBadge')}</span>
            <h2>{t('home.aboutTitle')}</h2>
            <p>{t('home.aboutText')}</p>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>{t('home.aboutFeature1')}</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>{t('home.aboutFeature2')}</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>{t('home.aboutFeature3')}</span>
              </div>
              <div className="about-feature">
                <span className="feature-check">✓</span>
                <span>{t('home.aboutFeature4')}</span>
              </div>
            </div>
            <Link to="/about" className="about-cta">
              {t('home.learnMore')} →
            </Link>
          </div>
        </div>
      </section>

     
    
      <section className="features container">
        <h2 className="section-title">{t('home.whyTitle')}</h2>
        <p className="section-subtitle">{t('home.whySubtitle')}</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>{t('home.feature1Title')}</h3>
            <p>{t('home.feature1Desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥬</div>
            <h3>{t('home.feature2Title')}</h3>
            <p>{t('home.feature2Desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💚</div>
            <h3>{t('home.feature3Title')}</h3>
            <p>{t('home.feature3Desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>{t('home.feature4Title')}</h3>
            <p>{t('home.feature4Desc')}</p>
          </div>
        </div>
      </section>
       

      <section className="product-categories">
        <h2 className="section-title">{t('home.categoriesTitle')}</h2>
        <p className="section-subtitle">{t('home.categoriesSubtitle')}</p>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">🍎</div>
            <h3>{t('home.cat1Title')}</h3>
            <p>{t('home.cat1Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🥕</div>
            <h3>{t('home.cat2Title')}</h3>
            <p>{t('home.cat2Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🌽</div>
            <h3>{t('home.cat3Title')}</h3>
            <p>{t('home.cat3Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🫒</div>
            <h3>{t('home.cat4Title')}</h3>
            <p>{t('home.cat4Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🥛</div>
            <h3>{t('home.cat5Title')}</h3>
            <p>{t('home.cat5Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🍯</div>
            <h3>{t('home.cat6Title')}</h3>
            <p>{t('home.cat6Desc')}</p>
            <Link to="/products" className="category-link">{t('home.discover')} →</Link>
          </div>
        </div>
      </section>
      <section className="value-propositions">
        <h2 className="section-title">{t('home.commitmentsTitle')}</h2>
        <p className="section-subtitle">
          {t('home.commitmentsSubtitle')}
        </p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🔒</div>
            <h3>{t('home.value1Title')}</h3>
            <p>{t('home.value1Desc')}</p>
          </div>
          <div className="value-card">
            <div className="value-icon">✅</div>
            <h3>{t('home.value2Title')}</h3>
            <p>{t('home.value2Desc')}</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🇩🇿</div>
            <h3>{t('home.value3Title')}</h3>
            <p>{t('home.value3Desc')}</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💰</div>
            <h3>{t('home.value4Title')}</h3>
            <p>{t('home.value4Desc')}</p>
          </div>
        </div>
      </section>

      <section className="home-contact">
        <div className="home-contact-container">
          <div className="home-contact-text">
            <h2>{t('home.contactTitle')}</h2>
            <p>{t('home.contactSubtitle')}</p>
            <ul>
              <li>
                <span>📞</span>
                <span>+213 555 12 34 56</span>
              </li>
              <li>
                <span>📧</span>
                <span>contact@dz-fellah.com</span>
              </li>
              <li>
                <span>📍</span>
                <span>Alger, Algérie</span>
              </li>
            </ul>
          </div>
          <form
            className="home-contact-form"
            onSubmit={(e) => {
              e.preventDefault()
              alert(t('home.contactThanks'))
            }}
          >
            <div className="form-row">
              <input type="text" placeholder={t('home.contactName')} required />
              <input type="email" placeholder={t('home.contactEmail')} required />
            </div>
            <input type="text" placeholder={t('home.contactSubject')} />
            <textarea
              rows="5"
              placeholder={t('home.contactMessage')}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">
              {t('home.contactSend')}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
