import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminSpecialOffers } from '../../hooks/useSpecialOffers'
import { SpecialOfferCard } from '../components/cards'
import type { SpecialOffer } from '../../services/specialOffersService'

export const OffersManagement: React.FC = () => {
  // Use the database hook
  const {
    offers,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    getOffersByStatus
  } = useAdminSpecialOffers()

  const [showModal, setShowModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [isEditing, setIsEditing] = useState(false)

  const filteredOffers = filter === 'all' ? offers : getOffersByStatus(filter)

  const handleAddOffer = () => {
    setSelectedOffer(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditOffer = (offer: SpecialOffer) => {
    setSelectedOffer(offer)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSaveOffer = async (offer: SpecialOffer) => {
    try {
      if (isEditing && selectedOffer) {
        // Update existing offer
        await updateOffer(selectedOffer.id, offer)
      } else {
        // Add new offer
        await createOffer(offer)
      }
      setShowModal(false)
      setSelectedOffer(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving special offer:', error)
      // You could add a toast notification here
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedOffer(null)
    setIsEditing(false)
  }

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await deleteOffer(offerId)
    } catch (error) {
      console.error('Error deleting special offer:', error)
    }
  }

  const handleToggleStatus = async (offerId: string) => {
    try {
      const offer = offers.find(o => o.id === offerId)
      if (offer) {
        await updateOffer(offerId, { active: !offer.active })
      }
    } catch (error) {
      console.error('Error toggling offer status:', error)
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
            Special Offers Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage promotional offers and discounts
          </p>
        </div>
        
        <motion.button
          onClick={handleAddOffer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          + Create New Offer
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'inactive', 'expired'].map((status) => (
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
              {status} ({filteredOffers.length})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer, index) => (
          <div key={offer.id} className="relative group">
            <SpecialOfferCard
              offer={offer}
              isEditing={false}
              index={index}
              onToggleStatus={handleToggleStatus}
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEditOffer(offer)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white shadow-lg text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                  title="Edit Offer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => handleDeleteOffer(offer.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500 shadow-lg text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                  title="Delete Offer"
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

      {filteredOffers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🎯</div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            No offers found
          </h3>
          <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            {filter === 'all' ? 'Create your first special offer to get started.' : `No offers match the "${filter}" filter.`}
          </p>
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
                {isEditing ? 'Edit Special Offer' : 'Create New Special Offer'}
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
              <SpecialOfferCard
                offer={selectedOffer}
                isEditing={true}
                onSave={handleSaveOffer}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
