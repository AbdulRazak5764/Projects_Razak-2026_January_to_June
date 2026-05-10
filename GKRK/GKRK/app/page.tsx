"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, Eye, Activity, Shield, BarChart3, AlertCircle, LogIn } from "lucide-react"
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from "@/components/glass-card"

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                ExamGuard AI
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login/student" className="text-sm text-slate-300 hover:text-white transition-colors font-medium hidden sm:block">
              Student Portal
            </Link>
            <Link href="/login/admin" className="text-sm px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all font-medium text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen Proctoring System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-indigo-200 to-blue-500 bg-clip-text text-transparent text-balance">
            Online Exam Cheating Risk Predictor
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 text-balance font-light leading-relaxed">
            Eliminate false accusations with our cognitive-behavioral AI. Decision support designed for ethical, transparent, and unbiased examination monitoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl">
            <Link href="/login/student" className="w-full">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                <GlassCard className="relative overflow-hidden group cursor-pointer border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GlassCardHeader className="text-left">
                    <div className="p-3 bg-blue-500/20 w-fit rounded-xl mb-4 text-blue-300">
                      <LogIn className="w-6 h-6" />
                    </div>
                    <GlassCardTitle className="text-2xl mb-1 group-hover:text-blue-200 transition-colors">Student Login</GlassCardTitle>
                    <GlassCardDescription className="text-slate-300">Enter secure exam environment</GlassCardDescription>
                  </GlassCardHeader>
                </GlassCard>
              </motion.div>
            </Link>

            <Link href="/login/admin" className="w-full">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                <GlassCard className="relative overflow-hidden group cursor-pointer border-violet-500/30 hover:border-violet-400/60 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GlassCardHeader className="text-left">
                    <div className="p-3 bg-violet-500/20 w-fit rounded-xl mb-4 text-violet-300">
                      <Shield className="w-6 h-6" />
                    </div>
                    <GlassCardTitle className="text-2xl mb-1 group-hover:text-violet-200 transition-colors">Admin Login</GlassCardTitle>
                    <GlassCardDescription className="text-slate-300">Monitor & analyze behavior</GlassCardDescription>
                  </GlassCardHeader>
                </GlassCard>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ethical AI Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Advanced behavioral analysis delivering actionable insights without binary accusations.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Eye className="w-7 h-7" />,
              title: "Behavioral Monitoring",
              description: "Real-time tracking of eye gaze, head posture, and movement mechanics.",
              color: "text-blue-400",
              bg: "bg-blue-500/10"
            },
            {
              icon: <Brain className="w-7 h-7" />,
              title: "Cognitive Load",
              description: "Detect abnormal mental strain corresponding to potential rule violations.",
              color: "text-violet-400",
              bg: "bg-violet-500/10"
            },
            {
              icon: <Activity className="w-7 h-7" />,
              title: "Temporal Analysis",
              description: "Identify phase-wise behavior shifts and timeline correlation.",
              color: "text-indigo-400",
              bg: "bg-indigo-500/10"
            },
            {
              icon: <BarChart3 className="w-7 h-7" />,
              title: "Risk Prediction",
              description: "Multi-layered probability scoring using aggregate behavioral risk factors.",
              color: "text-fuchsia-400",
              bg: "bg-fuchsia-500/10"
            },
            {
              icon: <AlertCircle className="w-7 h-7" />,
              title: "Explainable AI",
              description: "Human-readable justification for every risk assessment generated.",
              color: "text-cyan-400",
              bg: "bg-cyan-500/10"
            },
            {
              icon: <Shield className="w-7 h-7" />,
              title: "Human-in-Loop",
              description: "We provide exactly the data needed for humans to make fair, informed decisions.",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10"
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full hover:-translate-y-2 transition-transform duration-300 border-white/5 hover:border-white/20">
                <GlassCardHeader>
                  <div className={`p-3 w-fit rounded-xl mb-3 ${feat.bg} ${feat.color}`}>
                    {feat.icon}
                  </div>
                  <GlassCardTitle>{feat.title}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-slate-400 leading-relaxed text-sm">{feat.description}</p>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md mt-20 relative z-20">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0 text-slate-400">
            <Brain className="w-5 h-5" />
            <span className="font-semibold text-sm">ExamGuard AI</span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            B.Tech CSE Academic Project. No real surveillance data collected.
          </p>
        </div>
      </footer>
    </div>
  )
}
