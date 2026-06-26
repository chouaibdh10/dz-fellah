import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productsAPI } from '../utils/api'

const ProductsContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productsAPI.listAll()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Calculate total stock for a product (handles both fresh and dry)
  const getTotalStock = (product) => {
    if (!product) return 0
    if (product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity !== '') {
      return Number(product.stock_quantity) || 0
    }
    if (product.product_type === 'dry') {
      return product.stock || 0
    }
    // Fresh products: sum all batch stock
    return (product.batches || []).reduce((total, batch) => total + (batch.stock || 0), 0)
  }

  // Get anti-gaspi stock (fresh products only)
  const getAntigaspiStock = (product) => {
    if (!product || product.product_type !== 'fresh') return 0
    if (product.antigaspi_stock !== undefined && product.antigaspi_stock !== null && product.antigaspi_stock !== '') {
      return Number(product.antigaspi_stock) || 0
    }
    return (product.batches || [])
      .filter(batch => batch.is_antigaspi && batch.stock > 0)
      .reduce((total, batch) => total + batch.stock, 0)
  }

  // Get regular (non-anti-gaspi) stock
  const getRegularStock = (product) => {
    if (!product) return 0
    if (product.regular_stock !== undefined && product.regular_stock !== null && product.regular_stock !== '') {
      return Number(product.regular_stock) || 0
    }
    if (product.product_type === 'dry') return product.stock || 0
    return (product.batches || [])
      .filter(batch => !batch.is_antigaspi && batch.stock > 0)
      .reduce((total, batch) => total + batch.stock, 0)
  }

  // Check if product has anti-gaspi stock
  const hasAntigaspiStock = (product) => {
    if (!product || product.product_type !== 'fresh') return false
    if (product.has_antigaspi !== undefined) return !!product.has_antigaspi
    return (product.batches || []).some(batch => batch.is_antigaspi && batch.stock > 0)
  }

  // Get effective price (50% off for anti-gaspi batches)
  const getEffectivePrice = (product, useAntigaspi = false) => {
    if (!product) return 0
    if (useAntigaspi && hasAntigaspiStock(product)) {
      return product.price / 2
    }
    return product.price
  }

  // Check if batch is anti-gaspi eligible (harvest_date >= 2 days ago)
  const isAntigaspiEligible = (harvestDate) => {
    const harvest = new Date(harvestDate)
    const now = new Date()
    const diffDays = Math.floor((now - harvest) / (1000 * 60 * 60 * 24))
    return diffDays >= 2
  }

  // Search products
  const searchProducts = async (query) => {
    try {
      const data = await productsAPI.search(query)
      return data
    } catch (err) {
      console.error('Search failed:', err)
      throw err
    }
  }

  // Get product details
  const getProductDetails = async (productId) => {
    try {
      const data = await productsAPI.getDetails(productId)
      return data
    } catch (err) {
      console.error('Get product details failed:', err)
      throw err
    }
  }

  // Add a new product (producer only)
  const addProduct = async (productData) => {
    try {
      setLoading(true)
      const newProduct = await productsAPI.addProduct(productData)
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add a new batch to a fresh product
  const addBatch = async (productId, batchData) => {
    try {
      setLoading(true)
      const result = await productsAPI.addBatch(productId, batchData)
      await fetchProducts() // Refresh products list
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update batch stock
  const updateBatchStock = async (productId, batchId, newStock) => {
    try {
      setLoading(true)
      await productsAPI.updateBatchStock(batchId, newStock)
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            batches: (product.batches || []).map(batch =>
              batch.id === batchId ? { ...batch, stock: Math.max(0, newStock) } : batch
            )
          }
        }
        return product
      }))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update dry product stock directly
  const updateDryProductStock = async (productId, newStock) => {
    try {
      setLoading(true)
      await productsAPI.updateDryProductStock(productId, newStock)
      setProducts(products.map(product => {
        if (product.id === productId && product.product_type === 'dry') {
          return { ...product, stock: Math.max(0, parseFloat(newStock)) }
        }
        return product
      }))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update product info (not stock/batches) - local only for now
  const updateProduct = (id, updatedData) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, ...updatedData, id } : product
    ))
  }

  // Delete product - local only for now
  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  // Get anti-waste baskets
  const getAntiWasteBaskets = async () => {
    try {
      return await productsAPI.getAntiWasteBaskets()
    } catch (err) {
      console.error('Failed to get anti-waste baskets:', err)
      throw err
    }
  }

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      fetchProducts,
      searchProducts,
      getProductDetails,
      // Stock helpers
      getTotalStock,
      getAntigaspiStock,
      getRegularStock,
      hasAntigaspiStock,
      getEffectivePrice,
      isAntigaspiEligible,
      // CRUD operations
      addProduct,
      updateProduct,
      deleteProduct,
      // Batch operations (fresh products)
      addBatch,
      updateBatchStock,
      // Dry product stock
      updateDryProductStock,
      // Anti-waste
      getAntiWasteBaskets,
    }}>
      {children}
    </ProductsContext.Provider>
  )
}
