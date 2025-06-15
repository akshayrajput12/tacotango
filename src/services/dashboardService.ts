import { EventsService } from './eventsService'
import { MenuService } from './menuService'
import { InstagramService } from './instagramService'
import { GalleryService } from './galleryService'
import { SpecialOffersService } from './specialOffersService'
import { ReservationsService } from './reservationsService'
import { ReviewsService } from './reviewsService'

// Dashboard statistics interface
export interface DashboardStats {
  events: {
    total: number
    upcoming: number
    past: number
    published: number
  }
  menu: {
    total: number
    available: number
    categories: number
    featured: number
  }
  instagram: {
    total: number
    published: number
    pending: number
    featured: number
  }
  gallery: {
    total: number
    featured: number
    categories: number
  }
  offers: {
    total: number
    active: number
    expired: number
    featured: number
  }
  reservations: {
    total: number
    pending: number
    confirmed: number
    cancelled: number
    today: number
  }
  reviews: {
    total: number
    approved: number
    pending: number
    rejected: number
    averageRating: number
    featured: number
  }
}

// Recent activity interfaces
export interface RecentActivity {
  reservations: Array<{
    id: string
    customerName: string
    customerPhone: string
    date: string
    time: string
    guests: number
    status: string
    createdAt: string
  }>
  reviews: Array<{
    id: string
    customerName: string
    rating: number
    reviewText: string
    status: string
    createdAt: string
  }>
  events: Array<{
    id: string
    title: string
    date: string
    time: string
    image: string
    status: string
    capacity: number
    registered: number
  }>
}

// Quick actions interface
export interface QuickActionData {
  pendingReservations: number
  pendingReviews: number
  upcomingEvents: number
  lowStockItems: number
  recentActivity: number
}

export class DashboardService {
  
  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Fetch data from all services in parallel
      const [
        events,
        menuItems,
        instagramPosts,
        galleryImages,
        offers,
        reservations,
        reviewStats
      ] = await Promise.all([
        EventsService.getAllEvents(),
        MenuService.getAllMenuItems(),
        InstagramService.getAllPosts(),
        GalleryService.getAllImages(),
        SpecialOffersService.getAllOffers(),
        ReservationsService.getAllReservations(),
        ReviewsService.getReviewStats()
      ])

      // Calculate event statistics
      const now = new Date()
      const upcomingEvents = events.filter(e =>
        e.status === 'upcoming' && new Date(e.date) >= now
      ).length
      const pastEvents = events.filter(e =>
        new Date(e.date) < now
      ).length
      const activeEvents = events.filter(e => e.active).length

      // Calculate menu statistics
      const availableMenuItems = menuItems.filter(m => m.available).length
      const menuCategories = [...new Set(menuItems.map(m => m.category))].length
      const featuredMenuItems = menuItems.filter(m => m.featured).length

      // Calculate Instagram statistics
      const publishedPosts = instagramPosts.filter(p => p.status === 'published').length
      const draftPosts = instagramPosts.filter(p => p.status === 'draft').length
      const featuredPosts = instagramPosts.filter(p => p.featured).length

      // Calculate gallery statistics
      const featuredImages = galleryImages.filter(g => g.featured).length
      const galleryCategories = [...new Set(galleryImages.map(g => g.category))].length

      // Calculate offers statistics
      const activeOffers = offers.filter(o => o.active && new Date(o.validUntil) >= now).length
      const expiredOffers = offers.filter(o => new Date(o.validUntil) < now).length
      const featuredOffers = offers.filter(o => o.featured).length

      // Calculate reservation statistics
      const pendingReservations = reservations.filter(r => r.status === 'pending').length
      const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length
      const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length
      const todayReservations = reservations.filter(r => {
        const reservationDate = new Date(r.date)
        const today = new Date()
        return reservationDate.toDateString() === today.toDateString()
      }).length

