'use client'

import { useAuth } from '@/contexts/auth-context'
import { LogOut } from 'lucide-react'

export function NavigationHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900">Creative Portal</h1>
          <nav className="flex space-x-6">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="/resize" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resize
            </a>
            <a href="/presets" className="text-gray-600 hover:text-gray-900 transition-colors">
              Presets
            </a>
            <a href="/compress" className="text-gray-600 hover:text-gray-900 transition-colors">
              Compress
            </a>
            <a href="/batch" className="text-gray-600 hover:text-gray-900 transition-colors">
              Batch
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          <button
            onClick={() => {
              console.log('Logout button clicked from header')
              logout()
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}


