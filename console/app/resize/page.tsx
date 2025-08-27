'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { presetsAPI, transformAPI } from '@/lib/api'
import { Upload, Download, Image as ImageIcon } from 'lucide-react'
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

export default function ResizePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [width, setWidth] = useState('1080')
  const [height, setHeight] = useState('1920')
  const [format, setFormat] = useState('jpeg')
  const [quality, setQuality] = useState(85)
  const [aspectRatio, setAspectRatio] = useState('story')
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [showCrop, setShowCrop] = useState(false)
  const isMountedRef = useRef(true)

  // Aspect ratio presets
  const aspectRatioPresets = [
    { key: 'story', label: 'Story', ratio: '9:16', width: 1080, height: 1920 },
    { key: 'square', label: 'Square', ratio: '1:1', width: 1080, height: 1080 },
    { key: 'portrait', label: 'Portrait', ratio: '4:5', width: 1080, height: 1350 },
    { key: 'landscape', label: 'Landscape', ratio: '1.91:1', width: 1080, height: 566 },
  ]

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio)
    const preset = aspectRatioPresets.find(p => p.key === ratio)
    if (preset) {
      setWidth(preset.width.toString())
      setHeight(preset.height.toString())
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Separate cleanup for URLs
  useEffect(() => {
    return () => {
      try {
        if (originalImageUrl && typeof originalImageUrl === 'string') {
          URL.revokeObjectURL(originalImageUrl)
        }
      } catch (error) {
        console.warn('Error during originalImageUrl cleanup:', error)
      }
    }
  }, [originalImageUrl])

  // Fetch presets - must be before any conditional returns
  const { data: presetsData } = useQuery({
    queryKey: ['presets'],
    queryFn: () => presetsAPI.getAll(),
  })

  useEffect(() => {
    return () => {
      try {
        if (processedImage && typeof processedImage === 'string') {
          URL.revokeObjectURL(processedImage)
        }
      } catch (error) {
        console.warn('Error during processedImage cleanup:', error)
      }
    }
  }, [processedImage])

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      setProcessedImage(null)
      
      // Create preview URL for original image
      const url = URL.createObjectURL(file)
      setOriginalImageUrl(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  })

  const handlePresetChange = (presetKey: string) => {
    const allPresets = presetsData?.data?.groups?.flatMap((group: PresetGroup) => group.presets) || []
    const preset = allPresets.find((p: Preset) => p.key === presetKey)
    if (preset) {
      setSelectedPreset(preset)
      setWidth(preset.w.toString())
      setHeight(preset.h.toString())
    }
  }

  const processImage = async () => {
    if (!selectedFile || !width || !height) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('width', width)
      formData.append('height', height)
      formData.append('fmt', format)
      formData.append('quality', quality.toString())
      formData.append('fit', 'cover')
      formData.append('bg_color', '#FFFFFF')
      formData.append('strip_metadata', 'true')

      const response = await transformAPI.resize(formData)
      
      // Convert blob to data URL
      const blob = new Blob([response.data], { type: `image/${format}` })
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)
    } catch (error) {
      console.error('Processing error:', error)
      alert('Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = `processed.${format}`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Image Area */}
        <div className="flex-1 flex flex-col">
          {!selectedFile ? (
            // Upload Area
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-400 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="mb-6">
                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Drag and drop an image or <span className="text-blue-600 cursor-pointer">browse</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    File must be JPEG, JPG, PNG or WEBP and up to 40MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Image Display Area
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="relative max-w-full max-h-full">
                                     <img
                     src={originalImageUrl || ''}
                     alt="Original"
                     className="max-w-full max-h-full object-contain"
                     style={{ 
                       transform: `scale(${zoom})`,
                       transformOrigin: 'center',
                       imageRendering: 'auto'
                     }}
                   />
                  {showCrop && (
                    <div 
                      className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
                      style={{
                        left: `${crop.x}%`,
                        top: `${crop.y}%`,
                        width: `${crop.width}%`,
                        height: `${crop.height}%`
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Zoom and Crop Controls */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Zoom and Crop</span>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCrop(!showCrop)}
                  >
                    {showCrop ? 'Hide Crop' : 'Show Crop'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Resize image</h1>
            <p className="text-gray-600">Change the dimensions of any photo.</p>
          </div>

          {selectedFile && (
            <div className="space-y-6">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect ratio</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {aspectRatioPresets.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => handleAspectRatioChange(preset.key)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        aspectRatio === preset.key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.label}</div>
                      <div className="text-xs text-gray-500">{preset.ratio}</div>
                      <div className="text-xs text-gray-400">{preset.width} × {preset.height}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Width"
                      className="text-sm"
                    />
                  </div>
                  <div className="mt-6">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      🔒
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {width} × {height} pixels
                </div>
              </div>

              {/* Reset Button */}
              <Button variant="outline" className="w-full">
                Reset
              </Button>

              {/* Size Information */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original size:</span>
                  <span className="font-medium">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compressed size:</span>
                  <span className="font-medium">
                    {processedImage ? `${Math.round((selectedFile.size / 1024) * 0.4).toFixed(0)} KB` : '--'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={processImage}
                  disabled={!selectedFile || !width || !height || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : 'Download'}
                </Button>
                <Button variant="outline" className="w-full">
                  Open in Creative Portal
                </Button>
              </div>

              {/* Rate Us */}
              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  ⭐ Rate us
                </Button>
              </div>
            </div>
          )}

          {!selectedFile && (
            <div className="text-center text-gray-500 mt-8">
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Display */}
      {processedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resized Image</h3>
              <button
                onClick={() => setProcessedImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center">
              <img
                src={processedImage}
                alt="Processed"
                className="max-w-full max-h-96 object-contain rounded-lg"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setProcessedImage(null)}
              >
                Close
              </Button>
              <Button onClick={downloadImage} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
