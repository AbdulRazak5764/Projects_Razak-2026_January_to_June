"use client"

import { BarChart3, Fingerprint, Layers, Eye } from "lucide-react"

export function AnalysisPanel({ detectionResult }: { detectionResult?: any }) {
  const features = detectionResult?.features || {
    colorHue: 91,
    texturePattern: 85,
    imprintQuality: 88,
    surfaceSmoothness: 84,
  }

  const featureList = [
    { label: "Color Hue", score: features.colorHue, icon: Eye },
    { label: "Texture Pattern", score: features.texturePattern, icon: Layers },
    { label: "Imprint Quality", score: features.imprintQuality, icon: Fingerprint },
    { label: "Surface Smoothness", score: features.surfaceSmoothness, icon: BarChart3 },
  ]

  const detailedAnalysis = detectionResult?.detailedAnalysis

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Feature Analysis</h3>

      <div className="space-y-3">
        {featureList.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-300 truncate">{feature.label}</span>
                  <span className="text-sm font-semibold text-cyan-400 flex-shrink-0">{feature.score}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${feature.score}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {detailedAnalysis && (
        <div className="mt-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400">Tablet Name</p>
              <p className="text-cyan-400 font-mono">{detailedAnalysis.imprint}</p>
            </div>
            <div>
              <p className="text-slate-400">Manufacturing Date</p>
              <p className="text-cyan-400 font-mono">{new Date(detailedAnalysis.manufacturingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-slate-400">Expiry Date</p>
              <p className="text-cyan-400 font-mono">{new Date(detailedAnalysis.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-slate-400">Batch Number</p>
              <p className="text-cyan-400 font-mono">{detailedAnalysis.batchNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-400">Tablet Size</p>
              <p className="text-cyan-400 font-mono">
                {detailedAnalysis.diameter} × {detailedAnalysis.thickness}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-700 pt-2">
            ✓ All analyzed features processed. Confidence: {detailedAnalysis.manufacturerMatch}%
          </p>
        </div>
      )}
    </div>
  )
}
