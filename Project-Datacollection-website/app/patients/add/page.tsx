'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, LogOut } from 'lucide-react'

function generatePatientId() {
  return Math.random().toString(36).substring(2, 10)
}

export default function AddPatientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    location: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    pregnancies: '',
    pregnancyHistory: '',
    outcome: false,
    chol: '',
    stabGlu: '',
    hdl: '',
    ratio: '',
    glyhb: '',
    bp1s: '',
    bp1d: '',
    bp2s: '',
    bp2d: '',
    waist: '',
    hip: '',
    smoker: false,
    physActivity: false,
    fruits: false,
    veggies: false,
    hvyAlcoholConsump: false,
    stroke: false,
    heartDiseaseorAttack: false,
    anyHealthcare: false,
    noDocbcCost: false,
    genHlth: '',
    mentHlth: '',
    physHlth: '',
    prostateScrn: false,
  })

  const [activeTab, setActiveTab] = useState('personal')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as any).checked : value
    }))

    // Auto-calculate BMI when height or weight changes
    if (name === 'height' || name === 'weight') {
      setTimeout(() => calculateBMI(), 0) // Use setTimeout to ensure state is updated
    }
  }

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const bmi = (parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)).toFixed(1)
      setFormData(prev => ({ ...prev, bmi }))
    }
  }

  const validateTabData = (tabName: string) => {
    const newErrors: Record<string, string> = {}
    
    if (tabName === 'personal') {
      if (!formData.name.trim()) newErrors.name = 'Patient name is required'
      if (!formData.age || parseInt(formData.age) < 0) newErrors.age = 'Valid age is required'
    }
    
    if (tabName === 'medical') {
      if (!formData.glucose) newErrors.glucose = 'Glucose level is required'
      if (!formData.bloodPressure) newErrors.bloodPressure = 'Blood pressure is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tabs = ['personal', 'medical', 'advanced', 'lifestyle', 'images']
    const currentIndex = tabs.indexOf(activeTab)
    
    if (!validateTabData(activeTab)) {
      return
    }
    
    // If not the last tab, go to next tab
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    } else {
      // On Images tab (last tab), actually save the patient
      const patientId = generatePatientId()
      console.log('[v0] Creating patient with ID:', patientId)

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (!currentUser.email) {
        router.push('/login')
        return
      }

      const newPatient = {
        id: patientId,
        ...formData,
        age: parseInt(formData.age),
        glucose: parseFloat(formData.glucose),
        bmi: parseFloat(formData.bmi) || 0,
        dateCreated: new Date().toISOString(),
      }

      const userKey = `patients_${currentUser.email}`
      const allPatients = localStorage.getItem(userKey)
      const patients = allPatients ? JSON.parse(allPatients) : []
      patients.push(newPatient)
      localStorage.setItem(userKey, JSON.stringify(patients))

      console.log('[v0] Patient saved. Total patients:', patients.length)
      router.push('/patients')
    }
  }

  const handlePrevious = () => {
    const tabs = ['personal', 'medical', 'advanced', 'lifestyle', 'images']
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'medical', label: 'Medical Data' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'images', label: 'Images' },
  ]

  if (!isClient) return null

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
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
        </div>

        <form onSubmit={handleSave}>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab, idx) => (
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
                {idx + 1}. {tab.label}
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
                      <Label htmlFor="name">Patient Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="45"
                        value={formData.age}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                      {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <select
                        id="gender"
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
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        placeholder="170"
                        value={formData.height}
                        onChange={handleChange}
                        onBlur={calculateBMI}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={handleChange}
                        onBlur={calculateBMI}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  {formData.gender === 'Female' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border mt-4 bg-accent/5 p-4 rounded-md">
                      <div>
                        <Label htmlFor="pregnancies">Number of Pregnancies</Label>
                        <Input
                          id="pregnancies"
                          name="pregnancies"
                          type="number"
                          placeholder="0"
                          value={formData.pregnancies}
                          onChange={handleChange}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pregnancyHistory">Pregnancy History</Label>
                        <Input
                          id="pregnancyHistory"
                          name="pregnancyHistory"
                          placeholder="Details..."
                          value={formData.pregnancyHistory}
                          onChange={handleChange}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {formData.gender === 'Male' && (
                    <div className="pt-4 border-t border-border mt-4 bg-accent/5 p-4 rounded-md">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="prostateScrn"
                          checked={formData.prostateScrn}
                          onChange={handleChange}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm font-medium">Prostate Screening Done</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Medical Data Tab */}
              {activeTab === 'medical' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="glucose">Glucose Level (mg/dL) *</Label>
                      <Input
                        id="glucose"
                        name="glucose"
                        type="number"
                        placeholder="120"
                        value={formData.glucose}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                      {errors.glucose && <p className="text-xs text-destructive mt-1">{errors.glucose}</p>}
                    </div>

                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure (Systolic/Diastolic) *</Label>
                      <Input
                        id="bloodPressure"
                        name="bloodPressure"
                        placeholder="120/80"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                      {errors.bloodPressure && <p className="text-xs text-destructive mt-1">{errors.bloodPressure}</p>}
                    </div>

                    <div>
                      <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
                      <Input
                        id="skinThickness"
                        name="skinThickness"
                        type="number"
                        placeholder="20"
                        value={formData.skinThickness}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="insulin">Insulin (IU/mL)</Label>
                      <Input
                        id="insulin"
                        name="insulin"
                        type="number"
                        placeholder="100"
                        value={formData.insulin}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bmi">BMI</Label>
                      <Input
                        id="bmi"
                        name="bmi"
                        type="number"
                        placeholder="Auto-calculated"
                        value={formData.bmi}
                        onChange={handleChange}
                        disabled
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="diabetesPedigreeFunction">Diabetes Pedigree Function</Label>
                      <Input
                        id="diabetesPedigreeFunction"
                        name="diabetesPedigreeFunction"
                        type="number"
                        placeholder="0.5"
                        value={formData.diabetesPedigreeFunction}
                        onChange={handleChange}
                        className="mt-1.5"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="outcome"
                        checked={formData.outcome}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Diabetes Outcome Positive</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chol">Cholesterol</Label>
                      <Input
                        id="chol"
                        name="chol"
                        type="number"
                        placeholder="200"
                        value={formData.chol}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stabGlu">Stable Glucose</Label>
                      <Input
                        id="stabGlu"
                        name="stabGlu"
                        type="number"
                        placeholder="120"
                        value={formData.stabGlu}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hdl">HDL</Label>
                      <Input
                        id="hdl"
                        name="hdl"
                        type="number"
                        placeholder="50"
                        value={formData.hdl}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ratio">Ratio</Label>
                      <Input
                        id="ratio"
                        name="ratio"
                        type="number"
                        placeholder="4.0"
                        value={formData.ratio}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="glyhb">HbA1c (%)</Label>
                      <Input
                        id="glyhb"
                        name="glyhb"
                        type="number"
                        placeholder="6.5"
                        value={formData.glyhb}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="waist">Waist (cm)</Label>
                      <Input
                        id="waist"
                        name="waist"
                        type="number"
                        placeholder="90"
                        value={formData.waist}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hip">Hip (cm)</Label>
                      <Input
                        id="hip"
                        name="hip"
                        type="number"
                        placeholder="100"
                        value={formData.hip}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bp1s">BP 1st Systolic</Label>
                      <Input
                        id="bp1s"
                        name="bp1s"
                        type="number"
                        placeholder="120"
                        value={formData.bp1s}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bp1d">BP 1st Diastolic</Label>
                      <Input
                        id="bp1d"
                        name="bp1d"
                        type="number"
                        placeholder="80"
                        value={formData.bp1d}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bp2s">BP 2nd Systolic</Label>
                      <Input
                        id="bp2s"
                        name="bp2s"
                        type="number"
                        placeholder="120"
                        value={formData.bp2s}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bp2d">BP 2nd Diastolic</Label>
                      <Input
                        id="bp2d"
                        name="bp2d"
                        type="number"
                        placeholder="80"
                        value={formData.bp2d}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Lifestyle Tab */}
              {activeTab === 'lifestyle' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="smoker"
                        checked={formData.smoker}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Smoker</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="physActivity"
                        checked={formData.physActivity}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Physical Activity</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="fruits"
                        checked={formData.fruits}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Eats Fruits</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="veggies"
                        checked={formData.veggies}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Eats Vegetables</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hvyAlcoholConsump"
                        checked={formData.hvyAlcoholConsump}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Heavy Alcohol Consumption</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="stroke"
                        checked={formData.stroke}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">History of Stroke</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="heartDiseaseorAttack"
                        checked={formData.heartDiseaseorAttack}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Heart Disease or Attack</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="anyHealthcare"
                        checked={formData.anyHealthcare}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Has Healthcare Coverage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="noDocbcCost"
                        checked={formData.noDocbcCost}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">Couldn't See Doctor Due to Cost</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-border mt-4 space-y-4">
                    <div>
                      <Label htmlFor="genHlth">General Health Status</Label>
                      <Input
                        id="genHlth"
                        name="genHlth"
                        placeholder="Good/Fair/Poor"
                        value={formData.genHlth}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mentHlth">Mental Health Days (Last 30)</Label>
                      <Input
                        id="mentHlth"
                        name="mentHlth"
                        type="number"
                        placeholder="0"
                        value={formData.mentHlth}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="physHlth">Physical Health Days (Last 30)</Label>
                      <Input
                        id="physHlth"
                        name="physHlth"
                        type="number"
                        placeholder="0"
                        value={formData.physHlth}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div className="py-8 text-center">
                  <p className="text-foreground font-semibold text-lg mb-2">Almost Done!</p>
                  <p className="text-muted-foreground mb-4">Click 'Save Patient' to create the record</p>
                  <p className="text-sm text-muted-foreground">You can upload retinopathy images after patient creation</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4 mt-6">
            <Link href="/patients" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            {activeTab !== 'personal' && (
              <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                Previous
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {activeTab === 'images' ? 'Save Patient' : 'Next'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
