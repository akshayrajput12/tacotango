import { useState, useEffect, useCallback } from 'react'
import { ReviewsService, type Review } from '../services/reviewsService'

// =====================================================
// PUBLIC HOOKS (for website visitors)
// =====================================================

/**
 * Hook for getting approved reviews (public display)
 */
export const usePublicReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReviewsService.getApprovedReviews()
      setReviews(data)
    } catch (err) {
      console.error('Error fetching public reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  }
}

/**
 * Hook for getting featured reviews (homepage)
 */
export const useFeaturedReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReviewsService.getFeaturedReviews()
      setReviews(data)
    } catch (err) {
      console.error('Error fetching featured reviews:', err)
      setError('Failed to load featured reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  }
}

/**
 * Hook for submitting new reviews (public form)
 */
export const useSubmitReview = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitReview = useCallback(async (review: {
    customerName: string
    customerEmail?: string
    reviewText: string
    rating: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const newReview = await ReviewsService.submitReview(review)
      return newReview
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Failed to submit review')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    submitReview,
    loading,
    error
  }
}

// =====================================================
// ADMIN HOOKS (for admin panel)
// =====================================================

/**
 * Hook for admin reviews management
 */
export const useAdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async (filters?: {
    status?: string
    searchTerm?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReviewsService.getAllReviews(filters)
      setReviews(data)
    } catch (err) {
      console.error('Error fetching admin reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Create new review
  const createReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'avatarInitials' | 'avatarColor' | 'moderatedBy' | 'moderatedAt'>) => {
    try {
      const newReview = await ReviewsService.createReview(review)
      setReviews(prev => [newReview, ...prev])
      return newReview
    } catch (err) {
      console.error('Error creating review:', err)
      throw new Error('Failed to create review')
    }
  }, [])

  // Update existing review
  const updateReview = useCallback(async (id: string, updates: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'avatarInitials' | 'avatarColor'>>) => {
    try {
      const updatedReview = await ReviewsService.updateReview(id, updates)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      return updatedReview
    } catch (err) {
      console.error('Error updating review:', err)
      throw new Error('Failed to update review')
    }
  }, [])

  // Delete review
  const deleteReview = useCallback(async (id: string) => {
    try {
      await ReviewsService.deleteReview(id)
      setReviews(prev => prev.filter(review => review.id !== id))
    } catch (err) {
      console.error('Error deleting review:', err)
      throw new Error('Failed to delete review')
    }
  }, [])

  // Delete multiple reviews
  const deleteReviews = useCallback(async (ids: string[]) => {
    try {
      await ReviewsService.deleteReviews(ids)
      setReviews(prev => prev.filter(review => !ids.includes(review.id)))
    } catch (err) {
      console.error('Error deleting reviews:', err)
      throw new Error('Failed to delete reviews')
    }
  }, [])

  // Approve review
  const approveReview = useCallback(async (id: string) => {
    try {
      const updatedReview = await ReviewsService.approveReview(id)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      return updatedReview
    } catch (err) {
      console.error('Error approving review:', err)
      throw new Error('Failed to approve review')
    }
  }, [])

  // Reject review
  const rejectReview = useCallback(async (id: string, adminNotes?: string) => {
    try {
      const updatedReview = await ReviewsService.rejectReview(id, adminNotes)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      return updatedReview
    } catch (err) {
      console.error('Error rejecting review:', err)
      throw new Error('Failed to reject review')
    }
  }, [])

  // Toggle featured status
  const toggleFeatured = useCallback(async (id: string, featured: boolean) => {
    try {
      const updatedReview = await ReviewsService.toggleFeatured(id, featured)
      setReviews(prev => prev.map(review => review.id === id ? updatedReview : review))
      return updatedReview
    } catch (err) {
      console.error('Error toggling featured status:', err)
      throw new Error('Failed to update featured status')
    }
  }, [])

  // Get reviews by status
  const getReviewsByStatus = useCallback((status: string) => {
    if (status === 'all') return reviews
    return reviews.filter(review => review.status === status)
  }, [reviews])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    deleteReviews,
    approveReview,
    rejectReview,
    toggleFeatured,
    getReviewsByStatus
  }
}

/**
 * Hook for review statistics
 */
export const useReviewStats = () => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
    featuredReviews: 0,
    recentReviews: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReviewsService.getReviewStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching review stats:', err)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

/**
 * Hook for rating distribution
 */
export const useRatingDistribution = () => {
  const [distribution, setDistribution] = useState<Array<{
    rating: number
    count: number
    percentage: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDistribution = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ReviewsService.getRatingDistribution()
      setDistribution(data)
    } catch (err) {
      console.error('Error fetching rating distribution:', err)
      setError('Failed to load rating distribution')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDistribution()
  }, [fetchDistribution])

  return {
    distribution,
    loading,
    error,
    refetch: fetchDistribution
  }
}
