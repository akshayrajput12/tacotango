import React, { useState } from 'react'
import { motion } from 'framer-motion'

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: BookingStatus
  specialRequests?: string
  createdAt: string
}

interface BookingCardProps {
  booking?: Booking
  isEditing?: boolean
  onSave?: (booking: Booking) => void
  onCancel?: () => void
  index?: number
  isSelected?: boolean
  onSelect?: () => void
  onStatusChange?: (bookingId: string, status: BookingStatus) => void
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isEditing = false,
  onSave,
  onCancel,
  index = 0,
  isSelected = false,
  onSelect,
  onStatusChange
}) => {
  const [formData, setFormData] = useState({
    customerName: booking?.customerName || '',
    customerEmail: booking?.customerEmail || '',
    customerPhone: booking?.customerPhone || '',
    date: booking?.date || '',
    time: booking?.time || '',
    guests: booking?.guests || 2,
    status: booking?.status || 'pending' as BookingStatus,
    specialRequests: booking?.specialRequests || '',
    createdAt: booking?.createdAt || new Date().toISOString()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({
        id: booking?.id || Date.now().toString(),
        ...formData
      } as Booking)
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

  if (!isEditing && booking) {
    // Display mode - matches ReservationPage and BookingsManagement styling
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
          isSelected ? 'ring-2 ring-orange-500 border-orange-200' : 'border-gray-100'
        }`}
        onClick={onSelect}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 
                className="text-lg font-bold"
                style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
              >
                {booking.customerName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)} {booking.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                {booking.date} at {booking.time}
              </div>
              <div className="flex items-center">
                <span className="mr-2">👥</span>
                {booking.guests} guests
              </div>
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                {booking.customerEmail}
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                {booking.customerPhone}
              </div>
            </div>
            
            {booking.specialRequests && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                <span className="mr-2">💬</span>
                {booking.specialRequests}
              </div>
            )}
          </div>
          
          {onStatusChange && (
            <div className="flex flex-col gap-2 sm:w-32">
              <select
                value={booking.status}
                onChange={(e) => onStatusChange(booking.id, e.target.value as BookingStatus)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Booking timestamp */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </motion.div>
    )
  }

  // Edit mode - form that matches ReservationPage styling
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full h-full flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <h3 
          className="text-xl font-bold mb-6"
          style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
        >
          {booking ? 'Edit Booking' : 'New Table Reservation'}
        </h3>

        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Customer Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field-group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
                required
              />
            </div>

            <div className="field-group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>
        </div>

        {/* Reservation Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Reservation Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="field-group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
                required
              />
            </div>

            <div className="field-group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
                required
              />
            </div>

            <div className="field-group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Guests
              </label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="field-group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Special Requests (Optional)
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Any special requirements, dietary restrictions, or preferences..."
          />
        </div>

        {/* Status */}
        <div className="field-group">
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Booking Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BookingStatus }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {booking ? 'Update Booking' : 'Create Booking'}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
