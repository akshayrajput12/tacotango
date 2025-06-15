import { useState, useEffect, useCallback } from 'react'
import { SpecialOffersService, type SpecialOffer } from '../services/specialOffersService'

// =====================================================
// PUBLIC HOOKS (for public pages)
// =====================================================

/**
 * Hook for public special offers display (events page)
 */
export const usePublicSpecialOffers = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getPublicOffers()
      setOffers(data)
    } catch (err) {
      console.error('Error fetching public special offers:', err)
      setError('Failed to load special offers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  }
}

/**
 * Hook for featured special offers (events page)
 */
export const useFeaturedSpecialOffers = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getFeaturedOffers()
      setOffers(data)
    } catch (err) {
      console.error('Error fetching featured special offers:', err)
      setError('Failed to load featured offers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  }
}

/**
 * Hook for special offers by status
 */
export const useSpecialOffersByStatus = (status: 'active' | 'inactive' | 'expired') => {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getOffersByStatus(status)
      setOffers(data)
    } catch (err) {
      console.error(`Error fetching ${status} special offers:`, err)
      setError(`Failed to load ${status} offers`)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  }
}

// =====================================================
// ADMIN HOOKS (for admin panel)
// =====================================================

/**
 * Hook for admin special offers management
 */
export const useAdminSpecialOffers = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getAllOffers()
      setOffers(data)
    } catch (err) {
      console.error('Error fetching admin special offers:', err)
      setError('Failed to load special offers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  // Create new offer
  const createOffer = useCallback(async (offer: Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt' | 'isExpired' | 'isValid' | 'details'>) => {
    try {
      const newOffer = await SpecialOffersService.createOffer(offer)
      setOffers(prev => [newOffer, ...prev])
      return newOffer
    } catch (err) {
      console.error('Error creating special offer:', err)
      throw new Error('Failed to create special offer')
    }
  }, [])

  // Update existing offer
  const updateOffer = useCallback(async (id: string, updates: Partial<Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt' | 'isExpired' | 'isValid' | 'details'>>) => {
    try {
      const updatedOffer = await SpecialOffersService.updateOffer(id, updates)
      setOffers(prev => prev.map(offer => offer.id === id ? updatedOffer : offer))
      return updatedOffer
    } catch (err) {
      console.error('Error updating special offer:', err)
      throw new Error('Failed to update special offer')
    }
  }, [])

  // Delete offer
  const deleteOffer = useCallback(async (id: string) => {
    try {
      await SpecialOffersService.deleteOffer(id)
      setOffers(prev => prev.filter(offer => offer.id !== id))
    } catch (err) {
      console.error('Error deleting special offer:', err)
      throw new Error('Failed to delete special offer')
    }
  }, [])

  // Delete multiple offers
  const deleteOffers = useCallback(async (ids: string[]) => {
    try {
      await SpecialOffersService.deleteOffers(ids)
      setOffers(prev => prev.filter(offer => !ids.includes(offer.id)))
    } catch (err) {
      console.error('Error deleting special offers:', err)
      throw new Error('Failed to delete special offers')
    }
  }, [])

  // Get offers by status
  const getOffersByStatus = useCallback((status: 'active' | 'inactive' | 'expired') => {
    const today = new Date().toISOString().split('T')[0]
    
    return offers.filter(offer => {
      switch (status) {
        case 'active':
          return offer.active && offer.validUntil >= today
        case 'inactive':
          return !offer.active
        case 'expired':
          return offer.validUntil < today
        default:
          return true
      }
    })
  }, [offers])

  // Get featured offers
  const getFeaturedOffers = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return offers.filter(offer => offer.featured && offer.active && offer.validUntil >= today)
  }, [offers])

  // Get expiring soon offers
  const getExpiringSoonOffers = useCallback(() => {
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const todayStr = today.toISOString().split('T')[0]
    const sevenDaysFromNowStr = sevenDaysFromNow.toISOString().split('T')[0]
    
    return offers.filter(offer => 
      offer.active && 
      offer.validUntil >= todayStr && 
      offer.validUntil <= sevenDaysFromNowStr
    )
  }, [offers])

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    deleteOffers,
    getOffersByStatus,
    getFeaturedOffers,
    getExpiringSoonOffers
  }
}

/**
 * Hook for special offers statistics
 */
export const useSpecialOffersStats = () => {
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    expiredOffers: 0,
    featuredOffers: 0,
    expiringSoon: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getOffersStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching special offers stats:', err)
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
 * Hook for single special offer
 */
export const useSpecialOffer = (id: string | null) => {
  const [offer, setOffer] = useState<SpecialOffer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffer = useCallback(async (offerId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getOfferById(offerId)
      setOffer(data)
    } catch (err) {
      console.error('Error fetching special offer:', err)
      setError('Failed to load special offer')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchOffer(id)
    } else {
      setOffer(null)
      setLoading(false)
      setError(null)
    }
  }, [id, fetchOffer])

  return {
    offer,
    loading,
    error,
    refetch: id ? () => fetchOffer(id) : () => {}
  }
}

/**
 * Hook for expiring soon offers
 */
export const useExpiringSoonOffers = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await SpecialOffersService.getExpiringSoonOffers()
      setOffers(data)
    } catch (err) {
      console.error('Error fetching expiring soon offers:', err)
      setError('Failed to load expiring offers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  }
}
