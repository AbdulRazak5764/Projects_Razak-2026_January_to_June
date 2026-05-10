"use client"

import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

const chartData = [
  { month: "Jan", retinal: 82, risk: 28, stress: 65, sleep: 6.5, wellness: 68 },
  { month: "Feb", retinal: 85, risk: 25, stress: 62, sleep: 7, wellness: 72 },
  { month: "Mar", retinal: 88, risk: 22, stress: 58, sleep: 7.2, wellness: 76 },
  { month: "Apr", retinal: 87, risk: 23, stress: 60, sleep: 7, wellness: 74 },
  { month: "May", retinal: 90, risk: 19, stress: 52, sleep: 7.5, wellness: 80 },
  { month: "Jun", retinal: 94, risk: 12, stress: 45, sleep: 8, wellness: 85 },
  { month: "Jul*", retinal: 96, risk: 8, stress: 40, sleep: 8.2, wellness: 88 },
  { month: "Aug*", retinal: 97, risk: 6, stress: 35, sleep: 8.3, wellness: 90 },
  { month: "Sep*", retinal: 97, risk: 5, stress: 32, sleep: 8.4, wellness: 91 },
]

export function TimelineChart({ timeRange }: { timeRange: string }) {
  return (
    <Card className="glass-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Temporal Health Progression</h3>
        <p className="text-xs text-muted-foreground">
          Historical trends (solid) and AI predictions (dashed) for multi-factor analysis
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-accent))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--color-accent))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="left" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--color-muted-foreground))"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--color-card))",
              border: "1px solid hsl(var(--color-border))",
            }}
            formatter={(value) => value.toFixed(1)}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="retinal"
            stroke="hsl(var(--color-accent))"
            fillOpacity={1}
            fill="url(#fillArea)"
            name="Retinal Health"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="risk"
            stroke="hsl(var(--color-destructive))"
            strokeDasharray="5 5"
            name="Risk Score (Predicted)"
          />
          <Bar
            yAxisId="right"
            dataKey="wellness"
            fill="hsl(var(--color-secondary))"
            opacity={0.3}
            name="Wellness Index"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-4 text-xs text-muted-foreground">
        * Indicates AI-generated predictions based on quantum correlation models
      </p>
    </Card>
  )
}
