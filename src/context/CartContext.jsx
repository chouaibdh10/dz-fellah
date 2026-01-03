import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { ordersAPI } from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, isAuthenticated, isClient } = useAuth()

  // Fetch cart from server when user is authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isClient) {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
      return
    }

    setLoading(true)
    setError(null)
    try {
      const cartData = await ordersAPI.getCart()
      // Map backend cart structure to frontend
      const items = cartData.items || cartData || []
      setCart(items.map(item => ({
        id: item.id,
        productId: item.product_id || item.product?.id || item.product_details?.id,
        product: item.product,
        name: item.product?.name || item.name || item.product_details?.name,
        price: Number(item.unit_price || item.product?.price || item.price || item.product_details?.price || 0),
        quantity: Number(item.quantity) || 0,
        photo: item.product?.photo || item.photo || item.product_details?.photo,
        batchId: item.batch_id,
        isAntigaspi: item.is_antigaspi,
        sale_unit: item.product?.sale_unit || item.sale_unit || item.product_details?.sale_unit || item.product_details?.unit,
        shop_name: item.product?.shop_name || item.shop_name || item.product_details?.shop_name || item.product_details?.producer,
      })))
    } catch (err) {
      console.error('Failed to fetch cart:', err)
      setError(err.message)
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, isClient])

  useEffect(() => {
    fetchCart()
  }, [fetchCart, user])

  // Sync cart to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated || !isClient) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isAuthenticated, isClient])

  const addToCart = async (product, quantity, batchId = null, isAntigaspi = false) => {
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error('Quantité invalide')
    }

    if (isAuthenticated && isClient) {
      try {
        setLoading(true)
        await ordersAPI.addToCart(product.id, qty, batchId, isAntigaspi)
        await fetchCart() // Refresh cart from server
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    } else {
      // Guest cart (localStorage)
      setCart(prevCart => {
        const existingItem = prevCart.find(item => 
          item.productId === product.id && item.batchId === batchId
        )

        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product.id && item.batchId === batchId
              ? { ...item, quantity: (Number(item.quantity) || 0) + qty }
              : item
          )
        }

        return [...prevCart, {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: isAntigaspi ? product.price / 2 : product.price,
          quantity: qty,
          photo: product.photo,
          batchId,
          isAntigaspi,
          sale_unit: product.sale_unit,
          shop_name: product.shop_name,
        }]
      })
    }
  }

  const removeFromCart = async (itemId) => {
    if (isAuthenticated && isClient) {
      try {
        setLoading(true)
        await ordersAPI.removeFromCart(itemId)
        await fetchCart()
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    } else {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId))
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    const qty = Number(quantity)

    if (!Number.isFinite(qty)) {
      throw new Error('Quantité invalide')
    }

    if (qty <= 0) {
      await removeFromCart(itemId)
      return
    }

    if (isAuthenticated && isClient) {
      try {
        setLoading(true)
        await ordersAPI.updateCartItem(itemId, qty)
        await fetchCart()
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: qty } : item
        )
      )
    }
  }

  const clearCart = async () => {
    if (isAuthenticated && isClient) {
      try {
        setLoading(true)
        await ordersAPI.clearCart()
        setCart([])
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    } else {
      setCart([])
    }
  }

  const checkout = async (deliveryInfo = {}) => {
    if (!isAuthenticated || !isClient) {
      throw new Error('Vous devez être connecté pour passer commande')
    }
    
    try {
      setLoading(true)
      const order = await ordersAPI.checkout(deliveryInfo)
      setCart([])
      return order
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  const getItemCount = () => {
    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)
  }

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    getTotalPrice,
    getItemCount,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
