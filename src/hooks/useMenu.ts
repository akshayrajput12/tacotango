import { useState, useEffect, useCallback } from 'react'
import { MenuService, type MenuItem } from '../services/menuService'

// Hook for public menu data (home page and menu page)
export const usePublicMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [allItems, featured, cats] = await Promise.all([
        MenuService.getPublicMenuItems(),
        MenuService.getFeaturedMenuItems(),
        MenuService.getCategories()
      ])

      setMenuItems(allItems)
      setFeaturedItems(featured)
      setCategories(cats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu data')
      console.error('Error fetching public menu data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getItemsByCategory = useCallback((category: string) => {
    return menuItems.filter(item => item.category === category)
  }, [menuItems])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    menuItems,
    featuredItems,
    categories,
    loading,
    error,
    getItemsByCategory,
    refetch
  }
}

// Hook for admin menu management
export const useAdminMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await MenuService.getAllMenuItems()
      setMenuItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items')
      console.error('Error fetching admin menu data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const createMenuItem = useCallback(async (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newItem = await MenuService.createMenuItem(menuItem)
      setMenuItems(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMenuItem = useCallback(async (id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null)
      const updatedItem = await MenuService.updateMenuItem(id, updates)
      setMenuItems(prev => prev.map(item => item.id === id ? updatedItem : item))
      return updatedItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      setError(null)
      await MenuService.deleteMenuItem(id)
      setMenuItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const uploadImage = useCallback(async (file: File, menuItemId?: string) => {
    try {
      setError(null)
      return await MenuService.uploadImage(file, menuItemId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImage = useCallback(async (filePath: string) => {
    try {
      setError(null)
      await MenuService.deleteImage(filePath)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getImageUrl = useCallback((filePath: string) => {
    return MenuService.getImageUrl(filePath)
  }, [])

  const refetch = useCallback(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const getItemsByCategory = useCallback((category: string) => {
    return menuItems.filter(item => item.category === category)
  }, [menuItems])

  const getAvailableCategories = useCallback(() => {
    const categories = [...new Set(menuItems.map(item => item.category))]
    return categories.sort()
  }, [menuItems])

  return {
    menuItems,
    loading,
    error,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    uploadImage,
    deleteImage,
    getImageUrl,
    refetch,
    getItemsByCategory,
    getAvailableCategories
  }
}

// Hook for menu items by specific category
export const useMenuByCategory = (category: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await MenuService.getMenuItemsByCategory(category)
      setMenuItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items')
      console.error('Error fetching menu items by category:', err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    if (category) {
      fetchCategoryItems()
    }
  }, [fetchCategoryItems, category])

  const refetch = useCallback(() => {
    fetchCategoryItems()
  }, [fetchCategoryItems])

  return {
    menuItems,
    loading,
    error,
    refetch
  }
}
