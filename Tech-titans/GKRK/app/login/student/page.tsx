"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, ArrowLeft, LogIn, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/glass-card"
import { Label } from "@/components/ui/label"

export default function StudentLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [rollNo, setRollNo] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rollNo.trim() || !name.trim() || !email.trim()) return

    login("student", rollNo, name, email)
    router.push("/exam")
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background flare specific to student login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

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

        <GlassCard className="border-blue-500/20 shadow-2xl shadow-blue-900/10">
          <GlassCardHeader className="space-y-3 pb-6 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-2">
              <User className="w-6 h-6" />
            </div>
            <GlassCardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Student Portal</GlassCardTitle>
            <GlassCardDescription className="text-slate-400">Secure entry to verification and examination system</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="rollNo" className="text-slate-300 ml-1">Roll Number</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="rollNo"
                    type="text"
                    required
                    className="w-full flex h-11 rounded-lg border border-white/10 bg-black/50 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500"
                    placeholder="Enter your registered roll ID"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 ml-1">Full Name</Label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full flex h-11 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500"
                  placeholder="Enter your complete legal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full flex h-11 rounded-lg border border-white/10 bg-black/50 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
              >
                <LogIn className="w-4 h-4" />
                Initialize Exam Session
              </button>
            </form>
          </GlassCardContent>
        </GlassCard>

        <p className="text-center text-xs text-slate-500 mt-6 bg-white/5 rounded-lg p-3 border border-white/5">
          <span className="text-blue-400 font-semibold mb-1 block">Demo Mode Active</span>
          This is an academic project environment. No actual personal data is being recorded.
        </p>
      </motion.div>
    </div>
  )
}
