import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './ProducerSidebar.css'

const menuItems = [
	{ path: '/producer/dashboard', icon: '📊', label: 'Dashboard' },
	{ path: '/producer/shop', icon: '🏪', label: 'Boutique' },
	{ path: '/producer/orders', icon: '📦', label: 'Commandes' },
	{ path: '/producer/profile', icon: '⚙️', label: 'Profil' }
]

const ProducerSidebar = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	const handlePhotoClick = () => {
		navigate('/producer/profile')
	}

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	return (
		<header className="producer-navbar">
			<div className="navbar-container">
				{/* Logo & Brand */}
				<Link to="/producer/dashboard" className="navbar-brand">
					<span className="brand-icon">🌾</span>
					<span className="brand-text">DZ-Fellah</span>
					<span className="brand-badge producer">Producteur</span>
				</Link>

				{/* Mobile Menu Toggle */}
				<button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
					{mobileMenuOpen ? '✕' : '☰'}
				</button>

				{/* Navigation Menu */}
				<nav className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="nav-icon">{item.icon}</span>
							<span className="nav-label">{item.label}</span>
						</Link>
					))}
				</nav>

				{/* Right Section - User & Actions */}
				<div className="navbar-actions">
					<button onClick={toggleTheme} className="theme-toggle-btn" title="Changer le thème">
						{theme === 'light' ? '🌙' : '☀️'}
					</button>

					<div className="user-dropdown">
						<button className="user-button" onClick={handlePhotoClick}>
							<div className="user-avatar">
								{user?.photo ? (
									<img src={user.photo} alt="Photo de profil" />
								) : (
									<span>{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
								)}
							</div>
							<span className="user-name">{user?.name || 'Producteur'}</span>
						</button>
					</div>

					<button onClick={handleLogout} className="logout-btn" title="Déconnexion">
						<span>🚪</span>
					</button>
				</div>
			</div>
		</header>
	)
}

export default ProducerSidebar
