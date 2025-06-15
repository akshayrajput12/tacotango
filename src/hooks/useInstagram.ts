import { useState, useEffect, useCallback } from 'react'
import { InstagramService, type InstagramPost } from '../services/instagramService'

// Hook for public Instagram data (home page)
export const usePublicInstagram = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [allPosts, featured] = await Promise.all([
        InstagramService.getPublicPosts(),
        InstagramService.getFeaturedPosts()
      ])

      setPosts(allPosts)
      setFeaturedPosts(featured)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Instagram data')
      console.error('Error fetching public Instagram data:', err)
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
    posts,
    featuredPosts,
    loading,
    error,
    refetch
  }
}

// Hook for admin Instagram management
export const useAdminInstagram = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const allPosts = await InstagramService.getAllPosts()
      setPosts(allPosts)
    } catch (err) {
      console.error('Error fetching admin Instagram data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch Instagram posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const createPost = useCallback(async (post: Omit<InstagramPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newPost = await InstagramService.createPost(post)
      setPosts(prev => [newPost, ...prev])
      return newPost
    } catch (err) {
      console.error('Error creating Instagram post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create Instagram post'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePost = useCallback(async (id: string, updates: Partial<Omit<InstagramPost, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null)
      const updatedPost = await InstagramService.updatePost(id, updates)
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post))
      return updatedPost
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update Instagram post'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deletePost = useCallback(async (id: string) => {
    try {
      setError(null)
      await InstagramService.deletePost(id)
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete Instagram post'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const uploadImage = useCallback(async (file: File, postId?: string) => {
    try {
      setError(null)
      return await InstagramService.uploadImage(file, postId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteImage = useCallback(async (filePath: string) => {
    try {
      setError(null)
      await InstagramService.deleteImage(filePath)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getImageUrl = useCallback((filePath: string) => {
    return InstagramService.getImageUrl(filePath)
  }, [])

  const publishScheduledPosts = useCallback(async () => {
    try {
      setError(null)
      const publishedPosts = await InstagramService.publishScheduledPosts()
      // Refresh the posts list to reflect status changes
      await fetchPosts()
      return publishedPosts
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish scheduled posts'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchPosts])

  const getEngagementStats = useCallback(async () => {
    try {
      setError(null)
      return await InstagramService.getEngagementStats()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch engagement stats'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchPosts()
  }, [fetchPosts])

  const getPostsByStatus = useCallback((status: 'published' | 'scheduled' | 'draft' | 'all') => {
    if (status === 'all') return posts
    return posts.filter(post => post.status === status)
  }, [posts])

  const getAvailableStatuses = useCallback(() => {
    const statuses = [...new Set(posts.map(post => post.status))]
    return statuses.sort()
  }, [posts])

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
    deleteImage,
    getImageUrl,
    publishScheduledPosts,
    getEngagementStats,
    refetch,
    getPostsByStatus,
    getAvailableStatuses
  }
}

// Hook for Instagram posts by specific status
export const useInstagramByStatus = (status: 'published' | 'scheduled' | 'draft') => {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatusPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const statusPosts = await InstagramService.getPostsByStatus(status)
      setPosts(statusPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Instagram posts')
      console.error('Error fetching Instagram posts by status:', err)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchStatusPosts()
  }, [fetchStatusPosts])

  const refetch = useCallback(() => {
    fetchStatusPosts()
  }, [fetchStatusPosts])

  return {
    posts,
    loading,
    error,
    refetch
  }
}

// Hook for engagement statistics
export const useInstagramStats = () => {
  const [stats, setStats] = useState<{
    totalLikes: number
    totalComments: number
    averageLikes: number
    averageComments: number
    totalPosts: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const engagementStats = await InstagramService.getEngagementStats()
      setStats(engagementStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch engagement stats')
      console.error('Error fetching Instagram stats:', err)
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
