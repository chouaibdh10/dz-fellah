import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationContext'
import '../../styles/ProducerSidebar.css'

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
	const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [showNotifications, setShowNotifications] = useState(false)

	const formatDate = (dateString) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now - date
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return "À l'instant"
		if (diffMins < 60) return `Il y a ${diffMins} min`
		if (diffHours < 24) return `Il y a ${diffHours}h`
		if (diffDays < 7) return `Il y a ${diffDays}j`
		return date.toLocaleDateString('fr-FR')
	}

	const getNotifIcon = (notif) => {
		if (notif?.category === 'order') return '📦'
		if (notif?.category === 'product') return '🧺'
		if (notif?.category === 'account') return '👤'
		if (notif?.level === 'warning') return '⚠️'
		if (notif?.level === 'error') return '❌'
		if (notif?.level === 'success') return '✅'
		return 'ℹ️'
	}

	const handleNotificationClick = (notif) => {
		markAsRead(notif.id)
		if (notif.action_url) {
			navigate(notif.action_url)
			setShowNotifications(false)
		}
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
												className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
												onClick={() => handleNotificationClick(notif)}
											>
												<span className="notif-icon">
													{getNotifIcon(notif)}
												</span>
												<div className="notif-content">
													<p className="notif-message">{notif.title || notif.message}</p>
													<span className="notif-time">{formatDate(notif.created_at)}</span>
												</div>
												<button 
													className="notif-delete"
													onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
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
