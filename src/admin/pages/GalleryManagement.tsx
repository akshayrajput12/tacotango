import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminGallery } from '../../hooks/useGallery'
import { GalleryImageCard } from '../components/cards'
import type { GalleryImage } from '../../services/galleryService'

export const GalleryManagement: React.FC = () => {
  // Use the database hook
  const {
    images,
    loading,
    error,
    createImage,
    updateImage,
    deleteImage,
    deleteImages,
    getImagesByCategory,
    getAvailableCategories
  } = useAdminGallery()

  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const categories = ['all', ...getAvailableCategories()]

  const filteredImages = filter === 'all' ? images : getImagesByCategory(filter)

  const handleAddImage = () => {
    setSelectedImage(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSaveImage = async (image: GalleryImage) => {
    try {
      if (isEditing && selectedImage) {
        // Update existing image
        await updateImage(selectedImage.id, image)
      } else {
        // Add new image
        await createImage(image)
      }
      setShowModal(false)
      setSelectedImage(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving gallery image:', error)
      // You could add a toast notification here
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedImage(null)
    setIsEditing(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId)
      setSelectedImages(selectedImages.filter(id => id !== imageId))
    } catch (error) {
      console.error('Error deleting gallery image:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedImages.length > 0) {
      try {
        await deleteImages(selectedImages)
        setSelectedImages([])
      } catch (error) {
        console.error('Error deleting gallery images:', error)
      }
    }
  }

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const selectAllImages = () => {
    setSelectedImages(filteredImages.map(img => img.id))
  }

  const deselectAllImages = () => {
    setSelectedImages([])
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
            Gallery Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage your photo gallery and image collections
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={handleAddImage}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            + Upload Images
          </motion.button>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 capitalize ${
                  filter === category
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {category} ({category === 'all' ? images.length : images.filter(img => img.category === category).length})
              </motion.button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                {selectedImages.length} selected
              </span>
              <motion.button
                onClick={handleBulkDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Delete Selected
              </motion.button>
              <motion.button
                onClick={deselectAllImages}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Deselect All
              </motion.button>
            </div>
          )}

          {selectedImages.length === 0 && filteredImages.length > 0 && (
            <motion.button
              onClick={selectAllImages}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Select All
            </motion.button>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image, index) => (
          <div key={image.id} className="relative group">
            <GalleryImageCard
              image={image}
              isEditing={false}
              index={index}
              isSelected={selectedImages.includes(image.id)}
              onToggleSelect={() => toggleImageSelection(image.id)}
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex flex-col justify-between p-3">
              {/* Top actions */}
              <div className="flex justify-end">
                <motion.button
                  onClick={() => handleEditImage(image)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                  title="Edit Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
              </div>

              {/* Bottom actions */}
              <div className="flex justify-center">
                <motion.button
                  onClick={() => handleDeleteImage(image.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                  title="Delete Image"
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
                {isEditing ? 'Edit Gallery Image' : 'Upload New Image'}
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
              <GalleryImageCard
                image={selectedImage}
                isEditing={true}
                onSave={handleSaveImage}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
