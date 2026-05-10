"use client"

import { useEffect } from "react"
import { motion, Variants } from "framer-motion"

import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertCircle, Eye, Clock, FileText, Home } from "lucide-react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useExam } from "@/contexts/exam-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const factorData = [
  { name: "Behavioral Biometrics", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Performance Anomalies", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Environmental Signals", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Digital Footprint", value: 15, color: "hsl(var(--chart-5))" },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export default function DashboardPage() {
  const { isAuthenticated, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login/admin")
    } else if (userRole === "student") {
      router.push("/exam")
    }
  }, [isAuthenticated, userRole, router])

  const { riskScore, cognitiveLoad, timelineData, eventLog, behavioralData, currentQuestion, totalQuestions } =
    useExam()

  if (!isAuthenticated || userRole !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-transparent pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Exam Monitoring Dashboard</h1>
              <p className="text-xs text-muted-foreground">Real-time behavioral analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-white/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/analysis">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                <FileText className="w-4 h-4 mr-2" />
                Analysis
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                Admin Review
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-6"
      >
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader className="pb-2">
                <GlassCardDescription className="text-xs">Current Risk Score</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{riskScore.toFixed(1)}%</p>
                    <Badge variant="secondary" className="mt-2 bg-white/10 text-slate-200">
                      {riskScore < 30 ? "Low Risk" : riskScore < 60 ? "Moderate Risk" : "High Risk"}
                    </Badge>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader className="pb-2">
                <GlassCardDescription className="text-xs">Cognitive Load</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{cognitiveLoad.toFixed(0)}%</p>
                    <Badge variant="secondary" className="mt-2 bg-white/10 text-slate-200">
                      {cognitiveLoad < 30 ? "Low" : cognitiveLoad < 70 ? "Moderate" : "High"}
                    </Badge>
                  </div>
                  <Brain className="w-8 h-8 text-primary opacity-50" />
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader className="pb-2">
                <GlassCardDescription className="text-xs">Exam Progress</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round((currentQuestion / totalQuestions) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {currentQuestion} of {totalQuestions} questions
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-primary opacity-50" />
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader className="pb-2">
                <GlassCardDescription className="text-xs">Anomalies Detected</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{eventLog.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">Requires review</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-primary opacity-50" />
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Timeline Chart */}
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Temporal Behavior Timeline</GlassCardTitle>
                <GlassCardDescription className="text-xs">Risk and cognitive load over time</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} stroke="rgba(255,255,255,0.2)" />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} stroke="rgba(255,255,255,0.2)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      name="Risk Score"
                    />
                    <Area
                      type="monotone"
                      dataKey="cognitive"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                      name="Cognitive Load"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Factor Distribution */}
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Risk Factor Distribution</GlassCardTitle>
                <GlassCardDescription className="text-xs">Weighted contribution to overall risk</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={factorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="rgba(0,0,0,0)"
                    >
                      {factorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Behavioral Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-sm">Eye Gaze Metrics</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Deviation Rate</span>
                    <span className="text-sm font-semibold text-foreground">
                      {behavioralData.gazeDeviation.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, behavioralData.gazeDeviation)}%` }} transition={{ duration: 1 }} className="h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Blink Frequency</span>
                    <span className="text-sm font-semibold text-foreground">
                      {behavioralData.blinkRate.toFixed(0)}/min
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (behavioralData.blinkRate / 30) * 100)}%` }} transition={{ duration: 1 }} className="h-full bg-violet-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Focus Duration</span>
                    <span className="text-sm font-semibold text-foreground">85%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `85%` }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-sm">Typing Patterns</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Average Speed</span>
                    <span className="text-sm font-semibold text-foreground">
                      {behavioralData.typingSpeed.toFixed(0)} WPM
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (behavioralData.typingSpeed / 80) * 100)}%` }} transition={{ duration: 1 }} className="h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Consistency</span>
                    <span className="text-sm font-semibold text-foreground">High</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `80%` }} transition={{ duration: 1 }} className="h-full bg-violet-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Pause Frequency</span>
                    <span className="text-sm font-semibold text-foreground">Normal</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `50%` }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-sm">Head Pose Analysis</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Movement Rate</span>
                    <span className="text-sm font-semibold text-foreground">
                      {behavioralData.headMovement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, behavioralData.headMovement)}%` }} transition={{ duration: 1 }} className="h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Mouse Activity</span>
                    <span className="text-sm font-semibold text-foreground">
                      {behavioralData.mouseHesitation.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, behavioralData.mouseHesitation)}%` }} transition={{ duration: 1 }} className="h-full bg-fuchsia-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Stability</span>
                    <span className="text-sm font-semibold text-foreground">Good</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `75%` }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Explainability Section */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-base flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Explainable AI: Event Timeline
              </GlassCardTitle>
              <GlassCardDescription className="text-xs">Key behavioral events that influenced the risk score</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              {eventLog.length > 0 ? (
                <div className="space-y-3">
                  {eventLog.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-shrink-0 w-16 text-sm font-mono text-muted-foreground">{item.time}</div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.event}</p>
                      </div>
                      <Badge variant={item.impact.includes("+") ? "destructive" : "secondary"} className={item.impact.includes("+") ? "" : "bg-white/10"}>{item.impact}</Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No significant events detected yet. Monitoring continues...
                </p>
              )}
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
