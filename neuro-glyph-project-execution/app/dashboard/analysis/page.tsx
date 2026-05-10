"use client"

import { useState } from "react"
import { Trash2, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AnalysisRecord {
  id: string
  date: string
  imageName: string
  predictions: Array<{
    disease: string
    confidence: number
    risk_level: string
  }>
  overallHealth: number
  status: string
}

export default function AnalysisDashboard() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([
    {
      id: "1",
      date: "2024-12-11",
      imageName: "retinal_scan_001.jpg",
      predictions: [
        { disease: "Diabetic Retinopathy", confidence: 0.68, risk_level: "medium" },
        { disease: "Hypertensive Retinopathy", confidence: 0.45, risk_level: "low" },
      ],
      overallHealth: 75,
      status: "completed",
    },
    {
      id: "2",
      date: "2024-12-10",
      imageName: "fundus_image_102.jpg",
      predictions: [{ disease: "Age-related Macular Degeneration", confidence: 0.32, risk_level: "low" }],
      overallHealth: 82,
      status: "completed",
    },
    {
      id: "3",
      date: "2024-12-09",
      imageName: "optic_disc_analysis.jpg",
      predictions: [
        { disease: "Glaucoma", confidence: 0.28, risk_level: "low" },
        { disease: "Hypertensive Retinopathy", confidence: 0.55, risk_level: "medium" },
      ],
      overallHealth: 79,
      status: "completed",
    },
  ])

  const deleteAnalysis = (id: string) => {
    setAnalyses(analyses.filter((a) => a.id !== id))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-red-600"
      default:
        return "text-blue-500"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-accent">Analysis History</h1>
          <p className="mt-2 text-muted-foreground">Review all previous retinal image analyses and predictions</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {analyses.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <Eye className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analyses Yet</h3>
            <p className="text-muted-foreground mb-6">Upload a retinal image to get started with disease prediction</p>
            <Button className="bg-accent hover:bg-accent/90">Upload Image</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card
                key={analysis.id}
                className="glass-card p-6 border border-border hover:border-accent/50 transition-colors"
              >
                <div className="grid gap-6 lg:grid-cols-4 items-start">
                  {/* Left: Date and Image Info */}
                  <div className="lg:col-span-1">
                    <p className="text-sm text-muted-foreground">Analysis Date</p>
                    <p className="font-semibold text-lg text-accent">{analysis.date}</p>
                    <p className="text-sm text-muted-foreground mt-3">Image</p>
                    <p className="font-medium text-sm">{analysis.imageName}</p>
                  </div>

                  {/* Center: Health Score */}
                  <div className="lg:col-span-1 flex flex-col items-center justify-center py-4">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20" />
                      <div className="text-center relative">
                        <div className="text-3xl font-bold text-accent">{analysis.overallHealth}</div>
                        <div className="text-xs text-muted-foreground">Health %</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Predictions */}
                  <div className="lg:col-span-2">
                    <p className="text-sm font-medium mb-3">Disease Predictions</p>
                    <div className="space-y-2">
                      {analysis.predictions.map((pred, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-background/50 rounded-lg border border-border/50"
                        >
                          <div>
                            <p className="text-sm font-medium">{pred.disease}</p>
                            <p className="text-xs text-muted-foreground">
                              Confidence: {(pred.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                          <span className={`text-xs font-semibold capitalize ${getRiskColor(pred.risk_level)}`}>
                            {pred.risk_level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-border pt-4 justify-end">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive bg-transparent"
                    onClick={() => deleteAnalysis(analysis.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
