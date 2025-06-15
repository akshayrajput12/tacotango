import React from 'react'
import { motion } from 'framer-motion'
import { useQuickOverview, useQuickActionData } from '../../hooks/useDashboard'
import logoImage from '../../assets/logo.png'

interface AdminSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onToggle: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onPageChange,
  isOpen,
  onToggle
}) => {
  const { overview, loading: overviewLoading } = useQuickOverview()
  const { data: quickActionData, loading: actionLoading } = useQuickActionData()
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview & Analytics',
      badge: null
    },
    {
      id: 'events',
      label: 'Events',
      icon: '🎉',
      description: 'Manage Events & Workshops',
      badge: '3'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: '🍽️',
      description: 'Food & Beverage Items',
      badge: null
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: '📸',
      description: 'Social Media Posts',
      badge: '2'
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: '🖼️',
      description: 'Photo Collections',
      badge: null
    },
    {
      id: 'offers',
      label: 'Special Offers',
      icon: '🎁',
      description: 'Promotions & Discounts',
      badge: '1'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: '📅',
      description: 'Table Reservations',
      badge: quickActionData?.pendingReservations ? quickActionData.pendingReservations.toString() : null
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: '⭐',
      description: 'Customer Testimonials',
      badge: quickActionData?.pendingReviews ? quickActionData.pendingReviews.toString() : null
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div className="lg:block lg:relative lg:w-80">
        <motion.div
          initial={false}
          animate={{
            x: isOpen ? 0 : -320,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-0 h-full bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 w-80"
        >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <img
                  src={logoImage}
                  alt="Cafex Logo"
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span
                  className="text-xl font-bold block"
                  style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
                >
                  Cafex Admin
                </span>
                <span className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Management Panel
                </span>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {/* Quick Stats */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
                Quick Overview
              </h3>
              {overviewLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : overview ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {overview.activeEvents}
                    </div>
                    <div className="text-xs text-blue-600" style={{ fontFamily: 'Lato, sans-serif' }}>Active Events</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {overview.menuItems}
                    </div>
                    <div className="text-xs text-green-600" style={{ fontFamily: 'Lato, sans-serif' }}>Menu Items</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-orange-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {overview.pendingReservations}
                    </div>
                    <div className="text-xs text-orange-600" style={{ fontFamily: 'Lato, sans-serif' }}>Pending</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-purple-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {overview.totalReviews}
                    </div>
                    <div className="text-xs text-purple-600" style={{ fontFamily: 'Lato, sans-serif' }}>Reviews</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Unable to load overview
                </div>
              )}
            </div>

            {/* Main Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
                Main Menu
              </h3>
              <ul className="space-y-1">
                {menuItems.map((item, index) => (
                  <li key={item.id}>
                    <motion.button
                      onClick={() => {
                        onPageChange(item.id)
                        if (window.innerWidth < 1024) {
                          onToggle()
                        }
                      }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`text-xl transition-transform duration-200 ${
                          currentPage === item.id ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                          {item.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.label}</span>
                          <span className="text-xs text-gray-500 group-hover:text-gray-600">
                            {item.description}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          currentPage === item.id
                            ? 'bg-orange-200 text-orange-800'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
                Quick Actions
              </h3>
              {actionLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    onClick={() => onPageChange('events')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm flex items-center justify-between"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span>+ Add New Event</span>
                    {quickActionData?.upcomingEvents && quickActionData.upcomingEvents > 0 && (
                      <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                        {quickActionData.upcomingEvents}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => onPageChange('bookings')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span>📅 Pending Bookings</span>
                    {quickActionData?.pendingReservations && quickActionData.pendingReservations > 0 && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                        {quickActionData.pendingReservations}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => onPageChange('reviews')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span>⭐ Review Moderation</span>
                    {quickActionData?.pendingReviews && quickActionData.pendingReviews > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        {quickActionData.pendingReviews}
                      </span>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {/* System Status */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Lato, sans-serif' }}>
                <span className="text-gray-500">System Status</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Version Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                Cafex Admin Panel v2.1.0
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'Lato, sans-serif' }}>
                © 2024 Cafex. All rights reserved.
              </p>
            </div>

            {/* Collapse Button for Desktop */}
            <div className="hidden lg:block mt-3">
              <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-gray-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                ← Collapse Sidebar
              </motion.button>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </>
  )
}
