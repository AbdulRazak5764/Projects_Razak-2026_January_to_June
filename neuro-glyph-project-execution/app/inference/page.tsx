"use client"

import { useState } from "react"
import { Zap, Loader2, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface InferenceResult {
  predictions: Array<{
    disease: string
    confidence: number
  }>
  performance_metrics: {
    inference_time: string
    confidence_threshold: number
    model_accuracy: number
    ensemble_agreement: number
  }
  image_quality: {
    sharpness: number
    illumination: number
    centering: number
    overall: number
  }
}

export default function InferencePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InferenceResult | null>(null)
  const [latency, setLatency] = useState(0)

  const runInference = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/ml/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: "sample_base64_image_data",
          modelVersion: "v2.3.1",
        }),
      })

      const data = await response.json()
      setResult(data.inference)
      setLatency(Date.now() - startTime)
    } catch (error) {
      console.error("Inference error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-accent">Real-time Inference</h1>
          <p className="mt-2 text-muted-foreground">
            Run live predictions using trained ML models with optimized latency
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Control Panel */}
          <Card className="glass-card p-6 lg:col-span-1 h-fit">
            <h3 className="font-semibold mb-4">Inference Control</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Model Version</label>
                <select className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm">
                  <option>v2.3.1 (Latest)</option>
                  <option>v2.2.0</option>
                  <option>v2.1.0</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Confidence Threshold</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.3"
                  className="w-full mt-1"
                  disabled={loading}
                />
              </div>

              <Button onClick={runInference} disabled={loading} className="w-full bg-accent hover:bg-accent/90 gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Run Inference
                  </>
                )}
              </Button>

              {latency > 0 && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-xs text-muted-foreground">Total Latency</p>
                  <p className="text-lg font-bold text-green-500">{latency}ms</p>
                </div>
              )}
            </div>
          </Card>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                {/* Predictions */}
                <Card className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Live Predictions
                  </h3>
                  <div className="space-y-3">
                    {result.predictions.map((pred, idx) => (
                      <div key={idx} className="p-4 bg-background/50 rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{pred.disease}</span>
                          <span className="text-sm font-semibold text-accent">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-secondary"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Performance Metrics */}
                <Card className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.performance_metrics).map(([key, value]) => (
                      <div key={key} className="p-3 bg-background/50 rounded-lg">
                        <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-lg font-semibold text-accent">
                          {typeof value === "number" ? (value * 100).toFixed(1) + "%" : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Image Quality */}
                <Card className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Image Quality Assessment</h3>
                  <div className="space-y-3">
                    {Object.entries(result.image_quality).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{key}</span>
                          <span className="text-sm font-semibold text-accent">{(value * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-secondary"
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