      return {
        events: {
          total: events.length,
          upcoming: upcomingEvents,
          past: pastEvents,
          published: activeEvents
        },
        menu: {
          total: menuItems.length,
          available: availableMenuItems,
          categories: menuCategories,
          featured: featuredMenuItems
        },
        instagram: {
          total: instagramPosts.length,
          published: publishedPosts,
          pending: draftPosts,
          featured: featuredPosts
        },
        gallery: {
          total: galleryImages.length,
          featured: featuredImages,
          categories: galleryCategories
        },
        offers: {
          total: offers.length,
          active: activeOffers,
          expired: expiredOffers,
          featured: featuredOffers
        },
        reservations: {
          total: reservations.length,
          pending: pendingReservations,
          confirmed: confirmedReservations,
          cancelled: cancelledReservations,
          today: todayReservations
        },
        reviews: {
          total: reviewStats.totalReviews,
          approved: reviewStats.approvedReviews,
          pending: reviewStats.pendingReviews,
          rejected: reviewStats.rejectedReviews,
          averageRating: reviewStats.averageRating,
          featured: reviewStats.featuredReviews
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  /**
   * Get recent activity data
   */
  static async getRecentActivity(): Promise<RecentActivity> {
    try {
      const [reservations, reviews, events] = await Promise.all([
        ReservationsService.getAllReservations(),
        ReviewsService.getAllReviews(),
        EventsService.getAllEvents()
      ])

      // Get recent reservations (last 5)
      const recentReservations = reservations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          customerName: r.customerName,
          customerPhone: r.customerPhone,
          date: r.date,
          time: r.time,
          guests: r.guests,
          status: r.status,
          createdAt: r.createdAt
        }))

      // Get recent reviews (last 5)
      const recentReviews = reviews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          customerName: r.customerName,
          rating: r.rating,
          reviewText: r.reviewText.substring(0, 100) + (r.reviewText.length > 100 ? '...' : ''),
          status: r.status,
          createdAt: r.createdAt
        }))

      // Get upcoming events (next 5)
      const now = new Date()
      const upcomingEvents = events
        .filter(e => e.status === 'upcoming' && new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
        .map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          image: e.image,
          status: e.status,
          capacity: e.capacity,
          registered: e.registered
        }))

      return {
        reservations: recentReservations,
        reviews: recentReviews,
        events: upcomingEvents
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }

  /**
   * Get quick action data for badges and notifications
   */
  static async getQuickActionData(): Promise<QuickActionData> {
    try {
      const [reservations, reviews, events, menuItems] = await Promise.all([
        ReservationsService.getAllReservations(),
        ReviewsService.getReviewStats(),
        EventsService.getAllEvents(),
        MenuService.getAllMenuItems()
      ])

      const pendingReservations = reservations.filter(r => r.status === 'pending').length
      const pendingReviews = reviews.pendingReviews

      const now = new Date()
      const upcomingEvents = events.filter(e =>
        e.status === 'upcoming' && new Date(e.date) >= now
      ).length

      // Calculate low stock items (items marked as unavailable)
      const lowStockItems = menuItems.filter(m => !m.available).length

      // Recent activity count (items from last 24 hours)
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const recentReservations = reservations.filter(r => 
        new Date(r.createdAt) >= yesterday
      ).length

      return {
        pendingReservations,
        pendingReviews,
        upcomingEvents,
        lowStockItems,
        recentActivity: recentReservations
      }
    } catch (error) {
      console.error('Error fetching quick action data:', error)
      throw error
    }
  }

  /**
   * Get sidebar quick overview data
   */
  static async getQuickOverview(): Promise<{
    activeEvents: number
    menuItems: number
    pendingReservations: number
    totalReviews: number
  }> {
    try {
      const [events, menuItems, reservations, reviewStats] = await Promise.all([
        EventsService.getAllEvents(),
        MenuService.getAllMenuItems(),
        ReservationsService.getAllReservations(),
        ReviewsService.getReviewStats()
      ])

      const now = new Date()
      const activeEvents = events.filter(e =>
        e.status === 'upcoming' && new Date(e.date) >= now
      ).length

      const pendingReservations = reservations.filter(r => r.status === 'pending').length

      return {
        activeEvents,
        menuItems: menuItems.length,
        pendingReservations,
        totalReviews: reviewStats.totalReviews
      }
    } catch (error) {
      console.error('Error fetching quick overview:', error)
      throw error
    }
  }
}
