'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit2, LogOut, ImageIcon } from 'lucide-react'

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    console.log('[v0] Patient detail page - params.id:', params.id)
    
    if (params.id) {
      const allPatients = localStorage.getItem('patients')
      if (allPatients) {
        try {
          const patientsData = JSON.parse(allPatients)
          console.log('[v0] All patients from storage:', patientsData)
          
          const foundPatient = patientsData.find((p: any) => p.id === params.id)
          console.log('[v0] Found patient:', foundPatient)
          
          setPatient(foundPatient || null)
        } catch (error) {
          console.log('[v0] Error parsing patients:', error)
          setPatient(null)
        }
      } else {
        console.log('[v0] No patients in localStorage')
        setPatient(null)
      }
    }
    setLoading(false)
  }, [params.id, router, isClient])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (!isClient || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!patient) return (
    <div className="min-h-screen bg-background">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/patients">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive font-semibold mb-2">Patient not found</p>
            <p className="text-muted-foreground mb-4">The patient with ID "{params.id}" does not exist.</p>
            <Link href="/patients">
              <Button>Go Back to Patient List</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
          <Link href={`/patients/${patient.id}/edit`}>
            <Button>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-semibold">{patient.age} years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="font-semibold">{patient.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{patient.location || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="font-semibold">{patient.height} cm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-semibold">{patient.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blood Pressure</p>
                <p className={`font-semibold ${patient.bloodPressure.split('/')[0] > 140 ? 'text-destructive' : ''}`}>
                  {patient.bloodPressure} mmHg
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metabolic Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metabolic Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Glucose Level</p>
                <p className={`font-semibold ${patient.glucose > 200 ? 'text-destructive' : ''}`}>
                  {patient.glucose} mg/dL
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="font-semibold">{patient.bmi.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Insulin</p>
                <p className="font-semibold">{patient.insulin} IU/mL</p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Medical */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Medical Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cholesterol</span>
                <span className="font-semibold">{patient.chol || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HDL</span>
                <span className="font-semibold">{patient.hdl || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HbA1c</span>
                <span className="font-semibold">{patient.glyhb || 'N/A'}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lifestyle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Smoker</span>
                <span className="font-semibold">{patient.smoker ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Physical Activity</span>
                <span className="font-semibold">{patient.physActivity ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Heavy Alcohol</span>
                <span className="font-semibold">{patient.hvyAlcoholConsump ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stroke</span>
                <span className="font-semibold">{patient.stroke ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Heart Disease</span>
                <span className="font-semibold">{patient.heartDiseaseorAttack ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diabetes Outcome</span>
                <span className="font-semibold">{patient.outcome ? 'Positive' : 'Negative'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images Section */}
        {patient.images && patient.images.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Retinopathy Images</CardTitle>
              <Link href={`/patients/${patient.id}/images`}>
                <Button variant="outline" size="sm">
                  Manage Images
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {patient.images.map((img: any, idx: number) => (
                  <div key={idx} className="border border-border rounded-lg p-2">
                    <p className="text-xs font-semibold text-primary mb-2">{img.type}</p>
                    <img 
                      src={img.preview || "/placeholder.svg?height=100&width=100&query=retinopathy"} 
                      alt={img.type}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No images state with button to add */}
        {(!patient.images || patient.images.length === 0) && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Retinopathy Images</CardTitle>
              <Link href={`/patients/${patient.id}/images`}>
                <Button size="sm">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No retinopathy images uploaded yet
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
