import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminInstagram } from '../../hooks/useInstagram'
import { InstagramPostCard } from '../components/cards'

import type { InstagramPost } from '../../services/instagramService'

export const InstagramManagement: React.FC = () => {
  // Use the database hook
  const {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPostsByStatus,
    refetch
  } = useAdminInstagram()



  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all')
  const [isEditing, setIsEditing] = useState(false)

  const filteredPosts = getPostsByStatus(filter)

  const handleAddPost = () => {
    setSelectedPost(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditPost = (post: InstagramPost) => {
    setSelectedPost(post)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSavePost = async (post: InstagramPost) => {
    try {
      if (isEditing && selectedPost) {
        // Update existing post
        await updatePost(selectedPost.id, post)
      } else {
        // Add new post
        await createPost(post)
      }
      setShowModal(false)
      setSelectedPost(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving Instagram post:', error)
      // You could add a toast notification here
    }
  }

  const handleCancelEdit = () => {
    setShowModal(false)
    setSelectedPost(null)
    setIsEditing(false)
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)
    } catch (error) {
      console.error('Error deleting Instagram post:', error)
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
            Instagram Posts Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage your Instagram content and scheduling
          </p>
        </div>
        
        <motion.button
          onClick={handleAddPost}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          + Create New Post
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['all', 'published', 'scheduled', 'draft'].map((status) => (
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
              {getStatusIcon(status)} {status} ({status === 'all' ? posts.length : posts.filter(p => p.status === status).length})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {filter === 'all' ? 'No Instagram posts yet' : `No ${filter} posts`}
            </h3>
            <p className="text-gray-500 mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
              {filter === 'all'
                ? 'Create your first Instagram post to get started'
                : `No posts with ${filter} status found`
              }
            </p>
            {filter === 'all' && (
              <motion.button
                onClick={handleAddPost}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                + Create Your First Post
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post, index) => (
          <div key={post.id} className="relative group">
            <InstagramPostCard
              post={post}
              isEditing={false}
              index={index}
            />

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex flex-col justify-between p-3">
              {/* Top actions */}
              <div className="flex justify-end">
                <motion.button
                  onClick={() => handleEditPost(post)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                  title="Edit Post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
              </div>

              {/* Bottom actions */}
              <div className="flex justify-center">
                <motion.button
                  onClick={() => handleDeletePost(post.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500/90 backdrop-blur-sm shadow-lg text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                  title="Delete Post"
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
                {isEditing ? 'Edit Instagram Post' : 'Create New Instagram Post'}
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
              <InstagramPostCard
                post={selectedPost}
                isEditing={true}
                onSave={handleSavePost}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
