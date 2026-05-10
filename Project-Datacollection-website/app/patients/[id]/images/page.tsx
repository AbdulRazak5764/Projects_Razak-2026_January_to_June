'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, LogOut, Upload, X, Download, Eye } from 'lucide-react'
import { imageDB } from '@/lib/indexedDB'

interface ImageData {
  id: string
  type: 'Fundus' | 'BloodVessel' | 'MicroAneurysms' | 'Hemorrhages' | 'OpticDisc'
  technique: string
  file?: File
  preview?: string
  uploadedAt?: string
  dataUrl?: string // Store the actual image data for viewing
}

const IMAGE_TYPES = {
  Fundus: {
    label: 'Fundus Image',
    description: 'Basic retina scan',
    techniques: ['Direct Observation', 'Indirect Observation', 'Digital Imaging']
  },
  BloodVessel: {
    label: 'Blood Vessel Analysis',
    description: 'For vessel segmentation',
    techniques: ['Image Matting', 'Markov Random Field', 'Matched Filtering', 'Line Tracking', 'Ridge Detection']
  },
  MicroAneurysms: {
    label: 'Micro-Aneurysms Scan',
    description: 'For detecting small aneurysms',
    techniques: ['Frangi-based Filters', 'Double-ring Filter', 'PCA', 'Template Matching', 'Blob Detection']
  },
  Hemorrhages: {
    label: 'Hemorrhages Detection',
    description: 'For bleeding analysis',
    techniques: ['2D Gaussian', 'Splat Classification', 'Watershed', 'Region Growing', 'Active Contours']
  },
  OpticDisc: {
    label: 'Optic Disc Analysis',
    description: 'For disc & cup segmentation',
    techniques: ['U-net', 'M-Net', 'Fuzzy C-mean', 'Circle Detection', 'Hough Transform']
  }
}

