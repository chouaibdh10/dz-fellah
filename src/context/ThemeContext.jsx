import React, { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'light')
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', 'light')
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}
