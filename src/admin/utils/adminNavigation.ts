// Admin navigation utilities

export const adminRoutes = {
  dashboard: '/admin',
  events: '/admin/events',
  menu: '/admin/menu',
  instagram: '/admin/instagram',
  gallery: '/admin/gallery',
  offers: '/admin/offers',
  bookings: '/admin/bookings',
  reviews: '/admin/reviews',
} as const

export const navigateToAdmin = (page: string) => {
  const route = adminRoutes[page as keyof typeof adminRoutes] || adminRoutes.dashboard
  window.history.pushState(null, '', route)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const getPageTitle = (page: string): string => {
  const titles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    events: 'Events Management',
    menu: 'Menu Management',
    instagram: 'Instagram Posts',
    gallery: 'Gallery Management',
    offers: 'Special Offers',
    bookings: 'Booking Management',
    reviews: 'Reviews Management',
  }
  return titles[page] || 'Admin Panel'
}
