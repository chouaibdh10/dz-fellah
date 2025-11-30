import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterChoice from './pages/RegisterChoice'
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
import VerifyEmail from './pages/VerifyEmail'
import EmailVerified from './pages/EmailVerified'
import './styles/App.css'

function AppContent() {
  const location = useLocation()
  
  // Pages où la navbar horizontale doit être masquée
  const hideNavbarPaths = [
    '/client/profile',
    '/client/orders',
    '/cart',
    '/products',
    '/producer'
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-choice" element={<RegisterChoice />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/cart" element={<Cart />} />
        
          {/* Routes d'accès rapide */}
          <Route path="/producteur" element={<ProducerAccess />} />
          <Route path="/client" element={<ClientAccess />} />
          
          {/* Routes Producteur */}
          <Route path="/producer/dashboard" element={<ProducerDashboard />} />
          <Route path="/producer/shop" element={<ProducerShop />} />
          <Route path="/producer/orders" element={<ProducerOrders />} />
          <Route path="/producer/profile" element={<ProducerProfile />} />
          
          {/* Routes Client */}
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/orders" element={<ClientOrders />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductsProvider>
            <AppContent />
          </ProductsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
