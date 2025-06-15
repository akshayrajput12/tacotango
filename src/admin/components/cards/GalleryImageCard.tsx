import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { GalleryImage } from '../../../services/galleryService'
import { GalleryService } from '../../../services/galleryService'

interface GalleryImageCardProps {
  image?: GalleryImage
  isEditing?: boolean
  onSave?: (image: GalleryImage) => void
  onCancel?: () => void
  index?: number
  isSelected?: boolean
  onToggleSelect?: () => void
}

export const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
  image,
  isEditing = false,
  onSave,
  onCancel,
  isSelected = false,
  onToggleSelect
}) => {
  const [formData, setFormData] = useState({
    url: image?.url || '',
    title: image?.title || '',
    alt: image?.alt || '',
    description: image?.description || '',
    category: image?.category || 'Interior',
    tags: image?.tags || [],
    featured: image?.featured || false,
    active: image?.active ?? true,
    sortOrder: image?.sortOrder || 0,
    uploadDate: image?.uploadDate || new Date().toISOString().split('T')[0]
  })

  const [imagePreview, setImagePreview] = useState(image?.url || '')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, url: value }))
    setImagePreview(value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)')
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit for gallery images
        alert('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)

      // Create preview
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
      let finalImagePath = formData.url

      // If user selected a file to upload
      if (selectedFile && uploadMethod === 'upload') {
        // Upload the file to Supabase storage
        const filePath = await GalleryService.uploadImage(selectedFile, image?.id)
        finalImagePath = filePath // Store the file path, not the full URL
      }

      // Prepare the gallery image data
      const imageData = {
        id: image?.id || crypto.randomUUID(),
        title: formData.title,
        alt: formData.alt,
        description: formData.description,
        url: finalImagePath,
        category: formData.category,
        tags: formData.tags.length > 0 ? formData.tags : [],
        featured: formData.featured,
        active: formData.active,
        sortOrder: formData.sortOrder,
        uploadDate: formData.uploadDate
      } as GalleryImage

      onSave(imageData)
    } catch (error) {
      console.error('Error saving gallery image:', error)
      alert('Failed to save gallery image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!isEditing && image) {
    // Display mode - matches Gallery component exactly
    return (
      <motion.div
        key={image.id}
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
          },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          }
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group ${
          isSelected ? 'ring-2 ring-orange-500' : ''
        }`}
        onClick={onToggleSelect}
      >
        <motion.img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Selection checkbox - admin only */}
        {onToggleSelect && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {image.category}
          </span>
        </div>

        {/* Description overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          initial={{ y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium leading-tight mb-1">{image.title}</p>
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 2).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="text-xs text-white/80">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        </motion.div>

        {/* View icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Edit mode - form that matches the card layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full h-full flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Image Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Gallery Image:
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
              value={formData.url}
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter image URL"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
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
                Supported formats: JPEG, PNG, WebP, GIF. Max size: 10MB
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          {/* Image Preview - matches gallery card exactly */}
          {imagePreview && (
            <div className="relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-md border border-gray-200 group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Category badge preview */}
              <div className="absolute top-2 right-2">
                <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {formData.category}
                </span>
              </div>

              {/* Preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <p className="text-sm font-medium leading-tight mb-1">{formData.title || 'Image Title'}</p>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.slice(0, 2).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {formData.tags.length > 2 && (
                    <span className="text-xs text-white/80">
                      +{formData.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Image Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Enter image title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Alt Text (for accessibility)
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Describe the image..."
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
            placeholder="Detailed description of the image..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            <option value="Interior">Interior</option>
            <option value="Coffee">Coffee</option>
            <option value="Food">Food</option>
            <option value="Events">Events</option>
            <option value="Staff">Staff</option>
            <option value="Exterior">Exterior</option>
            <option value="Atmosphere">Atmosphere</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(', ').filter(Boolean) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="cozy, atmosphere, coffee, modern"
            style={{ fontFamily: 'Lato, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Upload Date
          </label>
          <input
            type="date"
            value={formData.uploadDate}
            onChange={(e) => setFormData(prev => ({ ...prev, uploadDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Featured Image (show on home page)
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
              Active Image
            </span>
          </label>
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
                image ? 'Update Image' : 'Upload Image'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
