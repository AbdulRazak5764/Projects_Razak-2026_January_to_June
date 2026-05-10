"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { TopNav } from "@/components/navigation/top-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, AlertTriangle, TrendingUp, Zap, RotateCw } from "lucide-react"

export default function InsightsPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dashboardData: {
            retinalScore: 94.2,
            riskScore: 12,
            stressLevel: 45,
            sleepQuality: 8,
            wellnessIndex: 82,
          },
          analysisHistory: [
            { date: "2024-12-01", score: 94.2 },
            { date: "2024-11-01", score: 90 },
            { date: "2024-10-01", score: 87 },
          ],
        }),
      })

      const data = await response.json()
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="border-b border-border px-6 py-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">AI-Powered Insights</h1>
                <p className="text-sm text-muted-foreground">
                  Real-time intelligence powered by quantum-inspired algorithms and deep learning
                </p>
              </div>
              <Button onClick={fetchInsights} disabled={loading} className="gap-2">
                <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh Insights
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {insights ? (
              <>
                {/* Key Insights */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Key Insights</h2>
                  {insights.keyInsights?.map((insight: string, idx: number) => (
                    <Card key={idx} className="glass-card flex gap-4 p-4">
                      <div className="rounded-lg bg-accent/20 p-3 text-accent">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </Card>
                  ))}
                </div>

                {/* Alerts */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Active Alerts</h2>
                  {insights.alerts?.map((alert: any, idx: number) => (
                    <Card
                      key={idx}
                      className={`glass-card flex gap-4 p-4 ${
                        alert.level === "warning"
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-blue-500/30 bg-blue-500/5"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          alert.level === "warning" ? "bg-amber-500/20 text-amber-600" : "bg-blue-500/20 text-blue-600"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Wellness Recommendations</h2>
                  {insights.recommendations?.map((rec: string, idx: number) => (
                    <Card key={idx} className="glass-card flex gap-4 p-4">
                      <div className="rounded-lg bg-green-500/20 p-3 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <p className="text-sm">{rec}</p>
                    </Card>
                  ))}
                </div>

                {/* Predicted Outcomes */}
                <Card className="glass-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/20 p-3 text-cyan-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold">Predicted Outcomes</h2>
                  </div>
                  <div className="space-y-3">
                    {insights.predictedOutcomes?.map((outcome: string, idx: number) => (
                      <div key={idx} className="rounded-lg bg-background p-3 text-sm">
                        {outcome}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Model Confidence */}
                <Card className="glass-card p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold">Model Confidence</h3>
                    <p className="text-xs text-muted-foreground">Overall AI prediction accuracy</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-accent">{(insights.confidence * 100).toFixed(1)}%</span>
                      <span className="text-sm text-muted-foreground">Very High</span>
                    </div>
                    <div className="h-3 rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
                        style={{ width: `${insights.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-12">
                <div className="text-center">
                  <p className="text-muted-foreground">Loading AI insights...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
