import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminMenu } from '../../hooks/useMenu'
import { MenuItemCard } from '../components/cards'
import type { MenuItem } from '../../services/menuService'

export const MenuManagement: React.FC = () => {
  // Use the database hook
  const {
    menuItems,
    loading,
    error,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAvailableCategories
  } = useAdminMenu()

  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [isEditing, setIsEditing] = useState(false)

  const categories = ['all', ...getAvailableCategories()]

  const filteredItems = menuItems.filter(item =>
    filter === 'all' || item.category === filter
  )

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSaveItem = async (item: MenuItem) => {
    try {
      if (isEditing && selectedItem) {
        // Update existing item
        await updateMenuItem(selectedItem.id, item)
      } else {
        // Add new item
        await createMenuItem(item)
      }
      setShowModal(false)
      setSelectedItem(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving menu item:', error)
      // You could add a toast notification here
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedItem(null)
    setIsEditing(false)
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId)
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  const toggleAvailability = async (itemId: string) => {
    try {
      const item = menuItems.find(item => item.id === itemId)
      if (item) {
        await updateMenuItem(itemId, { available: !item.available })
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const toggleFeatured = async (itemId: string) => {
    try {
      const item = menuItems.find(item => item.id === itemId)
      if (item) {
        await updateMenuItem(itemId, { featured: !item.featured })
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
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
            Menu Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage your menu items and categories
          </p>
        </div>
        
        <motion.button
          onClick={handleAddItem}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          + Add Menu Item
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
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
              {category} ({category === 'all' ? menuItems.length : menuItems.filter(item => item.category === category).length})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="relative group">
            <MenuItemCard
              item={item}
              isEditing={false}
              index={index}
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex flex-col justify-between p-3">
              {/* Top actions */}
              <div className="flex justify-end">
                <motion.button
                  onClick={() => handleEditItem(item)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                  title="Edit Item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
              </div>

              {/* Bottom actions */}
              <div className="flex justify-center gap-2">
                <motion.button
                  onClick={() => toggleAvailability(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`shadow-lg p-2 rounded-full transition-colors duration-200 backdrop-blur-sm ${
                    item.available
                      ? 'bg-green-500/90 text-white hover:bg-green-600/90'
                      : 'bg-red-500/90 text-white hover:bg-red-600/90'
                  }`}
                  title={item.available ? 'Mark Unavailable' : 'Mark Available'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.available ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => toggleFeatured(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`shadow-lg p-2 rounded-full transition-colors duration-200 backdrop-blur-sm ${
                    item.featured
                      ? 'bg-yellow-500/90 text-white hover:bg-yellow-600/90'
                      : 'bg-gray-400/90 text-white hover:bg-gray-500/90'
                  }`}
                  title={item.featured ? 'Remove from Featured' : 'Mark as Featured'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={() => handleDeleteItem(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                  title="Delete Item"
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
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
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
              <MenuItemCard
                item={selectedItem}
                isEditing={true}
                onSave={handleSaveItem}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}


    </div>
  )
}
