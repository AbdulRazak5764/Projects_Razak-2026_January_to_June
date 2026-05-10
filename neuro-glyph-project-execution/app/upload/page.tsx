"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface UploadResult {
  success: boolean
  message: string
  predictions?: {
    disease: string
    confidence: number
    description: string
  }[]
  modelMetrics?: {
    accuracy: number
    trained_samples: number
    model_version: string
  }
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handleUploadAndTrain = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/ml/upload-and-train", {
        method: "POST",
        body: formData,
      })

      const data: UploadResult = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Error processing image: " + (error instanceof Error ? error.message : "Unknown error"),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-accent">Retinal Image Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            Upload retinal images for ML model training and disease prediction
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card
            className="glass-card p-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Upload Retinal Image</h3>
              <p className="text-sm text-muted-foreground mb-4">Click to select an image or drag and drop</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              {file && <p className="text-sm font-medium text-accent">{file.name}</p>}
            </div>
          </Card>

          {/* Preview Section */}
          <div className="space-y-4">
            {preview && (
              <Card className="glass-card p-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Image Preview</p>
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-border"
                />
              </Card>
            )}

            {file && (
              <Button
                onClick={handleUploadAndTrain}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training Model...
                  </>
                ) : (
                  "Upload & Train Model"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <Card
            className={`mt-8 glass-card p-6 border-2 ${result.success ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
          >
            <div className="flex gap-4">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4
                  className={`font-semibold mb-2 ${result.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {result.success ? "Analysis Complete" : "Error"}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{result.message}</p>

                {result.predictions && result.predictions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-semibold">Disease Predictions:</h5>
                    {result.predictions.map((pred, idx) => (
                      <div key={idx} className="bg-background/50 p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{pred.disease}</span>
                          <span
                            className={`text-sm font-semibold ${pred.confidence > 0.7 ? "text-red-500" : "text-yellow-500"}`}
                          >
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{pred.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {result.modelMetrics && (
                  <div className="bg-background/50 p-3 rounded-lg border border-border">
                    <h5 className="text-sm font-semibold mb-2">Model Metrics</h5>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-semibold text-accent">{(result.modelMetrics.accuracy * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trained Samples</p>
                        <p className="font-semibold text-accent">{result.modelMetrics.trained_samples}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Model Version</p>
                        <p className="font-semibold text-accent">{result.modelMetrics.model_version}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
