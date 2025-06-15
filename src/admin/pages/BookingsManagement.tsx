import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminReservations } from '../../hooks/useReservations'
import { BookingCard } from '../components/cards'
import type { Reservation } from '../../services/reservationsService'

// Transform Reservation to Booking for compatibility
const transformReservationToBooking = (reservation: Reservation) => ({
  id: reservation.id,
  customerName: reservation.customerName,
  customerEmail: reservation.customerEmail,
  customerPhone: reservation.customerPhone,
  date: reservation.date,
  time: reservation.time,
  guests: reservation.guests,
  status: reservation.status,
  specialRequests: reservation.specialRequests,
  createdAt: reservation.createdAt
})

export const BookingsManagement: React.FC = () => {
  // Use the database hook
  const {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationsByStatus
  } = useAdminReservations()

  // Transform reservations to bookings for compatibility
  const bookings = reservations.map(transformReservationToBooking)

  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerPhone.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const handleStatusChange = async (bookingId: string, newStatus: any) => {
    try {
      await updateReservation(bookingId, { status: newStatus })
    } catch (error) {
      console.error('Error updating reservation status:', error)
    }
  }

  const handleAddBooking = () => {
    setSelectedBooking(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSaveBooking = async (booking: any) => {
    try {
      if (isEditing && selectedBooking) {
        // Update existing booking
        await updateReservation(selectedBooking.id, {
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          status: booking.status,
          specialRequests: booking.specialRequests
        })
      } else {
        // Add new booking
        await createReservation({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          status: booking.status || 'pending',
          specialRequests: booking.specialRequests,
          preferredContactMethod: 'email',
          marketingConsent: false
        })
      }
      setShowModal(false)
      setSelectedBooking(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving booking:', error)
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedBooking(null)
    setIsEditing(false)
  }

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteReservation(bookingId)
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null)
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'cancelled': return '❌'
      case 'completed': return '🎉'
      default: return '📅'
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Booking Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage customer reservations and table bookings
          </p>
        </div>

        <motion.button
          onClick={handleAddBooking}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Booking
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilter(status as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 capitalize ${
                  filter === status
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {getStatusIcon(status)} {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredBookings.map((booking, index) => (
            <div key={booking.id} className="relative group">
              <BookingCard
                booking={booking}
                isEditing={false}
                index={index}
                isSelected={selectedBooking?.id === booking.id}
                onSelect={() => setSelectedBooking(booking)}
                onStatusChange={handleStatusChange}
              />

              {/* Hover overlay with action buttons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleEditBooking(booking)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white shadow-lg text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                    title="Edit Booking"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.button>

                  <motion.button
                    onClick={() => handleDeleteBooking(booking.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 shadow-lg text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    title="Delete Booking"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredBookings.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">📅</div>
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
              >
                No bookings found
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                {searchTerm ? 'Try adjusting your search criteria.' : 'No bookings match the selected filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Booking Details Panel */}
        <div className="lg:col-span-1">
          {selectedBooking ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm sticky top-6"
            >
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
              >
                Booking Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Customer Name
                  </label>
                  <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {selectedBooking.customerName}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Email
                  </label>
                  <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {selectedBooking.customerEmail}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Phone
                  </label>
                  <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {selectedBooking.customerPhone}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Date
                    </label>
                    <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {selectedBooking.date}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Time
                    </label>
                    <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {selectedBooking.time}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Number of Guests
                  </label>
                  <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {selectedBooking.guests}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Status
                  </label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                    </span>
                  </div>
                </div>
                
                {selectedBooking.specialRequests && (
                  <div>
                    <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Special Requests
                    </label>
                    <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Booking Created
                  </label>
                  <p className="font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                    disabled={selectedBooking.status === 'confirmed'}
                  >
                    Confirm
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                    disabled={selectedBooking.status === 'cancelled'}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">👆</div>
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
              >
                Select a booking
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                Click on a booking to view detailed information.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3
                className="text-xl font-bold"
                style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
              >
                {isEditing ? 'Edit Booking' : 'New Table Reservation'}
              </h3>
              <motion.button
                onClick={handleCancelEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Modal Content with internal scroll */}
            <div className="flex-1 overflow-hidden">
              <BookingCard
                booking={selectedBooking}
                isEditing={true}
                onSave={handleSaveBooking}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
