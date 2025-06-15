import { useState, useEffect, useCallback } from 'react'
import { GalleryService, type GalleryImage } from '../services/galleryService'

// Hook for public Gallery data (home page and gallery page)
export const usePublicGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [allImages, featured, categoryData] = await Promise.all([
        GalleryService.getPublicImages(),
        GalleryService.getFeaturedImages(),
        GalleryService.getCategories()
      ])

      setImages(allImages)
      setFeaturedImages(featured)
      setCategories(categoryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery data')
      console.error('Error fetching public gallery data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    images,
    featuredImages,
    categories,
    loading,
    error,
    refetch
  }
}

// Hook for admin Gallery management
export const useAdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const allImages = await GalleryService.getAllImages()
      setImages(allImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery images')
      console.error('Error fetching admin gallery data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const createImage = useCallback(async (image: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newImage = await GalleryService.createImage(image)
      setImages(prev => [newImage, ...prev])
      return newImage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gallery image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateImage = useCallback(async (id: string, updates: Partial<Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null)
      const updatedImage = await GalleryService.updateImage(id, updates)
      setImages(prev => prev.map(image => image.id === id ? updatedImage : image))
      return updatedImage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gallery image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null)
      await GalleryService.deleteImage(id)
      setImages(prev => prev.filter(image => image.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImages = useCallback(async (ids: string[]) => {
    try {
      setError(null)
      await GalleryService.deleteImages(ids)
      setImages(prev => prev.filter(image => !ids.includes(image.id)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery images'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const uploadImage = useCallback(async (file: File, imageId?: string) => {
    try {
      setError(null)
      return await GalleryService.uploadImage(file, imageId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImageFile = useCallback(async (filePath: string) => {
    try {
      setError(null)
      await GalleryService.deleteImageFile(filePath)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image file'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getImageUrl = useCallback((filePath: string) => {
    return GalleryService.getImageUrl(filePath)
  }, [])

  const reorderImages = useCallback(async (imageIds: string[], category: string) => {
    try {
      setError(null)
      await GalleryService.reorderImages(imageIds, category)
      // Refresh the images list to reflect new order
      await fetchImages()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder images'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchImages])

  const refetch = useCallback(() => {
    fetchImages()
  }, [fetchImages])

  const getImagesByCategory = useCallback((category: string) => {
    return images.filter(image => image.category === category)
  }, [images])

  const getAvailableCategories = useCallback(() => {
    const categories = [...new Set(images.map(image => image.category))]
    return categories.sort()
  }, [images])

  return {
    images,
    loading,
    error,
    createImage,
    updateImage,
    deleteImage,
    deleteImages,
    uploadImage,
    deleteImageFile,
    getImageUrl,
    reorderImages,
    refetch,
    getImagesByCategory,
    getAvailableCategories
  }
}

// Hook for Gallery images by specific category
export const useGalleryByCategory = (category: string) => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const categoryImages = await GalleryService.getImagesByCategory(category)
      setImages(categoryImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery images')
      console.error('Error fetching gallery images by category:', err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchCategoryImages()
  }, [fetchCategoryImages])

  const refetch = useCallback(() => {
    fetchCategoryImages()
  }, [fetchCategoryImages])

  return {
    images,
    loading,
    error,
    refetch
  }
}

// Hook for gallery statistics
export const useGalleryStats = () => {
  const [stats, setStats] = useState<{
    totalImages: number
    featuredImages: number
    categoryCounts: Record<string, number>
    recentUploads: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const galleryStats = await GalleryService.getGalleryStats()
      setStats(galleryStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery stats')
      console.error('Error fetching gallery stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refetch = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch
  }
}

// Hook for featured gallery images (home page)
export const useFeaturedGallery = () => {
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const featured = await GalleryService.getFeaturedImages()
      setFeaturedImages(featured)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured gallery images')
      console.error('Error fetching featured gallery images:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedImages()
  }, [fetchFeaturedImages])

  const refetch = useCallback(() => {
    fetchFeaturedImages()
  }, [fetchFeaturedImages])

  return {
    featuredImages,
    loading,
    error,
    refetch
  }
}
