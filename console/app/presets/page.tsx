'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { presetsAPI } from '@/lib/api'
import { Search, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { NavigationHeader } from '@/components/navigation-header'

interface Preset {
  key: string
  label: string
  w: number
  h: number
}

interface PresetGroup {
  key: string
  label: string
  presets: Preset[]
}

export default function PresetsPage() {
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

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  const { data: presetsData } = useQuery({
    queryKey: ['presets'],
    queryFn: () => presetsAPI.getAll(),
  })

  const groups = presetsData?.data?.groups || []

  const filteredGroups = groups.filter((group: PresetGroup) => {
    if (selectedGroup !== 'all' && group.key !== selectedGroup) {
      return false
    }
    
    if (searchTerm) {
      const groupMatches = group.label.toLowerCase().includes(searchTerm.toLowerCase())
      const presetMatches = group.presets.some(preset =>
        preset.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${preset.w}x${preset.h}`.includes(searchTerm)
      )
      return groupMatches || presetMatches
    }
    
    return true
  })

  const getGroupIcon = (groupKey: string) => {
    switch (groupKey) {
      case 'instagram':
      case 'facebook':
      case 'twitter':
      case 'youtube':
      case 'pinterest':
      case 'linkedin':
      case 'snapchat':
        return <Smartphone className="h-5 w-5" />
      case 'iab-display':
      case 'iab-video':
        return <Monitor className="h-5 w-5" />
      case 'video-players':
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presets Library</h1>
          <p className="text-gray-600 mt-2">Browse and discover image presets for different platforms</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search presets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {groups.map((group: PresetGroup) => (
                  <SelectItem key={group.key} value={group.key}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="space-y-8">
          {filteredGroups.map((group: PresetGroup) => (
            <div key={group.key}>
              <div className="flex items-center space-x-2 mb-4">
                {getGroupIcon(group.key)}
                <h2 className="text-xl font-semibold text-gray-900">{group.label}</h2>
                <span className="text-sm text-gray-500">({group.presets.length} presets)</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.presets.map((preset) => (
                  <Card key={preset.key} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{preset.label}</CardTitle>
                      <CardDescription className="text-xs">
                        {preset.w} × {preset.h} pixels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div 
                        className="w-full bg-gray-200 rounded border-2 border-gray-300"
                        style={{
                          aspectRatio: `${preset.w}/${preset.h}`,
                          maxHeight: '120px'
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          {preset.w}×{preset.h}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No presets found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
