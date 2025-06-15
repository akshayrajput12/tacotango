import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminReviews, useReviewStats } from '../../hooks/useReviews'
import { ReviewCard } from '../components/cards'
import type { Review } from '../../services/reviewsService'

export const ReviewsManagement: React.FC = () => {
  // Use the database hooks
  const {
    reviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    rejectReview,
    toggleFeatured,
    getReviewsByStatus,
    refetch
  } = useAdminReviews()

  const { stats, loading: statsLoading } = useReviewStats()

  const [showModal, setShowModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReviews = getReviewsByStatus(filter).filter(review =>
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddReview = () => {
    setSelectedReview(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditReview = (review: Review) => {
    setSelectedReview(review)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSaveReview = async (review: Review) => {
    try {
      if (isEditing && selectedReview) {
        // Update existing review
        await updateReview(selectedReview.id, review)
      } else {
        // Add new review
        await createReview(review)
      }
      setShowModal(false)
      setSelectedReview(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving review:', error)
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedReview(null)
    setIsEditing(false)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId)
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  const handleApproveReview = async (reviewId: string) => {
    try {
      await approveReview(reviewId)
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleRejectReview = async (reviewId: string) => {
    const adminNotes = window.prompt('Reason for rejection (optional):')
    try {
      await rejectReview(reviewId, adminNotes || undefined)
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const handleToggleFeatured = async (reviewId: string, featured: boolean) => {
    try {
      await toggleFeatured(reviewId, featured)
    } catch (error) {
      console.error('Error toggling featured status:', error)
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

      {/* Stats Cards */}
      {!statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {stats.totalReviews}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>Pending</p>
                <p className="text-2xl font-bold text-yellow-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {stats.pendingReviews}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>Approved</p>
                <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {stats.approvedReviews}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>Avg Rating</p>
                <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {stats.averageRating.toFixed(1)}⭐
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Customer Reviews Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage customer reviews and testimonials
          </p>
        </div>
        
        <motion.button
          onClick={handleAddReview}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          + Add New Review
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews by customer name or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                {getStatusIcon(status)} {status} ({status === 'all' ? reviews.length : reviews.filter(r => r.status === status).length})
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {filter === 'all' ? 'No reviews yet' : `No ${filter} reviews`}
            </h3>
            <p className="text-gray-500 mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
              {filter === 'all'
                ? 'Create your first review to get started'
                : `No reviews with ${filter} status found`
              }
            </p>
            {filter === 'all' && (
              <motion.button
                onClick={handleAddReview}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                + Add Your First Review
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReviews.map((review, index) => (
            <div key={review.id} className="relative group">
              <ReviewCard
                review={review}
                isEditing={false}
                index={index}
              />

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex flex-col justify-between p-3">
                {/* Top actions */}
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <motion.button
                          onClick={() => handleApproveReview(review.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-green-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-green-600/90 transition-colors duration-200"
                          title="Approve Review"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => handleRejectReview(review.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-red-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                          title="Reject Review"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleToggleFeatured(review.id, !review.featured)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`backdrop-blur-sm shadow-lg p-2 rounded-full transition-colors duration-200 ${
                        review.featured 
                          ? 'bg-yellow-500/90 text-white hover:bg-yellow-600/90' 
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                      title={review.featured ? "Remove from Featured" : "Add to Featured"}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleEditReview(review)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                      title="Edit Review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={() => handleDeleteReview(review.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                    title="Delete Review"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                {isEditing ? 'Edit Review' : 'Create New Review'}
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
              <ReviewCard
                review={selectedReview}
                isEditing={true}
                onSave={handleSaveReview}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ReviewsManagement
