import React, { useState, useEffect } from 'react'
import { ProtectedRoute, AdminLayout } from './components'
import {
  AdminDashboard,
  EventsManagement,
  MenuManagement,
  InstagramManagement,
  GalleryManagement,
  OffersManagement,
  BookingsManagement,
  ReviewsManagement
} from './pages'
import { getPageTitle } from './utils/adminNavigation'

export const Admin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Handle URL routing for admin panel
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname
      
      // Admin route mapping
      const adminRoutes: { [key: string]: string } = {
        '/admin': 'dashboard',
        '/admin/events': 'events',
        '/admin/menu': 'menu',
        '/admin/instagram': 'instagram',
        '/admin/gallery': 'gallery',
        '/admin/offers': 'offers',
        '/admin/bookings': 'bookings',
        '/admin/reviews': 'reviews'
      }

      const page = adminRoutes[path]
      if (page) {
        setCurrentPage(page)
      } else if (path.startsWith('/admin')) {
        // Default to dashboard for unknown admin routes
        setCurrentPage('dashboard')
        window.history.replaceState(null, '', '/admin')
      }
    }

    // Handle browser back/forward buttons and initial load
    window.addEventListener('popstate', handleRouteChange)
    handleRouteChange()

    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    
    // Update URL
    const routes: { [key: string]: string } = {
      dashboard: '/admin',
      events: '/admin/events',
      menu: '/admin/menu',
      instagram: '/admin/instagram',
      gallery: '/admin/gallery',
      offers: '/admin/offers',
      bookings: '/admin/bookings',
      reviews: '/admin/reviews'
    }
    
    const route = routes[page] || '/admin'
    window.history.pushState(null, '', route)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventsManagement />
      case 'menu':
        return <MenuManagement />
      case 'instagram':
        return <InstagramManagement />
      case 'gallery':
        return <GalleryManagement />
      case 'offers':
        return <OffersManagement />
      case 'bookings':
        return <BookingsManagement />
      case 'reviews':
        return <ReviewsManagement />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout
        currentPage={currentPage}
        onPageChange={handlePageChange}
        title={getPageTitle(currentPage)}
      >
        {renderPage()}
      </AdminLayout>
    </ProtectedRoute>
  )
}