export default function PatientImagesPage() {
  const router = useRouter()
  const params = useParams()
  const [patient, setPatient] = useState<any>(null)
  const [images, setImages] = useState<ImageData[]>([])
  const [activeImageType, setActiveImageType] = useState<keyof typeof IMAGE_TYPES>('Fundus')
  const [selectedTechnique, setSelectedTechnique] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

      if (!isAuthenticated || !currentUser.email) {
        router.push('/login')
        return
      }

      const userKey = `patients_${currentUser.email}`
      const allPatients = localStorage.getItem(userKey)
      if (allPatients) {
        const patientsData = JSON.parse(allPatients)
        const foundPatient = patientsData.find((p: any) => p.id === params.id)
        if (foundPatient) {
          setPatient(foundPatient)

          // Load images from IndexedDB
          const savedImages = foundPatient.images || []
          const imagesWithData = await Promise.all(
            savedImages.map(async (img: any) => {
              const dbImage = await imageDB.getImage(img.id)
              return {
                ...img,
                dataUrl: dbImage?.dataUrl || img.dataUrl,
                preview: dbImage?.dataUrl || img.dataUrl
              }
            })
          )
          setImages(imagesWithData)
        }
      }
      setLoading(false)
    }

    loadImages()
  }, [params.id, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: keyof typeof IMAGE_TYPES) => {
    const file = e.target.files?.[0]
    if (file && selectedTechnique[imageType]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        const newImage: ImageData = {
          id: `${imageType}-${Date.now()}`,
          type: imageType,
          technique: selectedTechnique[imageType],
          file,
          preview: dataUrl,
          dataUrl: dataUrl, // Store the actual image data for viewing
          uploadedAt: new Date().toISOString()
        }

        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress > 100) progress = 100
          setUploadProgress(prev => ({ ...prev, [newImage.id]: progress }))
          if (progress === 100) clearInterval(interval)
        }, 300)

        setTimeout(() => {
          setImages(prev => [...prev, newImage])
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[newImage.id]
            return newProgress
          })
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = async (id: string) => {
    await imageDB.deleteImage(id)
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSaveImages = async () => {
    console.log('[DEBUG] Saving images...')
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    console.log('[DEBUG] Current user:', currentUser)

    if (!currentUser.email) {
      console.error('[DEBUG] No user email found!')
      return
    }

    const userKey = `patients_${currentUser.email}`
    console.log('[DEBUG] User key:', userKey)

    const allPatients = localStorage.getItem(userKey)
    console.log('[DEBUG] All patients from storage:', allPatients)

    if (allPatients) {
      const patientsData = JSON.parse(allPatients)
      const patientIndex = patientsData.findIndex((p: any) => p.id === params.id)
      console.log('[DEBUG] Patient index:', patientIndex)

      if (patientIndex !== -1) {
        // Save images to IndexedDB
        await Promise.all(images.map(img => imageDB.saveImage({
          id: img.id,
          type: img.type,
          technique: img.technique,
          uploadedAt: img.uploadedAt,
          dataUrl: img.dataUrl || ''
        })))

        patientsData[patientIndex].images = images.map(img => ({
          id: img.id,
          type: img.type,
          technique: img.technique,
          uploadedAt: img.uploadedAt
          // Removed dataUrl to avoid localStorage quota issues
        }))
        localStorage.setItem(userKey, JSON.stringify(patientsData))
        console.log('[DEBUG] Images saved successfully')
        router.push(`/patients/${params.id}`)
      } else {
        console.error('[DEBUG] Patient not found in data')
      }
    } else {
      console.error('[DEBUG] No patients data found in localStorage')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!patient) return <div className="min-h-screen flex items-center justify-center">Patient not found</div>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80">
            DiaCare Plus
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/patients/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Retinopathy Images</h1>
            <p className="text-muted-foreground">{patient.name} - Upload diagnostic images</p>
          </div>
        </div>

        {/* Image Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(IMAGE_TYPES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveImageType(key as keyof typeof IMAGE_TYPES)}
              className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeImageType === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {IMAGE_TYPES[activeImageType].label}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {IMAGE_TYPES[activeImageType].description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Technique Selection */}
                <div>
                  <label className="text-sm font-medium block mb-2">Select Analysis Technique</label>
                  <select
                    value={selectedTechnique[activeImageType] || ''}
                    onChange={(e) => setSelectedTechnique(prev => ({
                      ...prev,
                      [activeImageType]: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">-- Choose a technique --</option>
                    {IMAGE_TYPES[activeImageType].techniques.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>

                {/* Drag-Drop Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    selectedTechnique[activeImageType]
                      ? 'border-primary/50 bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10'
                      : 'border-muted cursor-not-allowed opacity-50'
                  }`}
                  onDragOver={(e) => {
                    if (selectedTechnique[activeImageType]) {
                      e.preventDefault()
                      e.currentTarget.classList.add('border-primary', 'bg-primary/20')
                    }
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/20')
                  }}
                  onDrop={(e) => {
                    if (selectedTechnique[activeImageType]) {
                      e.preventDefault()
                      const file = e.dataTransfer.files[0]
                      if (file && file.type.startsWith('image/')) {
                        const input = document.getElementById(`file-${activeImageType}`) as HTMLInputElement
                        const dt = new DataTransfer()
                        dt.items.add(file)
                        input.files = dt.files
                        handleFileChange({ target: { files: dt.files } } as any, activeImageType)
                      }
                    }
                  }}
                >
                  <label htmlFor={`file-${activeImageType}`} className="cursor-pointer">
                    <Upload className="w-10 h-10 text-primary/60 mx-auto mb-2" />
                    <p className="font-medium text-foreground">
                      {selectedTechnique[activeImageType]
                        ? 'Drag & drop your image here or click to browse'
                        : 'Please select a technique first'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported formats: PNG, JPG, GIF (Max 10MB)
                    </p>
                  </label>
                  <input
                    id={`file-${activeImageType}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, activeImageType)}
                    className="hidden"
                    disabled={!selectedTechnique[activeImageType]}
                  />
                </div>

                {/* Upload Progress */}
                {Object.entries(uploadProgress).map(([id, progress]) => (
                  <div key={id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Uploading...</span>
                      <span className="text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Uploaded Images */}
            {images.filter(img => img.type === activeImageType).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded for {IMAGE_TYPES[activeImageType].label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {images.filter(img => img.type === activeImageType).map(image => (
                      <div key={image.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded border border-border flex items-center justify-center cursor-pointer" onClick={() => {
                          if (image.dataUrl) {
                            const newWindow = window.open();
                            newWindow?.document.write(`<img src="${image.dataUrl}" style="max-width: 100%; max-height: 100vh;" />`);
                          }
                        }}>
                          {image.dataUrl ? (
                            <img src={image.dataUrl} alt={image.type} className="w-full h-full object-cover rounded" />
                          ) : image.preview ? (
                            <img src={image.preview} alt={image.type} className="w-full h-full object-cover rounded" />
                          ) : (
                            <div className="text-center">
                              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                                <span className="text-xs font-bold text-primary">{image.type.charAt(0)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Saved</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{image.type}</p>
                          <p className="text-xs text-muted-foreground">{image.technique}</p>
                          {image.uploadedAt && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(image.uploadedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (image.dataUrl) {
                                const link = document.createElement('a');
                                link.href = image.dataUrl;
                                link.download = `${image.type}_${image.technique}_${new Date(image.uploadedAt || '').toISOString().split('T')[0]}.png`;
                                link.click();
                              }
                            }}
                            className="text-primary hover:text-primary/80"
                            title="Download Image"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (image.dataUrl) {
                                const newWindow = window.open();
                                newWindow?.document.write(`<img src="${image.dataUrl}" style="max-width: 100%; max-height: 100vh;" />`);
                              }
                            }}
                            className="text-primary hover:text-primary/80"
                            title="View Image"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="text-destructive hover:text-destructive/80"
                            title="Delete Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(IMAGE_TYPES).map(([key]) => {
                  const count = images.filter(img => img.type === key).length
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm">{IMAGE_TYPES[key as keyof typeof IMAGE_TYPES].label}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        count > 0 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                      }`}>
                        {count}
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Images</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{images.length}</p>
              </CardContent>
            </Card>

            {/* All Uploaded Images */}
            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map(image => (
                      <div key={image.id} className="relative group">
                        <div className="w-full h-20 bg-muted rounded border border-border flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                              <span className="text-xs font-bold text-primary">{image.type.charAt(0)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Saved</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded transition-opacity flex items-center justify-center gap-2">
                          <p className="text-xs text-white text-center font-medium">{image.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href={`/patients/${params.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSaveImages} className="flex-1">
            Save Images
          </Button>
        </div>
      </main>
    </div>
  )
}
