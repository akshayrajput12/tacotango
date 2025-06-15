import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Review } from '../../../services/reviewsService'
import { ReviewAvatar } from '../../../components/Avatar'

interface ReviewCardProps {
  review?: Review | null
  isEditing?: boolean
  onSave?: (review: Review) => void
  onCancel?: () => void
  index?: number
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isEditing = false,
  onSave,
  onCancel,
  index = 0
}) => {
  const [formData, setFormData] = useState({
    customerName: review?.customerName || '',
    customerEmail: review?.customerEmail || '',
    reviewText: review?.reviewText || '',
    rating: review?.rating || 5,
    status: review?.status || 'approved' as 'pending' | 'approved' | 'rejected',
    adminNotes: review?.adminNotes || '',
    featured: review?.featured || false,
    displayOrder: review?.displayOrder || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      const reviewData: Review = {
        id: review?.id || '',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || undefined,
        reviewText: formData.reviewText,
        rating: formData.rating,
        status: formData.status,
        adminNotes: formData.adminNotes || undefined,
        featured: formData.featured,
        displayOrder: formData.displayOrder,
        createdAt: review?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatarInitials: '',
        avatarColor: ''
      }
      onSave(reviewData)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅'
      case 'pending': return '⏳'
      case 'rejected': return '❌'
      default: return '📝'
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      return (
        <button
          key={index}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: starValue })) : undefined}
          className={`
            w-5 h-5 transition-colors duration-200
            ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}
            ${interactive ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'}
          `}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      )
    })
  }

  if (!isEditing && review) {
    // Display mode
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group border border-gray-100"
        style={{ minHeight: '300px' }}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header with avatar and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <ReviewAvatar 
                name={review.customerName}
                size="md"
                className="mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {review.customerName}
                </h3>
                <div className="flex items-center mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                {getStatusIcon(review.status)} {review.status}
              </span>
              {review.featured && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          {/* Review content */}
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed line-clamp-4" style={{ fontFamily: 'Lato, sans-serif' }}>
              "{review.reviewText}"
            </p>
          </div>

          {/* Footer with date and email */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span style={{ fontFamily: 'Lato, sans-serif' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {review.customerEmail && (
                <span style={{ fontFamily: 'Lato, sans-serif' }}>
                  {review.customerEmail}
                </span>
              )}
            </div>
            {review.adminNotes && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <strong>Admin Note:</strong> {review.adminNotes}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Edit mode - form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full h-full flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Avatar Preview */}
          {formData.customerName && (
            <div className="flex justify-center">
              <ReviewAvatar name={formData.customerName} size="lg" />
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Customer name..."
              required
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Customer Email (Optional)
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="customer@email.com"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Rating
            </label>
            <div className="flex items-center gap-1">
              {renderStars(formData.rating, true)}
              <span className="ml-2 text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                {formData.rating} star{formData.rating !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Review Text
            </label>
            <textarea
              value={formData.reviewText}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Customer review text..."
              required
            />
          </div>

          {/* Status and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
                min="0"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                Featured Review (show on homepage)
              </span>
            </label>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Admin Notes (Internal)
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Internal notes about this review..."
            />
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
              {review ? 'Update Review' : 'Create Review'}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default ReviewCard
