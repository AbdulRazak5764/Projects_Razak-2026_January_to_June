"use client"

import { useState } from "react"
import { Play, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TrainingMetrics {
  epoch: number
  loss: number
  accuracy: number
  val_accuracy: number
}

export default function TrainingPage() {
  const [isTraining, setIsTraining] = useState(false)
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([])
  const [status, setStatus] = useState("ready")
  const [trainingLog, setTrainingLog] = useState<string[]>([])

  const startTraining = async () => {
    setIsTraining(true)
    setStatus("training")
    setMetrics([])
    setTrainingLog([])

    try {
      const response = await fetch("/api/ml/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (data.success) {
        setMetrics(data.metrics || [])
        setTrainingLog(data.logs || [])
        setStatus("complete")
      } else {
        setStatus("error")
        setTrainingLog([...(data.logs || []), "Error: " + data.message])
      }
    } catch (error) {
      setStatus("error")
      setTrainingLog((prev) => [...prev, "Error: " + (error instanceof Error ? error.message : "Unknown error")])
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-accent">Model Training Center</h1>
          <p className="mt-2 text-muted-foreground">Train ML models on retinal disease detection</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Training Controls */}
          <Card className="glass-card p-6 lg:col-span-1">
            <h3 className="font-semibold mb-4">Training Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Epochs</label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg"
                  disabled={isTraining}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Batch Size</label>
                <input
                  type="number"
                  defaultValue={32}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg"
                  disabled={isTraining}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Learning Rate</label>
                <input
                  type="number"
                  defaultValue={0.001}
                  step={0.0001}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg"
                  disabled={isTraining}
                />
              </div>

              <Button
                onClick={startTraining}
                disabled={isTraining}
                className="w-full bg-accent hover:bg-accent/90 mt-6"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Training
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <p
                  className={`text-sm font-semibold ${status === "complete" ? "text-green-500" : status === "training" ? "text-yellow-500" : "text-blue-500"}`}
                >
                  {status === "ready" && "Ready to train"}
                  {status === "training" && "Training in progress..."}
                  {status === "complete" && "Training complete!"}
                  {status === "error" && "Error occurred"}
                </p>
              </div>
            </div>
          </Card>

          {/* Metrics & Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Metrics */}
            {metrics.length > 0 && (
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-4">Training Metrics</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg flex justify-between items-center ${
                        idx === metrics.length - 1 ? "bg-green-500/10 border border-green-500/30" : "bg-background/50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">Epoch {m.epoch}</p>
                        <p className="text-xs text-muted-foreground">Loss: {m.loss.toFixed(4)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent">{(m.accuracy * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Val: {(m.val_accuracy * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Training Logs */}
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {status === "complete" && <CheckCircle className="h-4 w-4 text-green-500" />}
                Training Logs
              </h3>
              <div className="bg-background/50 rounded-lg p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                {trainingLog.length === 0 ? (
                  <p className="text-muted-foreground">Logs will appear here during training...</p>
                ) : (
                  trainingLog.map((log, idx) => (
                    <p key={idx} className="text-muted-foreground">
                      &gt; {log}
                    </p>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
