"use client"

import type React from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertCircle, Heart, Brain, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

const retinalHealthData = [
  { month: "Jan", score: 82, risk: 28 },
  { month: "Feb", score: 85, risk: 25 },
  { month: "Mar", score: 88, risk: 22 },
  { month: "Apr", score: 87, risk: 23 },
  { month: "May", score: 90, risk: 19 },
  { month: "Jun", score: 94, risk: 12 },
]

const emotionalBiomarkerData = [
  { time: "00:00", stress: 45, wellness: 55, recovery: 60 },
  { time: "04:00", stress: 38, wellness: 62, recovery: 75 },
  { time: "08:00", stress: 52, wellness: 48, recovery: 55 },
  { time: "12:00", stress: 68, wellness: 32, recovery: 40 },
  { time: "16:00", stress: 62, wellness: 38, recovery: 48 },
  { time: "20:00", stress: 55, wellness: 45, recovery: 62 },
]

const tDnaIntegrityData = [
  { segment: "Nucleus", integrity: 92 },
  { segment: "Mitochondrial", integrity: 88 },
  { segment: "Cytoplasmic", integrity: 85 },
  { segment: "Membrane", integrity: 90 },
  { segment: "Vesicular", integrity: 82 },
]

export function AnalyticsHub() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={<Heart className="h-5 w-5 text-red-500" />}
          label="Retinal Health"
          value="94.2"
          unit="%"
          status="excellent"
          trend="+2.3%"
        />
        <KPICard
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          label="Health Risk (12mo)"
          value="12"
          unit="%"
          status="low"
          trend="-5.1%"
        />
        <KPICard
          icon={<Brain className="h-5 w-5 text-cyan-500" />}
          label="t-DNA Integrity"
          value="87.5"
          unit="%"
          status="good"
          trend="+1.2%"
        />
        <KPICard
          icon={<Zap className="h-5 w-5 text-purple-500" />}
          label="Emotion Index"
          value="78"
          unit="/100"
          status="stable"
          trend="+0.8%"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Retinal Health Progression */}
        <Card className="glass-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Retinal Health Score Progression</h3>
            <p className="text-xs text-muted-foreground">6-month trend analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={retinalHealthData}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--color-accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--color-accent))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--color-accent))"
                fillOpacity={1}
                fill="url(#colorHealth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Predicted Risk Trajectory */}
        <Card className="glass-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Predicted Risk Trajectory</h3>
            <p className="text-xs text-muted-foreground">AI-driven 12-month forecast</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={retinalHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="hsl(var(--color-destructive))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emotional Biomarker 24h */}
        <Card className="glass-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">24-Hour Emotional Biomarker</h3>
            <p className="text-xs text-muted-foreground">Stress, wellness, and recovery metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={emotionalBiomarkerData}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorWellness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="stress"
                stackId="1"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorStress)"
              />
              <Area
                type="monotone"
                dataKey="wellness"
                stackId="1"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorWellness)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* t-DNA Integrity Breakdown */}
        <Card className="glass-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">t-DNA Integrity by Segment</h3>
            <p className="text-xs text-muted-foreground">Temporal DNA structural analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tDnaIntegrityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="segment" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Bar dataKey="integrity" fill="hsl(var(--color-accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alerts & Insights */}
      <Card className="glass-card p-6">
        <div className="mb-4">
          <h3 className="font-semibold">AI Insights & Alerts</h3>
        </div>
        <div className="space-y-3">
          <AlertItem
            level="info"
            title="Model Update Available"
            description="The latest quantum-inspired retinal analysis model is ready for deployment."
          />
          <AlertItem
            level="warning"
            title="Elevated Stress Pattern"
            description="24-hour stress metrics show 15% above baseline. Recommend wellness intervention."
          />
          <AlertItem
            level="success"
            title="Health Milestone"
            description="Retinal health score reached new 6-month high of 94.2%."
          />
          <AlertItem
            level="info"
            title="Data Sync Complete"
            description="2.4M+ data points synchronized across all analysis engines."
          />
        </div>
      </Card>
    </div>
  )
}

function KPICard({
  icon,
  label,
  value,
  unit,
  status,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  status: string
  trend: string
}) {
  const statusColors = {
    excellent: "bg-green-500/10 text-green-600",
    good: "bg-blue-500/10 text-blue-600",
    low: "bg-green-500/10 text-green-600",
    stable: "bg-cyan-500/10 text-cyan-600",
    warning: "bg-amber-500/10 text-amber-600",
  }

  return (
    <Card className="glass-card p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="rounded-lg bg-background p-2">{icon}</div>
        <div className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[status as keyof typeof statusColors]}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline">
          <span className="text-2xl font-bold text-accent">{value}</span>
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  )
}

function AlertItem({ level, title, description }: { level: string; title: string; description: string }) {
  const levelStyles = {
    info: "border-blue-500/30 bg-blue-500/5 text-blue-700",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-700",
    success: "border-green-500/30 bg-green-500/5 text-green-700",
    error: "border-red-500/30 bg-red-500/5 text-red-700",
  }

  return (
    <div className={`rounded-lg border p-3 ${levelStyles[level as keyof typeof levelStyles]}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-80">{description}</p>
    </div>
  )
}
