import React from 'react'
import { useNotifications } from '../context/NotificationContext'
import { formatRelativeTime } from '../utils/time'
import '../styles/Notifications.css'

const Notifications = () => {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  return (
    <section className="notifications-page">
      <header className="notifications-page__header">
        <div>
          <h1>Notifications</h1>
          <p>Suivez vos commandes, votre verification et les annonces systeme.</p>
        </div>
        {notifications.length > 0 && (
          <div className="notifications-page__actions">
            <button type="button" onClick={markAllAsRead}>
              Tout marquer lu
            </button>
          </div>
        )}
      </header>

      {isLoading && <div className="notification-state">Chargement des notifications...</div>}
      {error && <div className="notification-state error">{error}</div>}

      {!isLoading && notifications.length === 0 && (
        <div className="notification-empty">
          <p>Vous n'avez pas encore de notifications.</p>
          <p>Les changements importants de vos commandes apparaitront ici.</p>
        </div>
      )}

      <div className="notification-grid">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={`notification-card level-${notification.level} ${notification.is_read ? 'is-read' : ''}`}
          >
            <div className="notification-card__meta">
              <span className="notification-badge-pill">
                {notification.category}
              </span>
              <time>{formatRelativeTime(notification.created_at)}</time>
            </div>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            {notification.metadata && notification.metadata.order_id && (
              <div className="notification-card__meta-list">
                <span>Commande: {notification.metadata.order_id}</span>
                {notification.metadata.status && <span>Statut: {notification.metadata.status}</span>}
              </div>
            )}
            <div className="notification-card__actions">
              {!notification.is_read && (
                <button type="button" onClick={() => markAsRead(notification.id)}>
                  Marquer comme lu
                </button>
              )}
              <button type="button" className="ghost" onClick={() => removeNotification(notification.id)}>
                Supprimer
              </button>
              {notification.action_url && (
                <a href={notification.action_url} className="link" target="_blank" rel="noreferrer">
                  Ouvrir
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Notifications
