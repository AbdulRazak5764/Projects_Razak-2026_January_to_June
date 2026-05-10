'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, LogOut } from 'lucide-react'

export default function EditPatientPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    if (!isAuthenticated || !currentUser.email) {
      router.push('/login')
      return
    }

    if (params.id) {
      const userKey = `patients_${currentUser.email}`
      const allPatients = localStorage.getItem(userKey)
      if (allPatients) {
        const patientsData = JSON.parse(allPatients)
        const foundPatient = patientsData.find((p: any) => p.id === params.id)
        if (foundPatient) {
          setFormData(foundPatient)
        }
      }
    }
    setLoading(false)
  }, [params.id, router, isClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as any).checked : value
    }))
  }

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const bmi = (parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)).toFixed(1)
      setFormData((prev: any) => ({ ...prev, bmi }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const userKey = `patients_${currentUser.email}`

    const allPatients = localStorage.getItem(userKey)
    if (allPatients) {
      const patientsData = JSON.parse(allPatients)
      const index = patientsData.findIndex((p: any) => p.id === formData.id)
      if (index !== -1) {
        patientsData[index] = formData
        localStorage.setItem(userKey, JSON.stringify(patientsData))
        router.push(`/patients/${formData.id}`)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (!isClient || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!formData) return <div className="min-h-screen flex items-center justify-center">Patient not found</div>

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'medical', label: 'Medical Data' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ]

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/patients/${formData.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Patient - {formData.name}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6 pb-6">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Patient Name</Label>
                      <Input name="name" value={formData.name} onChange={handleChange} className="mt-1.5" />
                    </div>

                    <div>
                      <Label>Age</Label>
                      <Input name="age" type="number" value={formData.age} onChange={handleChange} className="mt-1.5" />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1.5"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <Label>Location</Label>
                      <Input name="location" value={formData.location} onChange={handleChange} className="mt-1.5" />
                    </div>

                    <div>
                      <Label>Height (cm)</Label>
                      <Input name="height" type="number" value={formData.height} onChange={handleChange} onBlur={calculateBMI} className="mt-1.5" />
                    </div>

                    <div>
                      <Label>Weight (kg)</Label>
                      <Input name="weight" type="number" value={formData.weight} onChange={handleChange} onBlur={calculateBMI} className="mt-1.5" />
                    </div>
                  </div>

                  {formData.gender === 'Female' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                      <div>
                        <Label>Pregnancies</Label>
                        <Input name="pregnancies" type="number" value={formData.pregnancies} onChange={handleChange} className="mt-1.5 bg-accent/5" />
                      </div>
                      <div>
                        <Label>Pregnancy History</Label>
                        <Input name="pregnancyHistory" value={formData.pregnancyHistory} onChange={handleChange} className="mt-1.5 bg-accent/5" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Medical Data Tab */}
              {activeTab === 'medical' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Glucose (mg/dL)</Label>
                      <Input name="glucose" type="number" value={formData.glucose} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Blood Pressure</Label>
                      <Input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Skin Thickness</Label>
                      <Input name="skinThickness" type="number" value={formData.skinThickness} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Insulin</Label>
                      <Input name="insulin" type="number" value={formData.insulin} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>BMI</Label>
                      <Input name="bmi" type="number" value={formData.bmi} onChange={handleChange} disabled className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Diabetes Pedigree</Label>
                      <Input name="diabetesPedigreeFunction" type="number" value={formData.diabetesPedigreeFunction} onChange={handleChange} className="mt-1.5" step="0.01" />
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Cholesterol</Label>
                      <Input name="chol" value={formData.chol} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>HDL</Label>
                      <Input name="hdl" value={formData.hdl} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Waist</Label>
                      <Input name="waist" value={formData.waist} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Hip</Label>
                      <Input name="hip" value={formData.hip} onChange={handleChange} className="mt-1.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Lifestyle Tab */}
              {activeTab === 'lifestyle' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="smoker" checked={formData.smoker} onChange={handleChange} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">Smoker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="physActivity" checked={formData.physActivity} onChange={handleChange} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">Physical Activity</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hvyAlcoholConsump" checked={formData.hvyAlcoholConsump} onChange={handleChange} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">Heavy Alcohol</span>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-6">
            <Link href={`/patients/${formData.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Update Patient
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
