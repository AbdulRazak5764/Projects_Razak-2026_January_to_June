"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Loader2, AlertCircle, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PredictionResult {
  disease: string
  confidence: number
  description: string
  risk_level: "low" | "medium" | "high" | "critical"
  clinical_notes: string
  progression?: {
    months_to_blindness: number | null
    vision_loss_rate: number
    severity_stage: string
    can_be_prevented: boolean
  }
}

interface PredictionResponse {
  success: boolean
  message: string
  predictions?: PredictionResult[]
  image_analysis?: {
    vessel_health: number
    optic_disc_quality: number
    macula_status: number
    overall_health: number
  }
  recommendations?: string[]
  timestamp?: string
}

export default function PredictPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handlePredict = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/ml/predict", {
        method: "POST",
        body: formData,
      })

      const data: PredictionResponse = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Error making prediction: " + (error instanceof Error ? error.message : "Unknown error"),
      })
    } finally {
      setLoading(false)
    }
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

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 border border-green-500/30"
      case "medium":
        return "bg-yellow-500/10 border border-yellow-500/30"
      case "high":
        return "bg-orange-500/10 border border-orange-500/30"
      case "critical":
        return "bg-red-500/10 border border-red-500/30"
      default:
        return "bg-blue-500/10 border border-blue-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-accent">Disease Prediction Engine</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a retinal image to get AI-powered disease predictions and risk assessment
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upload Area */}
          <div className="lg:col-span-1">
            <Card
              className="glass-card p-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer h-64"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-accent mb-3" />
                <h3 className="font-semibold text-sm mb-1">Upload Image</h3>
                <p className="text-xs text-muted-foreground mb-3">Click or drag retinal image</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                {file && <p className="text-xs font-medium text-accent">{file.name}</p>}
              </div>
            </Card>

            {preview && (
              <Button onClick={handlePredict} disabled={loading} className="w-full mt-4 bg-accent hover:bg-accent/90">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Run Prediction"
                )}
              </Button>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {preview && (
              <Card className="glass-card p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Image Preview</p>
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {result.success ? (
                  <>
                    {/* Image Analysis Metrics */}
                    {result.image_analysis && (
                      <Card className="glass-card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          Image Quality Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <MetricBar label="Vessel Health" value={result.image_analysis.vessel_health} />
                          <MetricBar label="Optic Disc" value={result.image_analysis.optic_disc_quality} />
                          <MetricBar label="Macula Status" value={result.image_analysis.macula_status} />
                          <MetricBar label="Overall Health" value={result.image_analysis.overall_health} />
                        </div>
                      </Card>
                    )}

                    {/* Disease Predictions */}
                    {result.predictions && result.predictions.length > 0 && (
                      <Card className="glass-card p-6">
                        <h3 className="font-semibold mb-4">Disease Predictions</h3>
                        <div className="space-y-3">
                          {result.predictions.map((pred, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border ${getRiskBg(pred.risk_level)}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-sm">{pred.disease}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{pred.description}</p>
                                </div>
                                <div className="text-right">
                                  <div
                                    className={`font-semibold text-sm ${pred.confidence > 0.7 ? "text-red-500" : "text-yellow-500"}`}
                                  >
                                    {(pred.confidence * 100).toFixed(1)}%
                                  </div>
                                  <div className={`text-xs font-medium capitalize ${getRiskColor(pred.risk_level)}`}>
                                    {pred.risk_level}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">{pred.clinical_notes}</p>

                              {/* Disease Progression Timeline */}
                              {pred.progression && pred.progression.months_to_blindness !== null && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        Timeline to Vision Loss
                                      </p>
                                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        <p>
                                          <strong>Current Stage:</strong> {pred.progression.severity_stage}
                                        </p>
                                        <p>
                                          <strong>Months to Blindness (if untreated):</strong>{" "}
                                          <span className="font-semibold text-red-500">
                                            ~{pred.progression.months_to_blindness} months
                                          </span>
                                        </p>
                                        <p>
                                          <strong>Vision Loss Rate:</strong>{" "}
                                          {pred.progression.vision_loss_rate.toFixed(1)}% per year
                                        </p>
                                        <p>
                                          <strong>Preventable:</strong>{" "}
                                          <span
                                            className={
                                              pred.progression.can_be_prevented
                                                ? "text-green-600 dark:text-green-400 font-semibold"
                                                : "text-yellow-600 dark:text-yellow-400"
                                            }
                                          >
                                            {pred.progression.can_be_prevented
                                              ? "Yes - Early intervention critical"
                                              : "Limited - Focus on management"}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <Card className="glass-card p-6 bg-blue-500/5 border border-blue-500/30">
                        <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">
                          Clinical Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                              <span className="text-blue-500">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="glass-card p-6 bg-red-500/5 border border-red-500/30">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-600 dark:text-red-400">Error</h3>
                        <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const percentage = value * 100
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs font-semibold text-accent">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-accent to-secondary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
