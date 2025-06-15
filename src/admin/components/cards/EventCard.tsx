import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Event } from '../../../services/eventsService'
import { EventsService } from '../../../services/eventsService'

interface EventCardProps {
  event?: Event
  isEditing?: boolean
  onSave?: (event: Event) => void
  onCancel?: () => void
  index?: number
  layout?: 'grid' | 'featured'
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isEditing = false,
  onSave,
  onCancel,
  index = 0,
  layout = 'grid'
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    image: event?.image || '',
    status: event?.status || 'upcoming' as Event['status'],
    capacity: event?.capacity || 50,
    registered: event?.registered || 0,
    price: event?.price || '₹500',
    category: event?.category || 'Workshop',
    type: event?.type || 'Workshop',
    featured: event?.featured || false,
    active: event?.active ?? true
  })

  const [imagePreview, setImagePreview] = useState(event?.image || '')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, image: value }))
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

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB')
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
      let finalImagePath = formData.image

      // If user selected a file to upload
      if (selectedFile && uploadMethod === 'upload') {
        // Upload the file to Supabase storage
        const filePath = await EventsService.uploadImage(selectedFile, event?.id)
        finalImagePath = filePath // Store the file path, not the full URL
      }

      // Prepare the event data
      const eventData = {
        id: event?.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        image: finalImagePath,
        status: formData.status,
        capacity: formData.capacity,
        registered: formData.registered,
        price: formData.price,
        category: formData.category,
        type: formData.type,
        featured: formData.featured,
        active: formData.active
      } as Event

      onSave(eventData)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700'
      case 'ongoing': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!isEditing && event) {
    if (layout === 'featured') {
      // Featured layout - matches UpcomingEvents component exactly
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          {/* Event Image */}
          <div className="lg:w-1/2">
            <div className="relative h-64 sm:h-80 lg:h-72 xl:h-80">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {formatDate(event.date)}
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-orange-600 text-sm sm:text-base font-medium mb-2">
                {event.category}
              </p>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {event.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                {event.description}
              </p>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  🕒 {event.time}
                </span>
                <span className="flex items-center gap-1">
                  🎫 {event.price}
                </span>
                <span className="flex items-center gap-1">
                  👥 {event.registered}/{event.capacity}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )
    }

    // Grid layout - matches admin EventsManagement cards
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
          <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {formatDate(event.date)}
          </div>
        </div>
        
        <div className="p-6">
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            {event.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
              <span className="mr-2">📅</span>
              {event.date} at {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
              <span className="mr-2">👥</span>
              {event.registered}/{event.capacity} registered
            </div>
            <div className="flex items-center text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
              <span className="mr-2">🎫</span>
              {event.price}
            </div>
          </div>
        </div>
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
              Event Image:
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
            <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {formatDate(formData.date)}
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
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
              <option value="Workshop">Workshop</option>
              <option value="Live Music">Live Music</option>
              <option value="Literature Event">Literature Event</option>
              <option value="Special Event">Special Event</option>
              <option value="Tasting">Tasting</option>
              <option value="Community">Community</option>
            </select>
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
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Price
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="₹500"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Type (Display)
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Music, Workshop, Literature"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Event['status'] }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Registered
            </label>
            <input
              type="number"
              value={formData.registered}
              onChange={(e) => setFormData(prev => ({ ...prev, registered: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
              min="0"
              max={formData.capacity}
            />
          </div>
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
              Featured Event (show on home page)
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
              Active Event
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
                event ? 'Update Event' : 'Create Event'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
