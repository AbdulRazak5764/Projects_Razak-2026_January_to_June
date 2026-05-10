'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Plus, LogOut, Activity } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayEntries: 0,
    averageGlucose: 0,
    riskPatients: 0,
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const currentUser = localStorage.getItem('currentUser')

    if (!isAuthenticated || !currentUser) {
      router.push('/login')
      return
    }

    const user = JSON.parse(currentUser)
    setUser(user)

    const userKey = `patients_${user.email}`
    const allPatients = localStorage.getItem(userKey)

    if (allPatients) {
      const patientsData = JSON.parse(allPatients)
      setPatients(patientsData)

      const today = new Date().toDateString()
      const todayCount = patientsData.filter((p: any) => new Date(p.dateCreated).toDateString() === today).length
      const avgGlucose = patientsData.length > 0
        ? Math.round(patientsData.reduce((sum: number, p: any) => sum + (p.glucose || 0), 0) / patientsData.length)
        : 0
      const riskCount = patientsData.filter((p: any) => p.glucose > 200 || p.bloodPressure.split('/')[0] > 140).length

      setStats({
        totalPatients: patientsData.length,
        todayEntries: todayCount,
        averageGlucose: avgGlucose,
        riskPatients: riskCount,
      })
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  // Sample data for charts
  const glucoseData = [
    { name: 'Mon', value: 140 },
    { name: 'Tue', value: 155 },
    { name: 'Wed', value: 135 },
    { name: 'Thu', value: 170 },
    { name: 'Fri', value: 145 },
    { name: 'Sat', value: 160 },
    { name: 'Sun', value: 150 },
  ]

  const genderData = [
    { name: 'Male', value: patients.filter(p => p.gender === 'Male').length },
    { name: 'Female', value: patients.filter(p => p.gender === 'Female').length },
  ]

  const COLORS = ['#3b82f6', '#10b981']

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">DiaCare Plus</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.hospitalId}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.fullName.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">Here's your diabetes patient management overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">Active patients in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
              <Activity className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayEntries}</div>
              <p className="text-xs text-muted-foreground">New entries today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Glucose</CardTitle>
              <Activity className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageGlucose}</div>
              <p className="text-xs text-muted-foreground">mg/dL average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <Activity className="w-5 h-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.riskPatients}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/patients/add" className="md:col-span-1">
            <Button className="w-full" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </Link>
          <Link href="/patients" className="md:col-span-1">
            <Button variant="outline" className="w-full" size="lg">
              <Users className="w-4 h-4 mr-2" />
              View All Patients
            </Button>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Glucose Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Glucose (mg/dL)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Distribution by Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

