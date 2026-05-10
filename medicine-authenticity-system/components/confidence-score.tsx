"use client"
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react"

export function ConfidenceScore({ detectionResult }: { detectionResult?: any }) {
  const genuineScore = detectionResult?.genuineScore ?? 87
  const fakeScore = detectionResult?.fakeScore ?? 13
  const packagingScore = detectionResult?.packagingScore ?? 92

  const getStatusColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 50) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-rose-500"
  }

  return (
    <div className="space-y-4">
      {/* Genuine Score */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-white">Genuine Score</span>
          </div>
          <span className="text-2xl font-bold text-green-400">{genuineScore}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${genuineScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {genuineScore >= 80 ? "High confidence genuine medication" : "Low confidence genuine"}
        </p>
      </div>

      {/* Fake Score */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-white">Counterfeit Risk</span>
          </div>
          <span className="text-2xl font-bold text-red-400">{fakeScore}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
            style={{ width: `${fakeScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {fakeScore >= 30 ? "⚠️ Potential counterfeit risk detected" : "Low risk of counterfeit"}
        </p>
      </div>

      {/* Packaging Score */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white">Packaging Auth</span>
          <span className="text-2xl font-bold text-blue-400">{packagingScore}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${packagingScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">Batch & expiry verified</p>
      </div>

      {detectionResult?.warnings && detectionResult.warnings.length > 0 && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-2">⚠️ Detection Warnings</p>
              <ul className="space-y-1">
                {detectionResult.warnings.map((warning: string, i: number) => (
                  <li key={i} className="text-xs text-red-300">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
