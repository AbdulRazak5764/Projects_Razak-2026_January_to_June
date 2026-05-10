"use client"

import { useState } from "react"
import { HealthTimeline } from "@/components/timeline/health-timeline"
import { TimelineChart } from "@/components/timeline/timeline-chart"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { TopNav } from "@/components/navigation/top-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TimelinePage() {
  const [timeRange, setTimeRange] = useState("12m")
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="border-b border-border px-6 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Health Progression Timeline</h1>
              <p className="text-sm text-muted-foreground">
                Temporal analysis and 12-month predictive trajectory based on quantum-inspired algorithms
              </p>
            </div>
            <div className="flex gap-2">
              {["3m", "6m", "12m", "24m", "All"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Timeline Chart */}
            <TimelineChart timeRange={timeRange} />

            {/* Interactive Timeline */}
            <HealthTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            {/* Correlation Matrix */}
            <Card className="glass-card p-6">
              <div className="mb-4">
                <h3 className="font-semibold">Health Factor Correlation Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  How retinal patterns correlate with stress, sleep, and wellness metrics
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium">Factor</th>
                      <th className="pb-2 text-right font-medium">Retinal Score</th>
                      <th className="pb-2 text-right font-medium">Stress Level</th>
                      <th className="pb-2 text-right font-medium">Sleep Quality</th>
                      <th className="pb-2 text-right font-medium">Wellness Index</th>
                      <th className="pb-2 text-right font-medium">Correlation</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {[
                      {
                        factor: "Vessel Density",
                        retinal: "92%",
                        stress: "45%",
                        sleep: "8h",
                        wellness: "82%",
                        correlation: "+0.87",
                      },
                      {
                        factor: "Layer Thickness",
                        retinal: "88%",
                        stress: "52%",
                        sleep: "7h",
                        wellness: "78%",
                        correlation: "+0.79",
                      },
                      {
                        factor: "Pigment Integrity",
                        retinal: "85%",
                        stress: "60%",
                        sleep: "6.5h",
                        wellness: "72%",
                        correlation: "+0.81",
                      },
                      {
                        factor: "Optic Disc",
                        retinal: "90%",
                        stress: "48%",
                        sleep: "8.2h",
                        wellness: "84%",
                        correlation: "+0.85",
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-accent/5">
                        <td className="py-3">{row.factor}</td>
                        <td className="py-3 text-right">
                          <span className="rounded-lg bg-accent/10 px-2 py-1 text-accent">{row.retinal}</span>
                        </td>
                        <td className="py-3 text-right text-muted-foreground">{row.stress}</td>
                        <td className="py-3 text-right text-muted-foreground">{row.sleep}</td>
                        <td className="py-3 text-right text-muted-foreground">{row.wellness}</td>
                        <td className="py-3 text-right font-semibold text-green-600">{row.correlation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Predictive Insights */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="glass-card p-6">
                <h3 className="mb-4 font-semibold">12-Month Prediction</h3>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs font-medium text-muted-foreground">Expected Retinal Score</p>
                    <p className="mt-1 text-2xl font-bold text-accent">96.8%</p>
                    <p className="text-xs text-green-600">+2.6% improvement</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs font-medium text-muted-foreground">Predicted Risk Score</p>
                    <p className="mt-1 text-2xl font-bold text-accent">8%</p>
                    <p className="text-xs text-green-600">-17% reduction</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs font-medium text-muted-foreground">Confidence Interval</p>
                    <p className="mt-1 text-lg font-semibold">94.2% ± 2.1%</p>
                    <div className="mt-2 h-2 rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
                        style={{ width: "94%" }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="mb-4 font-semibold">Key Driver Analysis</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { factor: "Stress Management", impact: "+45%", trend: "up" },
                    { factor: "Sleep Consistency", impact: "+38%", trend: "up" },
                    { factor: "Retinal Repair Rate", impact: "+42%", trend: "up" },
                    { factor: "Inflammatory Markers", impact: "-28%", trend: "down" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-background p-3">
                      <span>{item.factor}</span>
                      <span className={item.trend === "up" ? "text-green-600" : "text-blue-600"}>{item.impact}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
