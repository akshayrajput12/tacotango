import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../auth/supabaseClient'
import { MenuService } from '../../services/menuService'

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [itemCount, setItemCount] = useState<number>(0)
  const [bucketExists, setBucketExists] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      setStatus('checking')
      setError('')

      // Test database connection by fetching menu items
      const items = await MenuService.getAllMenuItems()
      setItemCount(items.length)

      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      if (bucketError) throw bucketError
      
      const menuImagesBucket = buckets.find(bucket => bucket.id === 'menu-images')
      setBucketExists(!!menuImagesBucket)

      setStatus('connected')
    } catch (err) {
      console.error('Database status check failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking': return 'text-yellow-600'
      case 'connected': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
        )
      case 'connected':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Database Status
        </h3>
        <motion.button
          onClick={checkDatabaseStatus}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Refresh
        </motion.button>
      </div>

      <div className="space-y-2">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`} style={{ fontFamily: 'Lato, sans-serif' }}>
            {status === 'checking' && 'Checking connection...'}
            {status === 'connected' && 'Connected to Supabase'}
            {status === 'error' && 'Connection failed'}
          </span>
        </div>

        {/* Menu Items Count */}
        {status === 'connected' && (
          <div className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{itemCount} menu items in database</span>
          </div>
        )}

        {/* Storage Bucket Status */}
        {status === 'connected' && (
          <div className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              Image storage: {bucketExists ? (
                <span className="text-green-600 font-medium">✓ Ready</span>
              ) : (
                <span className="text-red-600 font-medium">✗ Not found</span>
              )}
            </span>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
            <p className="text-xs text-red-700" style={{ fontFamily: 'Lato, sans-serif' }}>
              {error}
            </p>
            <p className="text-xs text-red-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Make sure you've run the SQL schema in your Supabase project.
            </p>
          </div>
        )}

        {/* Success Message */}
        {status === 'connected' && bucketExists && itemCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2">
            <p className="text-xs text-green-700" style={{ fontFamily: 'Lato, sans-serif' }}>
              ✓ Database is properly configured and ready for menu management!
            </p>
          </div>
        )}

        {/* Setup Instructions */}
        {status === 'connected' && (!bucketExists || itemCount === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-2">
            <p className="text-xs text-yellow-700" style={{ fontFamily: 'Lato, sans-serif' }}>
              ⚠️ Database connected but setup incomplete. Please run the SQL schema from supabase/schema.sql
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
