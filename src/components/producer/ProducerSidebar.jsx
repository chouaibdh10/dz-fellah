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
	const [showNotifications, setShowNotifications] = useState(false)
	const [notifications, setNotifications] = useState([
		{ id: 1, type: 'order', message: 'Nouvelle commande #5678 reçue', time: 'Il y a 2 min', read: false },
		{ id: 2, type: 'stock', message: 'Stock faible : Tomates Bio (5 kg restants)', time: 'Il y a 30 min', read: false },
		{ id: 3, type: 'review', message: 'Nouveau avis 5★ sur vos Oranges', time: 'Il y a 1h', read: false },
		{ id: 4, type: 'info', message: 'Votre boutique a été validée', time: 'Il y a 3h', read: true }
	])

	const unreadCount = notifications.filter(n => !n.read).length

	const markAsRead = (id) => {
		setNotifications(prev => 
			prev.map(n => n.id === id ? { ...n, read: true } : n)
		)
	}

	const markAllAsRead = () => {
		setNotifications(prev => prev.map(n => ({ ...n, read: true })))
	}

	const deleteNotification = (id) => {
		setNotifications(prev => prev.filter(n => n.id !== id))
	}

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
					{/* Notification Bell */}
					<div className="notification-wrapper">
						<button 
							className="notification-btn" 
							onClick={() => setShowNotifications(!showNotifications)}
							title="Notifications"
						>
							🔔
							{unreadCount > 0 && (
								<span className="notification-count">{unreadCount}</span>
							)}
						</button>

						{showNotifications && (
							<div className="notification-dropdown">
								<div className="notification-header">
									<h4>🔔 Notifications</h4>
									{unreadCount > 0 && (
										<button className="mark-all-read" onClick={markAllAsRead}>
											Tout marquer lu
										</button>
									)}
								</div>
								<div className="notification-list">
									{notifications.length > 0 ? (
										notifications.map(notif => (
											<div 
												key={notif.id} 
												className={`notification-item ${!notif.read ? 'unread' : ''}`}
												onClick={() => markAsRead(notif.id)}
											>
												<span className="notif-icon">
													{notif.type === 'order' ? '📦' : 
													 notif.type === 'stock' ? '⚠️' : 
													 notif.type === 'review' ? '⭐' : 'ℹ️'}
												</span>
												<div className="notif-content">
													<p className="notif-message">{notif.message}</p>
													<span className="notif-time">{notif.time}</span>
												</div>
												<button 
													className="notif-delete"
													onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
												>
													✕
												</button>
											</div>
										))
									) : (
										<p className="no-notifications">Aucune notification</p>
									)}
								</div>
							</div>
						)}
					</div>

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
