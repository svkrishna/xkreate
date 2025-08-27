'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export default function CompressPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Compress & Convert</h1>
          <p className="text-gray-600 mt-2">Optimize images and convert between formats</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This feature is under development. You'll be able to compress images and convert between different formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Features planned:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Image compression with quality control</li>
              <li>Format conversion (JPEG, PNG, WebP, AVIF)</li>
              <li>Batch processing</li>
              <li>Metadata stripping</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


