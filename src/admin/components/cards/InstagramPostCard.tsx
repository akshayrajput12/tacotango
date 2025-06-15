import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { InstagramPost } from '../../../services/instagramService'
import { InstagramService } from '../../../services/instagramService'

interface InstagramPostCardProps {
  post?: InstagramPost
  isEditing?: boolean
  onSave?: (post: InstagramPost) => void
  onCancel?: () => void
  index?: number
}

export const InstagramPostCard: React.FC<InstagramPostCardProps> = ({
  post,
  isEditing = false,
  onSave,
  onCancel,
  index = 0
}) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    image: post?.image || '',
    caption: post?.caption || '',
    description: post?.description || '',
    instagramUrl: post?.instagramUrl || '',
    hashtags: post?.hashtags || [],
    scheduledDate: post?.scheduledDate || undefined,
    status: post?.status || 'draft' as InstagramPost['status'],
    likes: post?.likes || 0,
    comments: post?.comments || 0,
    featured: post?.featured || false,
    active: post?.active ?? true
  })

  const [imagePreview, setImagePreview] = useState(post?.image || '')
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

    // Validation: If status is scheduled, scheduledDate is required
    if (formData.status === 'scheduled' && (!formData.scheduledDate || formData.scheduledDate.trim() === '')) {
      alert('Please set a scheduled date and time for scheduled posts.')
      return
    }

    setUploading(true)

    try {
      let finalImagePath = formData.image

      // If user selected a file to upload
      if (selectedFile && uploadMethod === 'upload') {
        // Upload the file to Supabase storage
        const filePath = await InstagramService.uploadImage(selectedFile, post?.id)
        finalImagePath = filePath // Store the file path, not the full URL
      }

      // Prepare the Instagram post data
      const postData = {
        id: post?.id || crypto.randomUUID(),
        title: formData.title,
        caption: formData.caption,
        description: formData.description,
        image: finalImagePath,
        instagramUrl: formData.instagramUrl,
        hashtags: formData.hashtags.length > 0 ? formData.hashtags : ['#cafex'],
        scheduledDate: formData.scheduledDate,
        status: formData.status,
        likes: formData.likes,
        comments: formData.comments,
        featured: formData.featured,
        active: formData.active
      } as InstagramPost

      onSave(postData)
    } catch (error) {
      console.error('Error saving Instagram post:', error)
      alert('Failed to save Instagram post. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700'
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return '✅'
      case 'scheduled': return '⏰'
      case 'draft': return '📝'
      default: return '📝'
    }
  }

  if (!isEditing && post) {
    // Display mode - matches InstagramFeed component styling
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group border border-gray-100"
        style={{ minHeight: '400px' }}
      >
        <div className="relative">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title || "Instagram post"}
              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('Image failed to load:', post.image)
                e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
              }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">No Image</p>
              </div>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
              {getStatusIcon(post.status)} {post.status}
            </span>
          </div>

          {/* Admin overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold text-sm">{post.comments}</span>
                </div>
              </div>


            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
            {post.title}
          </h3>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2 flex-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            {post.caption}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {tag}
              </span>
            ))}
            {post.hashtags.length > 3 && (
              <span className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                +{post.hashtags.length - 3} more
              </span>
            )}
          </div>
          
          {post.status === 'scheduled' && post.scheduledDate && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
              📅 Scheduled: {new Date(post.scheduledDate).toLocaleDateString()} at {new Date(post.scheduledDate).toLocaleTimeString()}
            </div>
          )}
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
              Post Image:
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
                Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          {/* Image Preview - Instagram square format */}
          {imagePreview && (
            <div className="relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-md border border-gray-200 group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Status badge preview */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                  {getStatusIcon(formData.status)} {formData.status}
                </span>
              </div>

              {/* Instagram-style stats overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{formData.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-semibold">{formData.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Post title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Caption
          </label>
          <textarea
            value={formData.caption}
            onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Write your Instagram caption..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Description (for home page display)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="Detailed description for home page..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Instagram URL (optional)
          </label>
          <input
            type="url"
            value={formData.instagramUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="https://www.instagram.com/p/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            Hashtags (comma separated)
          </label>
          <input
            type="text"
            value={formData.hashtags.join(', ')}
            onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value.split(', ').filter(Boolean) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            style={{ fontFamily: 'Lato, sans-serif' }}
            placeholder="#coffee, #cafex, #barista, #latte"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as InstagramPost['status'] }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
              Scheduled Date & Time {formData.status === 'scheduled' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate && formData.scheduledDate.trim() !== ''
                ? new Date(formData.scheduledDate).toISOString().slice(0, 16)
                : ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                scheduledDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
              }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                formData.status === 'scheduled'
                  ? 'border-orange-300'
                  : 'border-gray-300'
              }`}
              style={{ fontFamily: 'Lato, sans-serif' }}
              required={formData.status === 'scheduled'}
            />
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              {formData.status === 'scheduled'
                ? 'Required for scheduled posts'
                : 'Only required if status is "Scheduled"'}
            </p>
          </div>
        </div>

        {formData.status === 'published' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                Likes
              </label>
              <input
                type="number"
                value={formData.likes}
                onChange={(e) => setFormData(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                Comments
              </label>
              <input
                type="number"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: 'Lato, sans-serif' }}
                min="0"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Featured Post (show on home page)
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
              Active Post
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
                post ? 'Update Post' : 'Create Post'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
