import React, { createContext, useContext, useEffect, useState } from 'react'

import { api } from '../services/api'

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

  const mapApiProductToContext = (p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    unit: p.unit,
    photo: p.photo,
    stock: p.stock,
    inSeason: p.in_season,
    category: p.category
  })

  const refresh = async () => {
    const list = await api.products.list()
    setProducts(list.map(mapApiProductToContext))
  }

  useEffect(() => {
    refresh().catch(() => {})
  }, [])

  const addProduct = (product) => {
    const payload = {
      name: product.name,
      price: parseFloat(product.price),
      unit: product.unit,
      photo: product.photo,
      stock: parseInt(product.stock),
      in_season: !!product.inSeason,
      category: product.category
    }
    return api.products.create(payload).then((created) => {
      const mapped = mapApiProductToContext(created)
      setProducts((prev) => [mapped, ...prev])
      return mapped
    })
  }

  const updateProduct = (id, updatedProduct) => {
    const payload = {
      name: updatedProduct.name,
      price: parseFloat(updatedProduct.price),
      unit: updatedProduct.unit,
      photo: updatedProduct.photo,
      stock: parseInt(updatedProduct.stock),
      in_season: !!updatedProduct.inSeason,
      category: updatedProduct.category
    }
    return api.products.update(id, payload).then((saved) => {
      const mapped = mapApiProductToContext(saved)
      setProducts((prev) => prev.map((p) => (p.id === id ? mapped : p)))
      return mapped
    })
  }

  const deleteProduct = (id) => {
    return api.products.remove(id).then(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    })
  }

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct 
    }}>
      {children}
    </ProductsContext.Provider>
  )
}
