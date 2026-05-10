'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Eye, Plus, Search, ArrowLeft, LogOut, Download } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  glucose: number
  bloodPressure: string
  bmi: number
  dateCreated: string
  height?: number
  weight?: number
  location?: string
  skinThickness?: number
  insulin?: number
  diabetesPedigreeFunction?: number
  pregnancies?: number
  chol?: number
  stabGlu?: number
  hdl?: number
  ratio?: number
  glyhb?: number
  bp1s?: number
  bp1d?: number
  bp2s?: number
  bp2d?: number
  waist?: number
  hip?: number
  smoker?: boolean
  physActivity?: boolean
  fruits?: boolean
  veggies?: boolean
  hvyAlcoholConsump?: boolean
  stroke?: boolean
  heartDiseaseorAttack?: boolean
  anyHealthcare?: boolean
  noDocbcCost?: boolean
  genHlth?: number
  mentHlth?: number
  physHlth?: number
  prostateScrn?: boolean
}

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
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
      setPatients(patientsData)
      setFilteredPatients(patientsData)
    }
  }, [router])

  useEffect(() => {
    let filtered = patients

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(p => p.gender === genderFilter)
    }

    setFilteredPatients(filtered)
  }, [searchTerm, genderFilter, patients])

  const handleDelete = (id: string) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const userKey = `patients_${currentUser.email}`

    const updatedPatients = patients.filter(p => p.id !== id)
    setPatients(updatedPatients)
    localStorage.setItem(userKey, JSON.stringify(updatedPatients))
    setDeleteConfirm(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
            <p className="text-muted-foreground">Total: {filteredPatients.length} patient(s)</p>
          </div>
          <Link href="/patients/add">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        {filteredPatients.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Name</th>
                      <th className="text-left p-4 font-semibold">Age</th>
                      <th className="text-left p-4 font-semibold">Gender</th>
                      <th className="text-left p-4 font-semibold">Glucose</th>
                      <th className="text-left p-4 font-semibold">Blood Pressure</th>
                      <th className="text-left p-4 font-semibold">BMI</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 font-medium">{patient.name}</td>
                        <td className="p-4">{patient.age}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            {patient.gender}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={patient.glucose > 200 ? 'text-destructive font-semibold' : 'text-accent'}>
                            {patient.glucose} mg/dL
                          </span>
                        </td>
                        <td className="p-4">{patient.bloodPressure}</td>
                        <td className="p-4">{patient.bmi}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link href={`/patients/${patient.id}`}>
                              <Button variant="ghost" size="sm" title="View Patient">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Button variant="ghost" size="sm" title="Edit Patient">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                // Import jsPDF and html2canvas dynamically
                                const jsPDF = (await import('jspdf')).default
                                const html2canvas = (await import('html2canvas')).default

                                // Create a temporary div with patient details
                                const tempDiv = document.createElement('div')
                                tempDiv.style.width = '800px'
                                tempDiv.style.padding = '20px'
                                tempDiv.style.fontFamily = 'Arial, sans-serif'
                                tempDiv.style.backgroundColor = 'white'
                                tempDiv.style.color = 'black'
                                tempDiv.innerHTML = `
                                  <h1 style="color: #2563eb; margin-bottom: 20px;">Patient Report</h1>
                                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                                    <div>
                                      <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Personal Information</h2>
                                      <p><strong>Name:</strong> ${patient.name}</p>
                                      <p><strong>Age:</strong> ${patient.age}</p>
                                      <p><strong>Gender:</strong> ${patient.gender}</p>
                                      <p><strong>Height:</strong> ${patient.height || 'N/A'} cm</p>
                                      <p><strong>Weight:</strong> ${patient.weight || 'N/A'} kg</p>
                                      <p><strong>Location:</strong> ${patient.location || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Medical Information</h2>
                                      <p><strong>Glucose:</strong> ${patient.glucose} mg/dL</p>
                                      <p><strong>Blood Pressure:</strong> ${patient.bloodPressure}</p>
                                      <p><strong>BMI:</strong> ${patient.bmi}</p>
                                      <p><strong>Skin Thickness:</strong> ${patient.skinThickness || 'N/A'}</p>
                                      <p><strong>Insulin:</strong> ${patient.insulin || 'N/A'}</p>
                                    </div>
                                  </div>
                                  <div style="margin-bottom: 30px;">
                                    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Additional Details</h2>
                                    <p><strong>Diabetes Pedigree Function:</strong> ${patient.diabetesPedigreeFunction || 'N/A'}</p>
                                    <p><strong>Pregnancies:</strong> ${patient.pregnancies || 'N/A'}</p>
                                    <p><strong>Cholesterol:</strong> ${patient.chol || 'N/A'}</p>
                                    <p><strong>Stab Glucose:</strong> ${patient.stabGlu || 'N/A'}</p>
                                    <p><strong>HDL:</strong> ${patient.hdl || 'N/A'}</p>
                                    <p><strong>Ratio:</strong> ${patient.ratio || 'N/A'}</p>
                                    <p><strong>Glycosylated Hemoglobin:</strong> ${patient.glyhb || 'N/A'}</p>
                                  </div>
                                  <div style="margin-bottom: 30px;">
                                    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Blood Pressure Readings</h2>
                                    <p><strong>BP 1 (Systolic/Diastolic):</strong> ${patient.bp1s || 'N/A'}/${patient.bp1d || 'N/A'}</p>
                                    <p><strong>BP 2 (Systolic/Diastolic):</strong> ${patient.bp2s || 'N/A'}/${patient.bp2d || 'N/A'}</p>
                                  </div>
                                  <div style="margin-bottom: 30px;">
                                    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Body Measurements</h2>
                                    <p><strong>Waist:</strong> ${patient.waist || 'N/A'} cm</p>
                                    <p><strong>Hip:</strong> ${patient.hip || 'N/A'} cm</p>
                                  </div>
                                  <div style="margin-bottom: 30px;">
                                    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Lifestyle Information</h2>
                                    <p><strong>Smoker:</strong> ${patient.smoker ? 'Yes' : 'No'}</p>
                                    <p><strong>Physical Activity:</strong> ${patient.physActivity ? 'Yes' : 'No'}</p>
                                    <p><strong>Fruits Consumption:</strong> ${patient.fruits ? 'Yes' : 'No'}</p>
                                    <p><strong>Vegetables Consumption:</strong> ${patient.veggies ? 'Yes' : 'No'}</p>
                                    <p><strong>Heavy Alcohol Consumption:</strong> ${patient.hvyAlcoholConsump ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div style="margin-bottom: 30px;">
                                    <h2 style="color: #374151; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Medical History</h2>
                                    <p><strong>Stroke:</strong> ${patient.stroke ? 'Yes' : 'No'}</p>
                                    <p><strong>Heart Disease or Attack:</strong> ${patient.heartDiseaseorAttack ? 'Yes' : 'No'}</p>
                                    <p><strong>Any Healthcare:</strong> ${patient.anyHealthcare ? 'Yes' : 'No'}</p>
                                    <p><strong>No Doctor due to Cost:</strong> ${patient.noDocbcCost ? 'Yes' : 'No'}</p>
                                    <p><strong>General Health:</strong> ${patient.genHlth || 'N/A'}</p>
                                    <p><strong>Mental Health Days:</strong> ${patient.mentHlth || 'N/A'}</p>
                                    <p><strong>Physical Health Days:</strong> ${patient.physHlth || 'N/A'}</p>
                                    <p><strong>Prostate Screening:</strong> ${patient.prostateScrn ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                                    <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
                                    <p><strong>Patient ID:</strong> ${patient.id}</p>
                                    <p><strong>Date Created:</strong> ${new Date(patient.dateCreated).toLocaleDateString()}</p>
                                  </div>
                                `

                                document.body.appendChild(tempDiv)

                                try {
                                  const canvas = await html2canvas(tempDiv, {
                                    scale: 2,
                                    useCORS: true,
                                    allowTaint: true,
                                    backgroundColor: '#ffffff'
                                  })

                                  const imgData = canvas.toDataURL('image/png')
                                  const pdf = new jsPDF('p', 'mm', 'a4')

                                  const imgWidth = 210
                                  const pageHeight = 295
                                  const imgHeight = (canvas.height * imgWidth) / canvas.width
                                  let heightLeft = imgHeight

                                  let position = 0

                                  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                                  heightLeft -= pageHeight

                                  while (heightLeft >= 0) {
                                    position = heightLeft - imgHeight
                                    pdf.addPage()
                                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                                    heightLeft -= pageHeight
                                  }

                                  pdf.save(`${patient.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().split('T')[0]}.pdf`)
                                } catch (error) {
                                  console.error('Error generating PDF:', error)
                                  // Fallback to JSON if PDF generation fails
                                  const dataStr = JSON.stringify(patient, null, 2)
                                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                                  const url = URL.createObjectURL(dataBlob)
                                  const link = document.createElement('a')
                                  link.href = url
                                  link.download = `${patient.name.replace(/\s+/g, '_')}_data.json`
                                  link.click()
                                  URL.revokeObjectURL(url)
                                } finally {
                                  document.body.removeChild(tempDiv)
                                }
                              }}
                              title="Download Patient Report (PDF)"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(patient.id)}
                              title="Delete Patient"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No patients found</p>
              <Link href="/patients/add">
                <Button>Add Your First Patient</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Delete Patient?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">This action cannot be undone. Are you sure?</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
