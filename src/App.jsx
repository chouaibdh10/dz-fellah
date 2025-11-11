import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import ProducerDashboard from './pages/producer/Dashboard'
import ProducerShop from './pages/producer/Shop'
import ProducerProducts from './pages/producer/Products'
import ClientDashboard from './pages/client/Dashboard'
import ClientOrders from './pages/client/Orders'
import './styles/App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Routes Producteur */}
                <Route path="/producer/dashboard" element={<ProducerDashboard />} />
                <Route path="/producer/shop" element={<ProducerShop />} />
                <Route path="/producer/products" element={<ProducerProducts />} />
                
                {/* Routes Client */}
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/orders" element={<ClientOrders />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
