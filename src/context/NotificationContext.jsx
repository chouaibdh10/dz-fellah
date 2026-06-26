import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { notificationsAPI } from '../utils/api'

const NotificationContext = createContext(null)
const isBrowser = typeof window !== 'undefined'

const noop = () => {}
const noopAsync = async () => {}
const EMPTY_CONTEXT = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  markAsRead: noop,
  markAllAsRead: noopAsync,
  removeNotification: noopAsync,
  addNotification: noop,
  refreshNotifications: noopAsync,
}

const getCrypto = () => {
  if (isBrowser && window.crypto) {
    return window.crypto
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto
  }
  return null
}

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const storageKey = useMemo(() => (user ? `notifications:${user.id}` : null), [user])

  const loadFromStorage = useCallback(() => {
    if (!storageKey || !isBrowser) return []
    try {
      const rawValue = window.localStorage.getItem(storageKey)
      return rawValue ? JSON.parse(rawValue) : []
    } catch (err) {
      console.warn('Impossible de lire les notifications locales', err)
      return []
    }
  }, [storageKey])

  const persistToStorage = useCallback((items) => {
    if (!storageKey || !isBrowser) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items))
    } catch (err) {
      console.warn('Impossible de sauvegarder les notifications locales', err)
    }
  }, [storageKey])

  const refreshNotifications = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setNotifications([])
      setError(null)
      return
    }

    const localItems = loadFromStorage()

    setIsLoading(true)
    setError(null)
    try {
      const payload = await notificationsAPI.list()
      const data = Array.isArray(payload) ? payload : (payload.results || [])
      setNotifications(data)
      persistToStorage(data)
    } catch (err) {
      console.error(err)
      setError("Impossible de charger les notifications depuis le serveur")
      setNotifications(localItems)
    } finally {
      setIsLoading(false)
    }
  }, [user, isAuthenticated, loadFromStorage, persistToStorage])

  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setError(null)
    }
  }, [user])

  useEffect(() => {
    persistToStorage(notifications)
  }, [notifications, persistToStorage])

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications((prev) => prev.map((n) => (
      n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
    )))

    if (!user || !isAuthenticated) return

    try {
      await notificationsAPI.markAsRead(notificationId)
    } catch (err) {
      console.warn('Impossible de synchroniser la notification', err)
    }
  }, [user, isAuthenticated])

  const markAllAsRead = useCallback(async () => {
    if (!notifications.length) return

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })))

    if (!user || !isAuthenticated) return

    try {
      await notificationsAPI.markAllAsRead()
    } catch (err) {
      console.warn('Impossible de marquer toutes les notifications comme lues', err)
    }
  }, [notifications, user, isAuthenticated])

  const removeNotification = useCallback(async (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))

    if (!user || !isAuthenticated) return

    try {
      await notificationsAPI.delete(notificationId)
    } catch (err) {
      console.warn('Impossible de supprimer la notification', err)
    }
  }, [user, isAuthenticated])

  const addNotification = useCallback((payload) => {
    const cryptoSource = getCrypto()
    const notification = {
      ...payload,
      id: payload?.id || (cryptoSource?.randomUUID ? cryptoSource.randomUUID() : `local-${Date.now()}`),
      created_at: payload?.created_at || new Date().toISOString(),
      is_read: payload?.is_read ?? false,
    }

    setNotifications((prev) => [notification, ...prev])
    return notification
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications])

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    refreshNotifications,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    console.warn('useNotifications utilise hors NotificationProvider')
    return EMPTY_CONTEXT
  }
  return context
}
