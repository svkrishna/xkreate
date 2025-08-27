'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export default function BatchPage() {
  const { user, loading } = useAuth()
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Batch Processing</h1>
          <p className="text-gray-600 mt-2">Process multiple images at once</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This feature is under development. You'll be able to process multiple images in batch with different presets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Features planned:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Upload multiple images</li>
              <li>Apply different presets to each image</li>
              <li>Batch resize and format conversion</li>
              <li>Download as ZIP archive</li>
              <li>Progress tracking</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


