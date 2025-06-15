import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Login } from '../auth/Login'
import { motion } from 'framer-motion'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCFAF7' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            Loading...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <>{children}</>
}
