'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Settings, Palette, Download, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tools = [
    {
      title: 'Resize',
      description: 'Resize and crop images to specific dimensions',
      icon: Image,
      href: '/resize',
      color: 'bg-blue-500',
    },
    {
      title: 'Compress & Convert',
      description: 'Optimize images and convert between formats',
      icon: Settings,
      href: '/compress',
      color: 'bg-green-500',
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple images at once',
      icon: Download,
      href: '/batch',
      color: 'bg-purple-500',
    },
    {
      title: 'Presets Library',
      description: 'Browse and use predefined image presets',
      icon: Palette,
      href: '/presets',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creative Portal</h1>
            <p className="text-gray-600 mt-2">Professional image processing tools</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={() => {
                console.log('Logout button clicked')
                logout()
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${tool.color}`}>
                      <tool.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
