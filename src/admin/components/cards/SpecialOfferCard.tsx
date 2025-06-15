import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SpecialOffersService, type SpecialOffer } from '../../../services/specialOffersService'

interface SpecialOfferCardProps {
  offer?: SpecialOffer
  isEditing?: boolean
  onSave?: (offer: SpecialOffer) => void
  onCancel?: () => void
  index?: number
  onToggleStatus?: (offerId: string) => void
}

export const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
  offer,
  isEditing = false,
  onSave,
  onCancel,
  index = 0,
  onToggleStatus
}) => {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    discount: offer?.discount || '',
    image: offer?.image || '',
    timing: offer?.timing || '',
    validFrom: offer?.validFrom || '',
    validUntil: offer?.validUntil || '',
    terms: offer?.terms || [],
    popularItems: offer?.popularItems || [],
    bgColor: offer?.bgColor || 'bg-orange-50',
    borderColor: offer?.borderColor || 'border-orange-200',
    textColor: offer?.textColor || 'text-orange-800',
    buttonColor: offer?.buttonColor || 'bg-orange-600 hover:bg-orange-700',
    featured: offer?.featured || false,
    active: offer?.active ?? true,
    sortOrder: offer?.sortOrder || 0
  })

  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Update form data when offer prop changes
  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        image: offer.image,
        timing: offer.timing,
        validFrom: offer.validFrom,
        validUntil: offer.validUntil,
        terms: offer.terms,
        popularItems: offer.popularItems,
        bgColor: offer.bgColor,
        borderColor: offer.borderColor,
        textColor: offer.textColor,
        buttonColor: offer.buttonColor,
        featured: offer.featured,
        active: offer.active,
        sortOrder: offer.sortOrder
      })
      setImagePreview(offer.image)
    }
  }, [offer])

  // Update image preview when form data changes
  useEffect(() => {
    if (formData.image && formData.image.startsWith('http')) {
      setImagePreview(formData.image)
    }
  }, [formData.image])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, image: value }))
    if (value.startsWith('http')) {
      setImagePreview(value)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)')
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSave) return

    setUploading(true)

    try {
      let finalImagePath = formData.image

      // If user selected a file to upload
      if (selectedFile && uploadMethod === 'upload') {
        // Upload the file to Supabase storage
        const filePath = await SpecialOffersService.uploadImage(selectedFile, offer?.id)
        finalImagePath = filePath // Store the file path, not the full URL
      }

      // Prepare the special offer data
      const offerData = {
        id: offer?.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        discount: formData.discount,
        image: finalImagePath,
        timing: formData.timing,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        terms: formData.terms,
        popularItems: formData.popularItems,
        bgColor: formData.bgColor,
        borderColor: formData.borderColor,
        textColor: formData.textColor,
        buttonColor: formData.buttonColor,
        featured: formData.featured,
        active: formData.active,
        sortOrder: formData.sortOrder
      } as SpecialOffer

      onSave(offerData)
    } catch (error) {
      console.error('Error saving special offer:', error)
      alert('Failed to save special offer. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const isOfferExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  if (!isEditing && offer) {
    // Display mode - promotional card design
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-orange-200"
      >
        {/* Header with discount badge */}
        <div className="relative bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                {offer.title}
              </h3>
              <p className="text-orange-100 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                {offer.description}
              </p>
            </div>
            
            {/* Discount badge */}
            <div className="bg-white text-orange-600 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {offer.discount}
              </span>
              <span className="text-xs block text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                OFF
              </span>
            </div>
          </div>

          {/* Status badges */}
          <div className="absolute top-2 right-2 flex gap-2">
            {offer.active && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✅ Active
              </span>
            )}
            {!offer.active && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ⏸️ Inactive
              </span>
            )}
            {isOfferExpired(offer.validUntil) && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ⚠️ Expired
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Validity dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                Valid From
              </p>
              <p className="font-semibold text-gray-800" style={{ fontFamily: 'Lato, sans-serif' }}>
                {new Date(offer.validFrom).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                Valid Until
              </p>
              <p className="font-semibold text-gray-800" style={{ fontFamily: 'Lato, sans-serif' }}>
                {new Date(offer.validUntil).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Terms & Conditions:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              {offer.terms.map((term, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-orange-600">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          {onToggleStatus && (
            <div className="mt-4 flex gap-2">
              <motion.button
                onClick={() => onToggleStatus(offer.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm ${
                  offer.active
                    ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {offer.active ? 'Deactivate' : 'Activate'}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Edit mode - form that matches the promotional card layout
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
          {offer ? 'Edit Special Offer' : 'Create New Special Offer'}
        </h3>

        {/* Preview Card */}
        {(formData.title || formData.description || formData.discount) && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl overflow-hidden border border-orange-200 mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {formData.title || 'Offer Title'}
                  </h4>
                  <p className="text-orange-100 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {formData.description || 'Offer description'}
                  </p>
                </div>
                <div className="bg-white text-orange-600 px-3 py-2 rounded-full">
                  <span className="text-xl font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {formData.discount || '0%'}
                  </span>
                  <span className="text-xs block text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                    OFF
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                Preview of your special offer
              </p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Offer Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Happy Hour Special"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Discount
            </label>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="25% or BOGO or ₹100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Enjoy discounted beverages during our happy hour"
            required
          />
        </div>

        {/* Image Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Offer Image:
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                  uploadMethod === 'url'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('upload')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                  uploadMethod === 'upload'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Upload
              </button>
            </div>
          </div>

          {uploadMethod === 'url' ? (
            <input
              type="url"
              value={formData.image}
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter image URL"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
              />
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-md border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Preview
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Timing (optional)
          </label>
          <input
            type="text"
            value={formData.timing}
            onChange={(e) => setFormData(prev => ({ ...prev, timing: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Monday to Friday, 4:00 PM - 6:00 PM"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Valid From
            </label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Valid Until
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Popular Items (comma separated)
          </label>
          <input
            type="text"
            value={formData.popularItems.join(', ')}
            onChange={(e) => setFormData(prev => ({ ...prev, popularItems: e.target.value.split(', ').filter(Boolean) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Craft Beer, Wine Selection, Appetizer Platter, Nachos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Terms & Conditions (one per line)
          </label>
          <textarea
            value={formData.terms.join('\n')}
            onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value.split('\n').filter(Boolean) }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Valid Monday to Friday only&#10;Cannot be combined with other offers&#10;Minimum order value ₹200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Featured Offer (show on events page)
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Active Offer
                </span>
              </label>
            </div>
          </div>
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
              disabled={uploading}
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              } text-white`}
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {selectedFile ? 'Uploading...' : 'Saving...'}
                </div>
              ) : (
                offer ? 'Update Offer' : 'Create Offer'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
