import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../utils/api'

const normalizeProfileForFrontend = (profile) => {
  if (!profile || typeof profile !== 'object') return profile
  const photo = profile.photo ?? profile.profile_image ?? null
  const name = profile.name ?? profile.full_name ?? profile.username ?? profile.email
  const hasUploadedID = profile.hasUploadedID ?? !!profile.id_image
  return { ...profile, photo, name, hasUploadedID }
}

const missingProvider = () => {
  throw new Error('AuthProvider is missing in the component tree')
}

const AuthContext = createContext({
  user: null,
  loading: false,
  isAuthenticated: false,
  isProducer: false,
  isClient: false,
  isAdmin: false,
  login: missingProvider,
  register: missingProvider,
  logout: missingProvider,
  updateUserPhoto: missingProvider,
  updateUserProfile: missingProvider,
  refreshProfile: missingProvider,
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('user')
      const accessToken = localStorage.getItem('access_token')
      
      if (savedUser && accessToken) {
        try {
          // Verify token by fetching profile
          const profile = normalizeProfileForFrontend(await authAPI.getProfile())
          const userData = normalizeProfileForFrontend({ ...JSON.parse(savedUser), ...profile })
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          // Token invalid, clear storage
          console.error('Token validation failed:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
      setLoading(false)
    }
    
    initializeAuth()
  }, [])

  const login = async (email, password) => {
    const response = await authAPI.login(email, password)
    
    // Fetch full profile after login
    const profile = normalizeProfileForFrontend(await authAPI.getProfile())
    
    const userData = {
      id: profile.id,
      email: profile.email,
      userType: response.user_type || profile.user_type,
      user_type: response.user_type || profile.user_type,
      full_name: profile.full_name,
      username: profile.username,
      phone: profile.phone,
      wilaya: profile.wilaya,
      city: profile.city,
      photo: profile.photo,
      is_email_verified: profile.is_email_verified,
      is_verified: profile.is_verified,
    }

    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const register = async (userData, userType) => {
    const registrationData = {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      username: userData.username,
      phone: userData.phone,
      wilaya: userData.wilaya,
      city: userData.city,
    }
    
    let response
    if (userType === 'producer') {
      response = await authAPI.registerProducer(registrationData)
    } else {
      response = await authAPI.registerClient(registrationData)
    }
    
    return response
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const updateUserPhoto = async (photoUrl) => {
    // Accept File/Blob to upload, or null to remove
    const payload =
      photoUrl instanceof File || photoUrl instanceof Blob
        ? { profile_image: photoUrl }
        : { profile_image: photoUrl }

    const response = normalizeProfileForFrontend(await authAPI.updateProfile(payload))
    const updatedUser = normalizeProfileForFrontend({ ...user, ...response })
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return response
  }

  const updateUserProfile = async (profileData) => {
    const response = normalizeProfileForFrontend(await authAPI.updateProfile(profileData))
    const updatedUser = normalizeProfileForFrontend({ ...user, ...response })
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return response
  }

  const refreshProfile = async () => {
    try {
      const profile = normalizeProfileForFrontend(await authAPI.getProfile())
      const updatedUser = normalizeProfileForFrontend({ ...user, ...profile })
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return profile
    } catch (error) {
      console.error('Failed to refresh profile:', error)
      throw error
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUserPhoto,
    updateUserProfile,
    refreshProfile,
    loading,
    isAuthenticated: !!user,
    isProducer: user?.userType === 'producer' || user?.user_type === 'producer',
    isClient: user?.userType === 'client' || user?.user_type === 'client',
    isAdmin: user?.userType === 'admin' || user?.user_type === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}
