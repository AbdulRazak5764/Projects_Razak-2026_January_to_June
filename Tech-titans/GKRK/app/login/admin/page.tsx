"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ArrowLeft, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/glass-card"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    login("admin", username, "Administrator")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background flare specific to admin login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/">
          <button className="flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </Link>

        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 text-violet-400 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Admin Authentication</h1>
          <p className="text-slate-400 mt-2">Restricted Proctoring Dashboard Access</p>
        </div>

        <GlassCard className="border-violet-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <GlassCardHeader>
            <GlassCardTitle>System Login</GlassCardTitle>
            <GlassCardDescription>Please enter your administrative credentials</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-slate-300">Username / ID</label>
                <input
                  id="username"
                  className="w-full flex h-10 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full flex h-10 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] mt-2 block"
              >
                <Lock className="w-4 h-4" />
                Access Dashboard
              </button>
            </form>
          </GlassCardContent>
        </GlassCard>

        <p className="text-center text-xs text-slate-500 mt-6 bg-white/5 rounded-lg p-3 border border-white/5">
          <span className="text-violet-400 font-semibold mb-1 block">Security Notice</span>
          Unauthorized access to examination data is strictly prohibited and logged.
        </p>
      </motion.div>
    </div>
  )
}
