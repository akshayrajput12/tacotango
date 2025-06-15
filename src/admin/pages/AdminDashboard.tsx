import React from 'react'
import { motion } from 'framer-motion'
import { useDashboard } from '../../hooks/useDashboard'

export const AdminDashboard: React.FC = () => {
  const { stats, activity, loading, error, refetch } = useDashboard()

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats || !activity) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  // Dynamic stats configuration
  const dashboardStats = [
    {
      title: 'Total Events',
      value: stats.events.total,
      subtitle: `${stats.events.upcoming} upcoming`,
      icon: '🎉',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Menu Items',
      value: stats.menu.total,
      subtitle: `${stats.menu.available} available`,
      icon: '🍽️',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Reservations',
      value: stats.reservations.total,
      subtitle: `${stats.reservations.pending} pending`,
      icon: '📅',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      title: 'Customer Reviews',
      value: stats.reviews.total,
      subtitle: `${stats.reviews.averageRating.toFixed(1)}⭐ average`,
      icon: '⭐',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Instagram Posts',
      value: stats.instagram.total,
      subtitle: `${stats.instagram.published} published`,
      icon: '📸',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      title: 'Active Offers',
      value: stats.offers.active,
      subtitle: `${stats.offers.total} total offers`,
      icon: '🎁',
      color: 'bg-yellow-100 text-yellow-700'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
        >
          Welcome to TacoTango Admin Panel
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
          Manage your restaurant's content, bookings, and operations from this central dashboard.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <h3 
              className="text-2xl font-bold mb-1"
              style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
            >
              {stat.value}
            </h3>
            <p className="text-gray-900 font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              {stat.title}
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
              {stat.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Recent Reservations
          </h3>
          <div className="space-y-3">
            {activity.reservations.length > 0 ? (
              activity.reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {reservation.customerName}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {new Date(reservation.date).toLocaleDateString()} at {reservation.time} • {reservation.guests} guests
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent reservations</p>
            )}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Recent Reviews
          </h3>
          <div className="space-y-3">
            {activity.reviews.length > 0 ? (
              activity.reviews.map((review) => (
                <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {review.customerName}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">{'★'.repeat(review.rating)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                    "{review.reviewText}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent reviews</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {activity.events.length > 0 ? (
              activity.events.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {event.registered}/{event.capacity}
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      registered
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
