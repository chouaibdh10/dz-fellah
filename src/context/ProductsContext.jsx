import React, { createContext, useContext, useState } from 'react'

const ProductsContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomates Bio',
      price: 250,
      unit: 'kg',
      photo: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      stock: 50,
      inSeason: true,
      category: 'Légumes'
    },
    {
      id: 2,
      name: 'Oranges Fraîches',
      price: 180,
      unit: 'kg',
      photo: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
      stock: 30,
      inSeason: true,
      category: 'Fruits'
    }
  ])

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      price: parseFloat(product.price),
      stock: parseInt(product.stock)
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => 
      p.id === id ? { ...updatedProduct, id } : p
    ))
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
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
