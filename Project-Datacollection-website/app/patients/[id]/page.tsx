'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit2, LogOut, ImageIcon, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { imageDB } from '@/lib/indexedDB'

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
    const loadPatient = async () => {
      if (!isClient) return

      const isAuthenticated = localStorage.getItem('isAuthenticated')
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

      if (!isAuthenticated || !currentUser.email) {
        router.push('/login')
        return
      }

      console.log('[v0] Patient detail page - params.id:', params.id)

      if (params.id) {
        const userKey = `patients_${currentUser.email}`
        const allPatients = localStorage.getItem(userKey)
        if (allPatients) {
          try {
            const patientsData = JSON.parse(allPatients)
            console.log('[v0] All patients from storage:', patientsData)

            const foundPatient = patientsData.find((p: any) => p.id === params.id)
            console.log('[v0] Found patient:', foundPatient)

            if (foundPatient) {
              // Load images from IndexedDB
              const savedImages = foundPatient.images || []
              const imagesWithData = await Promise.all(
                savedImages.map(async (img: any) => {
                  const dbImage = await imageDB.getImage(img.id)
                  return {
                    ...img,
                    dataUrl: dbImage?.dataUrl || img.dataUrl
                  }
                })
              )
              setPatient({ ...foundPatient, images: imagesWithData })
            } else {
              setPatient(null)
            }
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
    }

    loadPatient()
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
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  // Create a temporary div with patient data for PDF generation
                  const tempDiv = document.createElement('div');
                  tempDiv.style.cssText = `
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: white;
                    color: black;
                    max-width: 800px;
                    margin: 0 auto;
                    font-size: 14px;
                    line-height: 1.4;
                  `;

                  // Build images HTML
                  let imagesHtml = '';
                  if (patient.images && patient.images.length > 0) {
                    imagesHtml = `
                      <h3 style="color: #000080; margin-bottom: 10px; font-size: 16px;">Retinopathy Images</h3>
                      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                    `;
                    patient.images.forEach((img: any) => {
                      if (img.dataUrl) {
                        imagesHtml += `
                          <div style="border: 1px solid #ccc; padding: 5px; width: 180px;">
                            <p style="font-size: 12px; font-weight: bold; color: #000080; margin-bottom: 5px;">${img.type} - ${img.technique}</p>
                            <img src="${img.dataUrl}" style="width: 100%; height: 120px; object-fit: cover;" />
                            ${img.uploadedAt ? `<p style="font-size: 10px; color: #666; margin-top: 5px;">${new Date(img.uploadedAt).toLocaleDateString()}</p>` : ''}
                          </div>
                        `;
                      }
                    });
                    imagesHtml += '</div>';
                  }

                  tempDiv.innerHTML = `
                    <h1 style="color: #000080; margin-bottom: 20px; text-align: center; font-size: 20px;">DiaCare Plus - Patient Report</h1>
                    <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">${patient.name}</h2>
                    <p style="margin-bottom: 20px;"><strong>Patient ID:</strong> ${patient.id}</p>

                    <h3 style="color: #000080; margin-bottom: 10px; font-size: 16px;">Personal Information</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ccc;">
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Name:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.name}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Age:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.age} years</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Gender:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.gender}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Height:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.height} cm</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Weight:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.weight} kg</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>BMI:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.bmi}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Location:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.location}</td></tr>
                    </table>

                    <h3 style="color: #000080; margin-bottom: 10px; font-size: 16px;">Medical Information</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ccc;">
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Glucose:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.glucose} mg/dL</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Blood Pressure:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.bloodPressure}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Skin Thickness:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.skinThickness} mm</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Insulin:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.insulin} μU/mL</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Diabetes Pedigree:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.diabetesPedigreeFunction}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Pregnancies:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.pregnancies}</td></tr>
                    </table>

                    <h3 style="color: #000080; margin-bottom: 10px; font-size: 16px;">Additional Health Information</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ccc;">
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Cholesterol:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.chol} mg/dL</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Stab Glucose:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.stabGlu} mg/dL</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>HDL:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.hdl} mg/dL</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Ratio:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.ratio}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Glycosylated Hb:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.glyhb}%</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Heart Disease:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.heartDiseaseorAttack ? 'Yes' : 'No'}</td></tr>
                      <tr><td style="padding: 5px; border: 1px solid #ccc; background-color: #f5f5f5;"><strong>Diabetes Outcome:</strong></td><td style="padding: 5px; border: 1px solid #ccc;">${patient.outcome ? 'Positive' : 'Negative'}</td></tr>
                    </table>

                    ${imagesHtml}

                    <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                  `;

                  document.body.appendChild(tempDiv);

                  const canvas = await html2canvas(tempDiv, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    width: 800,
                    height: tempDiv.scrollHeight
                  });

                  document.body.removeChild(tempDiv);

                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const imgWidth = 210;
                  const pageHeight = 295;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  let heightLeft = imgHeight;
                  let position = 0;

                  // Add first page
                  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;

                  // Add additional pages if needed
                  while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                  }

                  pdf.save(`${patient.name}_report.pdf`);
                } catch (error) {
                  console.error('PDF generation failed:', error);
                  alert('Failed to generate PDF. Please try again.');
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Link href={`/patients/${patient.id}/edit`}>
              <Button size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold">{patient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-semibold">{patient.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-semibold">{patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height</span>
                <span className="font-semibold">{patient.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-semibold">{patient.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BMI</span>
                <span className="font-semibold">{patient.bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-semibold">{patient.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Glucose</span>
                <span className="font-semibold">{patient.glucose} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blood Pressure</span>
                <span className="font-semibold">{patient.bloodPressure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skin Thickness</span>
                <span className="font-semibold">{patient.skinThickness} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insulin</span>
                <span className="font-semibold">{patient.insulin} μU/mL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diabetes Pedigree</span>
                <span className="font-semibold">{patient.diabetesPedigreeFunction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pregnancies</span>
                <span className="font-semibold">{patient.pregnancies}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Health Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Health Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cholesterol</span>
                <span className="font-semibold">{patient.chol} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stab Glucose</span>
                <span className="font-semibold">{patient.stabGlu} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HDL</span>
                <span className="font-semibold">{patient.hdl} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ratio</span>
                <span className="font-semibold">{patient.ratio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Glycosylated Hb</span>
                <span className="font-semibold">{patient.glyhb}%</span>
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
                    <p className="text-xs text-muted-foreground mb-1">{img.technique}</p>
                    <div className="w-full h-24 bg-muted rounded overflow-hidden cursor-pointer" onClick={() => {
                      if (img.dataUrl) {
                        const newWindow = window.open();
                        newWindow?.document.write(`<img src="${img.dataUrl}" style="max-width: 100%; max-height: 100vh;" />`);
                      }
                    }}>
                      {img.dataUrl ? (
                        <img src={img.dataUrl} alt={img.type} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                              <span className="text-xs font-bold text-primary">{img.type.charAt(0)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Image Saved</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {img.uploadedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </p>
                    )}
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
