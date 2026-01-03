import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Footer from '../components/Footer'
import logo from '../photos/DZ-fellah.png'
import fieldImage from '../photos/field.jpg'
import '../styles/About.css'

const About = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-bg"></div>
          <div className="about-hero-content">
            <img src={logo} alt="DZ-Fellah" className="about-hero-logo" />
            <h1>{t('about.title')}</h1>
            <p>{t('about.subtitle')}</p>
            <div className="about-hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">{t('about.statUsers')}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">120+</span>
                <span className="hero-stat-label">{t('about.statProducers')}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">58</span>
                <span className="hero-stat-label">{t('about.statWilayas')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="about-mission-container">
            <div className="about-mission-image">
              <img src={fieldImage} alt="Agriculture algérienne" />
              <div className="mission-image-overlay"></div>
              <div className="mission-badge">
                <span>🌾</span>
                <span>{t('about.since')}</span>
              </div>
            </div>
            <div className="about-mission-content">
              <span className="section-badge">{t('about.missionBadge')}</span>
              <h2>{t('about.missionTitle')}</h2>
              <p>{t('about.missionP1')}</p>
              <p>{t('about.missionP2')}</p>
              <div className="mission-highlights">
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>{t('about.missionH1')}</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>{t('about.missionH2')}</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">✓</span>
                  <span>{t('about.missionH3')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="about-values-container">
            <span className="section-badge center">{t('about.valuesBadge')}</span>
            <h2 className="section-title-about">{t('about.valuesTitle')}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>{t('about.value1Title')}</h3>
                <p>{t('about.value1Desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>{t('about.value2Title')}</h3>
                <p>{t('about.value2Desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💪</div>
                <h3>{t('about.value3Title')}</h3>
                <p>{t('about.value3Desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>{t('about.value4Title')}</h3>
                <p>{t('about.value4Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="about-how">
          <div className="about-how-container">
            <span className="section-badge center">{t('about.howBadge')}</span>
            <h2 className="section-title-about">{t('about.howTitle')}</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Inscription</h3>
                  <p>{t('about.step1')}</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Découverte</h3>
                  <p>{t('about.step2')}</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Transaction</h3>
                  <p>{t('about.step3')}</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Livraison</h3>
                  <p>{t('about.step4')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="about-audience">
          <div className="about-audience-container">
            <span className="section-badge center">{t('about.forWhoBadge')}</span>
            <h2 className="section-title-about">{t('about.forWhoTitle')}</h2>
            <div className="audience-grid">
              <div className="audience-card producer">
                <div className="audience-header">
                  <div className="audience-icon">🌾</div>
                  <h3>{t('about.producersTitle')}</h3>
                </div>
                <p className="audience-desc">{t('about.producersDesc')}</p>
                <ul className="audience-features">
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.producerF1')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.producerF2')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.producerF3')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.producerF4')}</span>
                  </li>
                </ul>
                <Link to="/register" className="audience-cta producer-cta">
                  {t('about.becomeProducer')} →
                </Link>
              </div>
              <div className="audience-card client">
                <div className="audience-header">
                  <div className="audience-icon">🛒</div>
                  <h3>{t('about.clientsTitle')}</h3>
                </div>
                <p className="audience-desc">{t('about.clientsDesc')}</p>
                <ul className="audience-features">
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.clientF1')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.clientF2')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.clientF3')}</span>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <span>{t('about.clientF4')}</span>
                  </li>
                </ul>
                <Link to="/register" className="audience-cta client-cta">
                  {t('about.signupFree')} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision CTA */}
        <section className="about-cta-section">
          <div className="about-cta-container">
            <div className="cta-content">
              <h2>{t('about.ctaTitle')}</h2>
              <p>{t('about.ctaText')}</p>
              <div className="cta-buttons">
                <Link to="/register" className="cta-btn primary">
                  {t('about.createAccount')}
                </Link>
                <Link to="/" className="cta-btn secondary">
                  {t('about.discoverProducts')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default About
