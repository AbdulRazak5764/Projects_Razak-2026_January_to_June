"use client"

import { useState } from "react"
import { CameraFeed } from "@/components/camera-feed"
import { AnalysisPanel } from "@/components/analysis-panel"
import { ConfidenceScore } from "@/components/confidence-score"
import { PackagingVerification } from "@/components/packaging-verification"
import { Header } from "@/components/header"

export default function HomePageClient() {
  const [detectionResult, setDetectionResult] = useState<any>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Camera Feed */}
          <div className="lg:col-span-2">
            <CameraFeed onDetectionResult={setDetectionResult} />
          </div>

          {/* Right Sidebar - Analysis & Scores */}
          <div className="flex flex-col gap-6">
            <ConfidenceScore detectionResult={detectionResult} />
            <AnalysisPanel detectionResult={detectionResult} />
          </div>
        </div>

        {/* Packaging Verification Section */}
        <div className="mt-8">
          <PackagingVerification />
        </div>

        {/* Results History */}
        <div className="mt-8">
          <ResultsHistory />
        </div>
      </div>
    </main>
  )
}

function ResultsHistory() {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Scan History</h2>
      <div className="text-slate-400 text-center py-8">No scans yet. Start by placing a tablet in the camera feed.</div>
    </div>
  )
}
