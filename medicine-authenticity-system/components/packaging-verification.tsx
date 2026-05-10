"use client"

import { FileText, Barcode, Calendar, QrCode } from "lucide-react"

export function PackagingVerification() {
  const packagingDetails = [
    {
      label: "Batch Number",
      value: "MED-2024-789456",
      icon: Barcode,
      verified: true,
    },
    {
      label: "Expiry Date",
      value: "12/2026",
      icon: Calendar,
      verified: true,
    },
    {
      label: "QR Code",
      value: "Valid - Linked to Registry",
      icon: QrCode,
      verified: true,
    },
    {
      label: "Hologram",
      value: "Authentic - 3D Effect Detected",
      icon: FileText,
      verified: true,
    },
  ]

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Packaging Verification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packagingDetails.map((detail) => {
          const Icon = detail.icon
          return (
            <div
              key={detail.label}
              className={`p-4 rounded-lg border ${
                detail.verified ? "bg-slate-900/30 border-slate-700" : "bg-red-950/30 border-red-900"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${detail.verified ? "text-green-500" : "text-red-500"}`} />
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    detail.verified ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {detail.verified ? "Verified" : "Failed"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{detail.label}</p>
              <p className="font-semibold text-white text-sm">{detail.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-green-950/30 border border-green-900 rounded-lg">
        <p className="text-sm text-green-300 font-medium">
          All packaging verifications passed. Medicine authenticity confirmed.
        </p>
      </div>
    </div>
  )
}
