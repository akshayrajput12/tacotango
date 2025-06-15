import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSubmitReview } from '../hooks/useReviews'
import { Avatar } from './Avatar'

interface ReviewFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    reviewText: '',
    rating: 0
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const { submitReview, loading, error } = useSubmitReview()

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required'
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Review text is required'
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long'
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await submitReview({
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        reviewText: formData.reviewText.trim(),
        rating: formData.rating
      })

      setShowSuccess(true)
      setFormData({
        customerName: '',
        customerEmail: '',
        reviewText: '',
        rating: 0
      })

      setTimeout(() => {
        setShowSuccess(false)
        onSuccess?.()
      }, 3000)

    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }))
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      return (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-8 h-8 transition-colors duration-200
            ${starValue <= formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}
          `}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.button>
      )
    })
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-xl p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Thank You!
        </h3>
        <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
          Your review has been submitted and is pending approval. We appreciate your feedback!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 space-y-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Share Your Experience
        </h3>
        <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
          We'd love to hear about your visit to CafeX
        </p>
      </div>

      {/* Avatar Preview */}
      {formData.customerName && (
        <div className="flex justify-center">
          <Avatar name={formData.customerName} size="xl" />
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors
            ${errors.customerName ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Enter your name"
          style={{ fontFamily: 'Lato, sans-serif' }}
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address (Optional)
        </label>
        <input
          type="email"
          id="customerEmail"
          value={formData.customerEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors
            ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="your@email.com"
          style={{ fontFamily: 'Lato, sans-serif' }}
        />
        {errors.customerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
        )}
      </div>

      {/* Rating Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center gap-1">
          {renderStars()}
          {formData.rating > 0 && (
            <span className="ml-2 text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
              {formData.rating} star{formData.rating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Review Text Field */}
      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="reviewText"
          value={formData.reviewText}
          onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none
            ${errors.reviewText ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Tell us about your experience at CafeX..."
          style={{ fontFamily: 'Lato, sans-serif' }}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.reviewText ? (
            <p className="text-sm text-red-600">{errors.reviewText}</p>
          ) : (
            <p className="text-sm text-gray-500">Minimum 10 characters</p>
          )}
          <p className="text-sm text-gray-500">
            {formData.reviewText.length}/500
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-colors
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700'
            }
            text-white
          `}
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default ReviewForm
