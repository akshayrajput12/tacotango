import React from 'react'
import { generateAvatarInitials, generateAvatarColor } from '../services/reviewsService'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  initials?: string
  color?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl'
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  className = '', 
  initials: providedInitials,
  color: providedColor 
}) => {
  const initials = providedInitials || generateAvatarInitials(name)
  const backgroundColor = providedColor || generateAvatarColor(name)
  
  // Calculate text color based on background brightness
  const getTextColor = (bgColor: string): string => {
    // Remove # if present
    const hex = bgColor.replace('#', '')
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    
    // Return white for dark backgrounds, dark for light backgrounds
    return brightness > 128 ? '#374151' : '#ffffff'
  }

  const textColor = getTextColor(backgroundColor)

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex
        items-center
        justify-center
        font-semibold
        select-none
        transition-all
        duration-200
        ${className}
      `}
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: 'Raleway, sans-serif'
      }}
      title={name}
    >
      {initials}
    </div>
  )
}

// Specialized avatar for reviews with hover effects
export const ReviewAvatar: React.FC<AvatarProps & { 
  showHover?: boolean 
}> = ({ 
  name, 
  size = 'lg', 
  className = '', 
  showHover = true,
  ...props 
}) => {
  return (
    <Avatar
      name={name}
      size={size}
      className={`
        ${showHover ? 'hover:scale-110 hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    />
  )
}

// Avatar with rating stars overlay
export const RatedAvatar: React.FC<AvatarProps & { 
  rating: number
  showRating?: boolean
}> = ({ 
  name, 
  rating, 
  showRating = true, 
  size = 'lg',
  className = '',
  ...props 
}) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="relative inline-block">
      <Avatar
        name={name}
        size={size}
        className={className}
        {...props}
      />
      {showRating && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
        </div>
      )}
    </div>
  )
}

// Avatar grid for multiple reviewers
export const AvatarGroup: React.FC<{
  names: string[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = ({ 
  names, 
  maxDisplay = 3, 
  size = 'md',
  className = '' 
}) => {
  const displayNames = names.slice(0, maxDisplay)
  const remainingCount = names.length - maxDisplay

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {displayNames.map((name, index) => (
          <Avatar
            key={index}
            name={name}
            size={size}
            className="border-2 border-white shadow-sm"
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full
              bg-gray-100
              border-2
              border-white
              flex
              items-center
              justify-center
              text-gray-600
              font-medium
              shadow-sm
            `}
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}

export default Avatar
