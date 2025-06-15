import React, { useState, useEffect } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
  title: string
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
  title
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auto-close sidebar on mobile when page changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [currentPage])

  // Set sidebar to open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          currentPage={currentPage}
          onPageChange={onPageChange}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader
            onMenuToggle={toggleSidebar}
            title={title}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <nav className="flex items-center space-x-2 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                <span className="text-gray-500">Admin</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium capitalize">{currentPage}</span>
              </nav>
            </div>

            {/* Page Content */}
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
