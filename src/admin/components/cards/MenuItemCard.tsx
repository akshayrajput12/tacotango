import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { MenuItem } from '../../../services/menuService'
import { MenuService } from '../../../services/menuService'

interface MenuItemCardProps {
  item?: MenuItem
  isEditing?: boolean
  onSave?: (item: MenuItem) => void
  onCancel?: () => void
  index?: number
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  isEditing = false,
  onSave,
  onCancel,
  index = 0
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || 'Coffee',
    image: item?.image || '',
    available: item?.available ?? true,
    featured: item?.featured ?? false,
    ingredients: item?.ingredients || [],
    prepTime: item?.prepTime || '3-5 mins',
    calories: item?.calories || 120,
    rating: item?.rating || 4.5
  })

  const [imagePreview, setImagePreview] = useState(item?.image || '')
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
        const filePath = await MenuService.uploadImage(selectedFile, item?.id)
        finalImagePath = filePath // Store the file path, not the full URL
      }

      // Prepare the menu item data
      const menuItemData = {
        id: item?.id || crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image: finalImagePath,
        available: formData.available,
        featured: formData.featured,
        ingredients: formData.ingredients.length > 0 ? formData.ingredients : ['Premium ingredients'],
        prepTime: formData.prepTime,
        calories: formData.calories,
        rating: formData.rating
      } as MenuItem

      onSave(menuItemData)
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert('Failed to save menu item. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!isEditing && item) {
    // Display mode - matches public MenuCard exactly
    return (
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 w-full"
        whileHover={{ y: -2, scale: 1.01 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Price badge - always visible */}
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            ₹{item.price}
          </div>

          {/* Mobile info overlay - always visible on small screens */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:hidden">
            <div className="text-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">⏱ {item.prepTime}</span>
                <span className="font-semibold">🔥 {item.calories} cal</span>
              </div>
            </div>
          </div>

          {/* Desktop hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />

          {/* Desktop hover details */}
          <div className="absolute inset-0 p-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
            <div className="bg-white/95 backdrop-blur-sm rounded-md p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-600">⏱ {item.prepTime}</span>
                <span className="text-xs font-semibold text-green-600">🔥 {item.calories} cal</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-800">Rating:</p>
                <div className="flex items-center">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-current' : 'fill-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {item.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </span>
            )}
            {!item.available && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Unavailable
              </span>
            )}
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
            {item.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'Lato, sans-serif' }}>
            {item.description}
          </p>
          
          {/* Ingredients */}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.ingredients?.slice(0, 2).map((ingredient, idx) => (
              <span 
                key={idx}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {ingredient}
              </span>
            ))}
            {item.ingredients && item.ingredients.length > 2 && (
              <span className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
                +{item.ingredients.length - 2} more
              </span>
            )}
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
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 w-full h-full flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Image Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Image:
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Enter image URL"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
            <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                ₹{formData.price}
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            style={{ fontFamily: 'Lato, sans-serif' }}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <option value="Coffee">Coffee</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Drinks">Drinks</option>
              <option value="Pastries">Pastries</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Prep Time
            </label>
            <input
              type="text"
              value={formData.prepTime}
              onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="3-5 mins"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Calories
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Ingredients (comma separated)
          </label>
          <input
            type="text"
            value={formData.ingredients.join(', ')}
            onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value.split(', ').filter(Boolean) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            placeholder="Premium Arabica Beans, Steamed Milk, Natural Sweetener"
            style={{ fontFamily: 'Lato, sans-serif' }}
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
              className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Available</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Featured Item</span>
          </label>
        </div>

        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={uploading}
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm ${
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
                item ? 'Update Item' : 'Add Item'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
