"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const vesselData = [
  { depth: "0-100μm", density: 85 },
  { depth: "100-200μm", density: 92 },
  { depth: "200-300μm", density: 78 },
  { depth: "300-400μm", density: 55 },
  { depth: "400-500μm", density: 32 },
]

const layerThickness = [
  { layer: "RPE", thickness: 18 },
  { layer: "OPL", thickness: 45 },
  { layer: "INL", thickness: 38 },
  { layer: "IPL", thickness: 52 },
  { layer: "GCL", thickness: 65 },
  { layer: "ILM", thickness: 35 },
]

export function ImageAnalysis({ mode }: { mode: string }) {
  return (
    <div className="mt-4">
      {mode === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="glass-card p-4">
            <h4 className="mb-4 font-semibold">Image Quality Metrics</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Contrast Ratio</span>
                <span className="font-medium text-accent">8.2:1</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Signal-to-Noise</span>
                <span className="font-medium text-accent">42dB</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Focus Clarity</span>
                <span className="font-medium text-accent">96%</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Motion Artifact</span>
                <span className="font-medium text-green-600">None detected</span>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4">
            <h4 className="mb-4 font-semibold">Pathology Screening</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Drusen</span>
                <span className="font-medium text-green-600">Absent</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Hemorrhage</span>
                <span className="font-medium text-green-600">None</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Exudates</span>
                <span className="font-medium text-green-600">Not detected</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Microaneurysms</span>
                <span className="font-medium text-green-600">Negative</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {mode === "vessels" && (
        <Card className="glass-card p-4">
          <h4 className="mb-4 font-semibold">Vessel Density by Depth</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vesselData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="depth" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Bar dataKey="density" fill="hsl(var(--color-accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {mode === "layers" && (
        <Card className="glass-card p-4">
          <h4 className="mb-4 font-semibold">Retinal Layer Thickness Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={layerThickness}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="layer" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Bar dataKey="thickness" fill="hsl(var(--color-secondary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {mode === "anomalies" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="glass-card p-4">
            <h4 className="mb-4 font-semibold">Detected Anomalies</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-green-500/5 p-3 text-green-700">
                <span>Diabetic Retinopathy</span>
                <span className="font-semibold">Not detected</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-500/5 p-3 text-green-700">
                <span>Age-related Macular</span>
                <span className="font-semibold">Not detected</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-500/5 p-3 text-green-700">
                <span>Glaucomatous Changes</span>
                <span className="font-semibold">Not detected</span>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4">
            <h4 className="mb-4 font-semibold">Risk Assessment</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Overall Risk Score</span>
                <span className="font-medium text-green-600">3/100</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Progression Risk</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Intervention Required</span>
                <span className="font-medium text-green-600">None</span>
              </div>
              <div className="flex justify-between rounded-lg bg-background p-2">
                <span>Follow-up Recommended</span>
                <span className="font-medium">12 months</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
