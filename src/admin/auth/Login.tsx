import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from './AuthProvider'
import logoImage from '../../assets/logo.png'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      // Handle signup
      const { supabase } = await import('../auth/supabaseClient')
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        // Show success message
        alert('Account created successfully! Please check your email for verification, then sign in.')
      }
    } else {
      // Handle signin
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCFAF7' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <img
              src={logoImage}
              alt="Cafex Logo"
              className="w-10 h-10 object-contain"
            />
            <span 
              className="text-2xl font-bold"
              style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
            >
              Cafex Admin
            </span>
          </div>
        </div>

        {/* Form Title */}
        <div className="text-center mb-6">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            {isSignUp ? 'Create Admin Account' : 'Sign In to Admin Panel'}
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            {isSignUp ? 'Create a new admin account' : 'Access the Cafex management dashboard'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#96664F', fontFamily: 'Lato, sans-serif' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#96664F', fontFamily: 'Lato, sans-serif' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: 'Lato, sans-serif' }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
{loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </motion.button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an admin account?"}
          </p>
          <motion.button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setEmail('')
              setPassword('')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors duration-200"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            {isSignUp ? 'Sign In Instead' : 'Create New Account'}
          </motion.button>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                Supabase Authentication
              </p>
              <p className="text-xs text-blue-700" style={{ fontFamily: 'Lato, sans-serif' }}>
                This admin panel uses Supabase authentication. You need to create an account in the Supabase project or use existing credentials.
              </p>
              <div className="mt-2">
                <p className="text-xs text-blue-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                  <strong>To create an admin account:</strong><br />
                  1. Go to your Supabase project dashboard<br />
                  2. Navigate to Authentication → Users<br />
                  3. Create a new user with admin privileges
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
