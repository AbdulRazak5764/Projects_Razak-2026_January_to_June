import { Shield, Activity } from "lucide-react"

export function Header() {
  return (
    <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MediAuth</h1>
              <p className="text-xs text-slate-400">Tablet Authenticity Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-sm text-slate-300">System Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
