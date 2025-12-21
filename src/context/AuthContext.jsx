import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // TODO: Remplacer par un véritable appel API
    // Détection automatique du type d'utilisateur basée sur l'email
    let userType = 'client'
    if (email.includes('admin') || email.includes('administrateur')) {
      userType = 'admin'
    } else if (email.includes('producteur') || email.includes('producer') || email.includes('ferme')) {
      userType = 'producer'
    }
    
    const userData = {
      id: Date.now(),
      email,
      userType,
      name: email.split('@')[0]
    }
    
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const register = async (userData) => {
    // TODO: Remplacer par un véritable appel API
    const newUser = {
      id: Date.now(),
      ...userData
    }
    
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUserPhoto = (photoUrl) => {
    const updatedUser = { ...user, photo: photoUrl }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const updateUserProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
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
