"use client"

import { useState } from "react"
import { RetinalViewer } from "@/components/imaging/retinal-viewer"
import { ImageAnalysis } from "@/components/imaging/image-analysis"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { TopNav } from "@/components/navigation/top-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Download, Share2, Settings } from "lucide-react"

export default function ImagingPage() {
  const [analysisMode, setAnalysisMode] = useState("overview")
  const [selectedImage, setSelectedImage] = useState(0)

  const images = [
    { id: 1, name: "OCT Scan - 2024-12-01", type: "OCT", quality: "High", status: "Analyzed" },
    { id: 2, name: "Fundus Photo - 2024-11-28", type: "Fundus", quality: "Very High", status: "Analyzed" },
    { id: 3, name: "Angiography - 2024-11-15", type: "OCTA", quality: "High", status: "Analyzed" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="border-b border-border px-6 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Retinal Imaging Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Advanced OCT and fundus image processing with AI-powered pattern recognition
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share Report
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          <div className="flex gap-6 p-6">
            {/* Main Viewer */}
            <div className="flex-1">
              <RetinalViewer imageIndex={selectedImage} />

              {/* Mode Selector */}
              <div className="mt-4 flex gap-2 border-b border-border pb-4">
                {["overview", "vessels", "layers", "anomalies"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAnalysisMode(mode)}
                    className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                      analysisMode === mode
                        ? "border-b-2 border-accent text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Analysis Display */}
              <ImageAnalysis mode={analysisMode} />
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-4">
              {/* Image List */}
              <Card className="glass-card p-4">
                <h3 className="mb-3 font-semibold">Recent Images</h3>
                <div className="space-y-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                        selectedImage === idx ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
                      }`}
                    >
                      <p className="text-sm font-medium">{img.name}</p>
                      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-background px-2 py-1">{img.type}</span>
                        <span className="rounded bg-background px-2 py-1">{img.quality}</span>
                        <span className="rounded bg-green-500/10 px-2 py-1 text-green-600">{img.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Image Metrics */}
              <Card className="glass-card p-4">
                <h3 className="mb-3 font-semibold">Image Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="font-medium">512×512px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wavelength</span>
                    <span className="font-medium">880nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal Strength</span>
                    <span className="font-medium">42/50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Acquisition Time</span>
                    <span className="font-medium">3.2s</span>
                  </div>
                </div>
              </Card>

              {/* AI Analysis Results */}
              <Card className="glass-card p-4">
                <h3 className="mb-3 font-semibold">AI Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg bg-background p-2">
                    <p className="text-xs font-medium text-muted-foreground">Vessel Integrity</p>
                    <p className="font-semibold text-accent">94%</p>
                  </div>
                  <div className="rounded-lg bg-background p-2">
                    <p className="text-xs font-medium text-muted-foreground">Layer Organization</p>
                    <p className="font-semibold text-accent">91%</p>
                  </div>
                  <div className="rounded-lg bg-background p-2">
                    <p className="text-xs font-medium text-muted-foreground">Anomaly Risk</p>
                    <p className="font-semibold text-green-600">5%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
