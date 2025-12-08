import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import '../client/ClientSidebar.css'
import './ProducerSidebar.css'

const menuItems = [
	{ path: '/producer/dashboard', icon: '📊', label: 'Tableau de bord' },
	{ path: '/producer/shop', icon: '🏪', label: 'Ma boutique' },
	{ path: '/producer/orders', icon: '📦', label: 'Commandes' },
	{ path: '/producer/profile', icon: '⚙️', label: 'Profil' }
]

const ProducerSidebar = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	const handlePhotoClick = () => {
		navigate('/producer/profile')
	}

	return (
		<div className="producer-sidebar">
			<div className="sidebar-header">
				<button className="client-photo" onClick={handlePhotoClick} title="Voir mon profil">
					<div className="photo-circle">
						{user?.photo ? (
							<img src={user.photo} alt="Photo de profil" className="profile-img" />
						) : (
							<span className="photo-placeholder">
								{user?.name?.charAt(0).toUpperCase() || 'P'}
							</span>
						)}
					</div>
				</button>
				<h3 className="client-name">{user?.name || 'Producteur'}</h3>
				<p className="client-email">{user?.email || 'producteur@dz-fellah.com'}</p>
			</div>

			<nav className="sidebar-menu">
				{menuItems.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
					>
						<span className="menu-icon" aria-hidden="true">{item.icon}</span>
						<span className="menu-label">{item.label}</span>
					</Link>
				))}
			</nav>

		<div className="sidebar-footer">
			<button onClick={toggleTheme} className="theme-toggle-btn" title="Changer le thème">
				{theme === 'light' ? '🌙' : '☀️'}
			</button>
			<button onClick={handleLogout} className="logout-button">
				<span className="menu-icon" aria-hidden="true">🚪</span>
				<span>Déconnexion</span>
			</button>
		</div>
		</div>
	)
}

export default ProducerSidebar
