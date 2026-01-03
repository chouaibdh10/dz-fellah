import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterChoice from './pages/RegisterChoice'
import ForgotPassword from './pages/ForgotPassword'
import CheckEmail from './pages/CheckEmail'
import ResetPassword from './pages/ResetPassword'
import ProductCatalog from './pages/ProductCatalog'
import Cart from './pages/Cart'
import ProducerAccess from './pages/ProducerAccess'
import ClientAccess from './pages/ClientAccess'
import ProducerDashboard from './pages/producer/Dashboard'
import ProducerShop from './pages/producer/Shop'
import ProducerOrders from './pages/producer/Orders'
import ProducerProfile from './pages/producer/Profile'
import ClientProfile from './pages/client/Profile'
import ClientOrders from './pages/client/Orders'
import ChangePassword from './pages/client/ChangePassword'
import ChangePasswordP from './pages/producer/ChangePassword'
import VerifyEmail from './pages/VerifyEmail'
import EmailVerified from './pages/EmailVerified'
import './styles/App.css'

function AppContent() {
  const location = useLocation()
  
  // Pages où la navbar horizontale doit être masquée
  const hideNavbarPaths = [
    '/forgot-password',
    '/check-email',
    '/reset-password',
    '/client/profile',
    '/client/orders',
    '/client/change-password',
    '/producer/change-password',
    '/cart',
    '/products',
    '/producer',
  ]
  
  const shouldHideNavbar = hideNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  )

  return (
    <div className="app">
      {!shouldHideNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-choice" element={<RegisterChoice />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified/:uidb64/:token" element={<EmailVerified />} />
          <Route path="/cart" element={<Cart />} />
        
          {/* Routes d'accès rapide */}
          <Route path="/producteur" element={<ProducerAccess />} />
          <Route path="/client" element={<ClientAccess />} />

          {/* Routes Producteur */}
          <Route path="/producer/shop" element={<ProducerShop />} />
          <Route path="/producer/dashboard" element={<ProducerDashboard />} />
          <Route path="/producer/orders" element={<ProducerOrders />} />
          <Route path="/producer/profile" element={<ProducerProfile />} />
          <Route path="/producer/change-password" element={<ChangePasswordP />} />
          
          {/* Routes Client */}
          <Route path="/client/products" element={<ProductCatalog />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/orders" element={<ClientOrders />} />
          <Route path="/client/change-password" element={<ChangePassword />} />
          
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <ProductsProvider>
                <AppContent />
              </ProductsProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
