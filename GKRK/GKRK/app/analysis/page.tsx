"use client"

import { motion, Variants } from "framer-motion"
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Home, User, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const factorContribution = [
  { factor: "Behavioral Biometrics", score: 32, weight: 40, contribution: 12.8 },
  { factor: "Performance Anomalies", score: 45, weight: 25, contribution: 11.25 },
  { factor: "Environmental Signals", score: 18, weight: 20, contribution: 3.6 },
  { factor: "Digital Footprint", score: 22, weight: 15, contribution: 3.3 },
]

const radarData = [
  { metric: "Eye Gaze", value: 85 },
  { metric: "Typing Speed", value: 72 },
  { metric: "Focus", value: 88 },
  { metric: "Cognitive Load", value: 65 },
  { metric: "Consistency", value: 78 },
  { metric: "Behavior", value: 80 },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export default function AnalysisPage() {
  const finalRiskScore = 28.5

  return (
    <div className="min-h-screen bg-transparent pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Risk Analysis Report</h1>
              <p className="text-xs text-muted-foreground">Comprehensive behavioral assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-white/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                Dashboard
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
        {/* Session Info */}
        <motion.div variants={itemVariants} className="mb-6">
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <GlassCardTitle>Exam Session Summary</GlassCardTitle>
                  <GlassCardDescription className="mt-1">Computer Science Fundamentals Assessment</GlassCardDescription>
                </div>
                <Badge variant="secondary" className="text-sm bg-white/10 text-slate-200">
                  Session #12345
                </Badge>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Student ID</p>
                    <p className="text-sm font-semibold text-foreground">STU-2024-001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold text-foreground">8:34 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p className="text-sm font-semibold text-foreground">3 of 3 completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Anomalies</p>
                    <p className="text-sm font-semibold text-foreground">3 detected</p>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Final Risk Score */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
            <GlassCard className="h-full border-2 border-primary/20">
              <GlassCardHeader className="text-center">
                <GlassCardTitle className="text-sm text-muted-foreground">Final Cheating Risk Probability</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="text-center">
                <div className="mb-4">
                  <p className="text-6xl font-bold text-foreground mb-2">{finalRiskScore}%</p>
                  <Badge variant="secondary" className="text-base bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Low Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on comprehensive analysis of behavioral biometrics, performance patterns, and environmental
                  factors.
                </p>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Factor-wise Contribution</GlassCardTitle>
                <GlassCardDescription className="text-xs">How each factor influenced the overall risk score</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={factorContribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} stroke="rgba(255,255,255,0.2)" />
                    <YAxis
                      dataKey="factor"
                      type="category"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      width={150}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="contribution" fill="hsl(var(--chart-1))" name="Risk Contribution (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Detailed Factor Analysis */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Behavioral Performance Radar</GlassCardTitle>
                <GlassCardDescription className="text-xs">Multi-dimensional behavior assessment</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="rgba(255,255,255,0.2)" />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Risk Factor Breakdown</GlassCardTitle>
                <GlassCardDescription className="text-xs">Detailed contribution analysis</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                {factorContribution.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{item.factor}</span>
                        <Badge variant="outline" className="text-xs border-white/10 bg-white/5">
                          {item.weight}% weight
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.contribution.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.score}%` }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-xs text-muted-foreground w-16">{item.score}% score</span>
                    </div>
                  </div>
                ))}
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Explainability */}
        <motion.div variants={itemVariants} className="mb-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-base">Explainable AI: Why This Risk Score?</GlassCardTitle>
              <GlassCardDescription className="text-xs">Transparent reasoning behind the assessment</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Positive Indicators (Risk Reduction)</h4>
                      <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                        <li>• Consistent typing patterns throughout the exam</li>
                        <li>• Natural cognitive load progression matching question difficulty</li>
                        <li>• Stable eye gaze with minimal unexplained deviations</li>
                        <li>• Normal blink frequency and head pose angles</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Anomalies Detected (Risk Increase)</h4>
                      <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                        <li>• Brief gaze deviation spike at 2:15 during hard question (Question 3)</li>
                        <li>• Sudden typing speed increase at 4:30 (+15 WPM for 30 seconds)</li>
                        <li>• Cognitive load inconsistency at 5:45 (dropped 20% unexpectedly)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Overall Assessment</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The detected anomalies are minor and could be attributed to natural exam stress, momentary
                        distractions, or question difficulty adjustments. The overall behavioral pattern suggests
                        authentic exam-taking behavior with no strong indicators of cheating. The risk score of{" "}
                        {finalRiskScore}% falls within the LOW RISK category.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="text-base">Reviewer Recommendations</GlassCardTitle>
              <GlassCardDescription className="text-xs">Suggested next steps based on analysis</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-5/20 text-emerald-400 flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">No immediate action required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Risk score is low and behavior patterns are within normal range.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Optional: Review Question 3 response</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The gaze deviation spike during this question could be reviewed for additional context.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Compare with student's historical data</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      If available, cross-reference typing speed patterns with previous exams.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
