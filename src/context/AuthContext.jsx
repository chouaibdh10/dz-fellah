import React, { createContext, useState, useContext, useEffect } from 'react'

import { api, clearTokens, setTokens } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger session depuis localStorage + valider côté API
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      api.auth
        .me()
        .then((u) => {
          const mapped = mapApiUserToUiUser(u)
          setUser(mapped)
          localStorage.setItem('user', JSON.stringify(mapped))
        })
        .catch(() => {
          clearTokens()
          localStorage.removeItem('user')
          setUser(null)
        })
        .finally(() => setLoading(false))
      return
    }
    setLoading(false)
  }, [])

  const mapApiUserToUiUser = (apiUser) => {
    // UI historique attend: userType
    return {
      id: apiUser.id,
      email: apiUser.email,
      userType: apiUser.role,
      name: apiUser.name || (apiUser.email ? apiUser.email.split('@')[0] : ''),
      photo: apiUser.photo || '',
      phone: apiUser.phone || '',
      address: apiUser.address || ''
    }
  }

  const login = async (email, password) => {
    const data = await api.auth.login(email, password)
    setTokens({ access: data.access, refresh: data.refresh })
    const mapped = mapApiUserToUiUser(data.user)
    setUser(mapped)
    localStorage.setItem('user', JSON.stringify(mapped))
    return mapped
  }

  const register = async (userData) => {
    const payload = {
      email: userData.email,
      password: userData.password,
      role: userData.userType,
      name: userData.name,
      phone: userData.phone,
      address: userData.address
    }
    const created = await api.auth.register(payload)

    // Auto-login after register
    const loggedIn = await api.auth.login(userData.email, userData.password)
    setTokens({ access: loggedIn.access, refresh: loggedIn.refresh })

    const mapped = mapApiUserToUiUser(created)
    setUser(mapped)
    localStorage.setItem('user', JSON.stringify(mapped))
    return mapped
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    clearTokens()
  }

  const updateUserPhoto = (photoUrl) => {
    const updatedUser = { ...user, photo: photoUrl }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    api.auth.updateMe({ photo: photoUrl }).catch(() => {})
  }

  const updateUserProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    api.auth.updateMe(profileData).catch(() => {})
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUserPhoto,
    updateUserProfile,
    loading,
    isProducer: user?.userType === 'producer',
    isClient: user?.userType === 'client',
    isAdmin: user?.userType === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
