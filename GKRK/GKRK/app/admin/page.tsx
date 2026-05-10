"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Home,
  Eye,
  AlertCircle,
  LogOut,
  Users,
  TrendingUp,
  MousePointer,
  Keyboard,
  Activity,
  Save,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useExam, type StudentSession } from "@/contexts/exam-context"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export default function AdminPage() {
  const { isAuthenticated, userRole, userId, logout } = useAuth()
  const router = useRouter()
  const { allStudentSessions, updateStudentMarks } = useExam()

  const [selectedStudent, setSelectedStudent] = useState<StudentSession | null>(null)
  const [marks, setMarks] = useState("")
  const [remarks, setRemarks] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login/admin")
    } else if (userRole === "student") {
      router.push("/exam")
    }
  }, [isAuthenticated, userRole, router])

  const handleLogout = () => {
    logout()
    router.push("/login/admin")
  }

  const handleSaveMarks = async () => {
    if (selectedStudent && marks) {
      const marksNum = Number.parseInt(marks, 10)
      if (!isNaN(marksNum) && marksNum >= 0 && marksNum <= 100) {
        
        // Save to local context
        updateStudentMarks(selectedStudent.studentId, marksNum, remarks)
        
        try {
          // Send Real Email Notification
          const response = await fetch('/api/send-email', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               email: selectedStudent.studentEmail,
               studentName: selectedStudent.studentName,
               marks: marksNum,
               remarks: remarks,
               riskScore: selectedStudent.riskScore
             })
          })
          
          const result = await response.json();
          if (response.ok) {
            if (result.testUrl) {
              console.log("Email captured in sandbox: ", result.testUrl);
              alert("Marks saved! (Note: Since .env isn't set with real EMAIL_USER, an Ethereal Sandbox email was generated. Check console for link)");
            } else {
              alert("Marks saved successfully and Official Email sent to student's inbox!");
            }
          } else {
             alert("Marks saved but failed to send email notification.");
          }

        } catch (error) {
           console.error("Email send error", error);
           alert("Marks saved but an error occurred while sending the email.");
        }

        setMarks("")
        setRemarks("")
        setSelectedStudent(null)
      } else {
        alert("Please enter valid marks (0-100)")
      }
    }
  }

  if (!isAuthenticated || userRole !== "admin") {
    return null
  }

  if (selectedStudent) {
    const gazeRisk = (selectedStudent.behavioralData.gazeDeviation / 100) * 40
    const blinkRisk = (Math.abs(selectedStudent.behavioralData.blinkRate - 18) / 18) * 15
    const mouseRisk = (selectedStudent.behavioralData.mouseHesitation / 100) * 20
    const headRisk = (selectedStudent.behavioralData.headMovement / 100) * 25
    const typingRisk =
      selectedStudent.behavioralData.typingSpeed > 80 ? 5 : selectedStudent.behavioralData.typingSpeed < 20 ? 15 : 10

    return (
      <div className="min-h-screen bg-transparent pb-12">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Student Risk Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedStudent.studentName} ({selectedStudent.studentId})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)} className="bg-white/5 border-white/10 hover:bg-white/10">
                Back to List
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="container mx-auto px-4 py-6 space-y-6"
        >
          {/* Ethics Notice */}
          <motion.div variants={itemVariants}>
            <GlassCard className="border-2 border-primary/20 bg-primary/5">
              <GlassCardHeader>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <GlassCardTitle className="text-base">Decision Support Notice</GlassCardTitle>
                    <GlassCardDescription className="mt-2 text-xs leading-relaxed text-slate-300">
                      Risk score is decision support only. Final judgment by examiner. This is a probability-based
                      indicator, not an accusation.
                    </GlassCardDescription>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>
          </motion.div>

          {/* Student Basic Details */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Student Details</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-base font-semibold text-foreground">{selectedStudent.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Roll Number</p>
                    <p className="text-base font-semibold text-foreground">{selectedStudent.studentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Exam Status</p>
                    <Badge variant={selectedStudent.isActive ? "default" : "secondary"} className={selectedStudent.isActive ? "bg-blue-600 hover:bg-blue-500" : "bg-white/10 text-slate-200"}>
                      {selectedStudent.isActive ? "Active" : "Completed"}
                    </Badge>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Overall Risk Score */}
          <motion.div variants={itemVariants}>
            <GlassCard className="border-2 border-primary/20">
              <GlassCardHeader>
                <GlassCardTitle className="text-base">Final Cheating Risk Probability</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex items-end gap-2 mb-2">
                      <p className="text-4xl font-bold text-foreground">{selectedStudent.riskScore.toFixed(1)}%</p>
                      <TrendingUp
                        className={`w-6 h-6 mb-2 ${selectedStudent.riskScore > 50 ? "text-red-400" : "text-primary"}`}
                      />
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-white/5 mb-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${selectedStudent.riskScore}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${selectedStudent.riskScore > 50 ? "bg-red-500" : "bg-blue-600"}`} />
                    </div>
                    <Badge
                      className={
                        selectedStudent.riskScore < 30
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : selectedStudent.riskScore < 60
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }
                    >
                      {selectedStudent.riskScore < 30
                        ? "Low Risk"
                        : selectedStudent.riskScore < 60
                          ? "Moderate Risk"
                          : "High Risk"}
                    </Badge>
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs text-muted-foreground mb-2">Cognitive Load</p>
                    <p className="text-2xl font-bold text-foreground mb-2">{selectedStudent.cognitiveLoad.toFixed(0)}%</p>
                    <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${selectedStudent.cognitiveLoad}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* 5 Behavioral Features Breakdown */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-base">5 Behavioral Features - Detailed Risk Breakdown</GlassCardTitle>
                <GlassCardDescription className="text-xs">Individual contribution to overall risk score</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <GlassCard className="border border-white/5 hover:border-white/10">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-primary" />
                          <GlassCardTitle className="text-sm">1. Eye Gaze Deviation</GlassCardTitle>
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Risk Contribution</span>
                          <span className="text-xl font-bold text-foreground">{gazeRisk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(gazeRisk / 40) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-blue-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Raw value: {selectedStudent.behavioralData.gazeDeviation.toFixed(0)}% deviation
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <GlassCard className="border border-white/5 hover:border-white/10">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-primary" />
                          <GlassCardTitle className="text-sm">2. Blink Rate</GlassCardTitle>
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Risk Contribution</span>
                          <span className="text-xl font-bold text-foreground">{blinkRisk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(blinkRisk / 15) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-violet-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Raw value: {selectedStudent.behavioralData.blinkRate.toFixed(0)} blinks/min
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <GlassCard className="border border-white/5 hover:border-white/10">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Keyboard className="w-5 h-5 text-primary" />
                          <GlassCardTitle className="text-sm">3. Typing Speed & Pauses</GlassCardTitle>
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Risk Contribution</span>
                          <span className="text-xl font-bold text-foreground">{typingRisk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(typingRisk / 15) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-fuchsia-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Raw value: {selectedStudent.behavioralData.typingSpeed.toFixed(0)} WPM
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <GlassCard className="border border-white/5 hover:border-white/10">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <MousePointer className="w-5 h-5 text-primary" />
                          <GlassCardTitle className="text-sm">4. Mouse Movement / Hesitation</GlassCardTitle>
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Risk Contribution</span>
                          <span className="text-xl font-bold text-foreground">{mouseRisk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(mouseRisk / 20) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Raw value: {selectedStudent.behavioralData.mouseHesitation.toFixed(0)}% hesitation
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <GlassCard className="border border-white/5 hover:border-white/10">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          <GlassCardTitle className="text-sm">5. Head Pose / Attention Score</GlassCardTitle>
                        </div>
                      </GlassCardHeader>
                      <GlassCardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Risk Contribution</span>
                          <span className="text-xl font-bold text-foreground">{headRisk.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(headRisk / 25) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-cyan-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Raw value: {selectedStudent.behavioralData.headMovement.toFixed(0)}% movement
                        </p>
                      </GlassCardContent>
                    </GlassCard>
                  </motion.div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* AI Score Estimation Panel */}
          <motion.div variants={itemVariants}>
            <GlassCard className="border-cyan-500/20 bg-cyan-500/5 mb-6">
              <GlassCardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <GlassCardTitle className="text-base text-cyan-50">AI Response Verification & Mark Estimation</GlassCardTitle>
                </div>
                <GlassCardDescription className="text-xs text-cyan-100/70">
                  Calculated deduction recommendation based on the overall Behavioral Risk Probability.
                </GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="rounded-lg border border-white/10 overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-300 uppercase bg-white/5 border-b border-white/10 whitespace-nowrap">
                      <tr>
                        <th className="px-4 py-3">Risk Assessment</th>
                        <th className="px-4 py-3">Suggested Deduction</th>
                        <th className="px-4 py-3">Estimated Score</th>
                        <th className="px-4 py-3">AI Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-transparent">
                        <td className="px-4 py-4 font-medium whitespace-nowrap">
                          <Badge className={
                            selectedStudent.riskScore < 30 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold" :
                            selectedStudent.riskScore < 60 ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold" :
                            "bg-red-500/20 text-red-300 border border-red-500/30 font-semibold"
                          }>
                            {selectedStudent.riskScore < 30 ? "Authentic (Low Risk)" : selectedStudent.riskScore < 60 ? "Suspicious (Moderate Risk)" : "High Cheating Probability"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-slate-300 font-mono whitespace-nowrap">
                           {selectedStudent.riskScore < 30 ? "0%" : selectedStudent.riskScore < 60 ? "-15% to -25%" : "-50% or Disqualification"}
                        </td>
                        <td className="px-4 py-4 font-bold text-white whitespace-nowrap">
                           {selectedStudent.riskScore < 30 ? "85 - 100 / 100" : selectedStudent.riskScore < 60 ? "60 - 85 / 100" : "0 - 45 / 100"}
                        </td>
                        <td className="px-4 py-4 text-slate-400 text-xs leading-relaxed min-w-[250px]">
                           {selectedStudent.riskScore < 30 ? "Normal behavioral patterns matching the answers. Suggest granting full marks earned by correct answers." : selectedStudent.riskScore < 60 ? "Anomalies in typing/gaze detected during answering. Verify response originality. Consider applying minor penalty." : "Significant deviations detected confirming high probability of unfair advantage. Strict manual review required. Substantial penalty or manual interview advised."}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Marks Entry Panel */}
          <motion.div variants={itemVariants}>
            <GlassCard className="border-secondary/20">
              <GlassCardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  <GlassCardTitle className="text-base">Marks Entry & Remarks</GlassCardTitle>
                </div>
                <GlassCardDescription className="text-xs">Enter final marks and comments for this student</GlassCardDescription>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marks" className="text-slate-200">Marks (out of 100)</Label>
                    <input
                      id="marks"
                      type="number"
                      min="0"
                      max="100"
                      className="w-full flex h-10 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="Enter marks (0-100)"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                    />
                    {selectedStudent.marks !== undefined && (
                      <p className="text-xs text-muted-foreground">Previously saved: {selectedStudent.marks}/100</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks" className="text-slate-200">Remarks / Comments</Label>
                    <textarea
                      id="remarks"
                      placeholder="Add your remarks or comments..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full flex min-h-[80px] rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all custom-scrollbar"
                    />
                    {selectedStudent.remarks && (
                      <p className="text-xs text-muted-foreground">Previously saved: {selectedStudent.remarks}</p>
                    )}
                  </div>
                </div>
                <Button onClick={handleSaveMarks} className="w-full shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-600 bg-blue-500" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Marks & Remarks
                </Button>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Admin / Proctor Dashboard</h1>
              <p className="text-xs text-muted-foreground">Monitor all students - Admin: {userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-white/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-500/10 hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-6 space-y-6"
      >
        <motion.div variants={itemVariants}>
          <GlassCard className="border-2 border-primary/20 bg-primary/5">
            <GlassCardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <GlassCardTitle className="text-base">Ethics & Decision Support Notice</GlassCardTitle>
                  <GlassCardDescription className="mt-2 text-xs leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">
                      This system provides decision support, not automatic accusations.
                    </span>
                    <br />
                    The AI-generated risk score is probabilistic and requires human judgment. No binary cheating label is
                    applied. Your review and expertise are essential for fair assessment.
                  </GlassCardDescription>
                </div>
              </div>
            </GlassCardHeader>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <GlassCardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Student List - Exam Attempts
                  </GlassCardTitle>
                  <GlassCardDescription className="text-xs">
                    Click on any student to view detailed risk dashboard and enter marks
                  </GlassCardDescription>
                </div>
                <Badge variant="secondary" className="text-sm bg-white/10 text-slate-200">
                  {allStudentSessions.length} {allStudentSessions.length === 1 ? "Student" : "Students"}
                </Badge>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              {allStudentSessions.length > 0 ? (
                <div className="space-y-3">
                  {allStudentSessions.map((session, idx) => (
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} key={idx}>
                      <GlassCard
                        className="border border-white/5 hover:border-primary/50 transition-all cursor-pointer bg-white/5"
                        onClick={() => setSelectedStudent(session)}
                      >
                        <GlassCardContent className="p-4">
                          <div className="grid md:grid-cols-5 gap-4 items-center">
                            <div>
                              <p className="text-sm font-semibold text-white">{session.studentName}</p>
                              <p className="text-xs text-slate-400">Roll: {session.studentId}</p>
                              <Badge variant={session.isActive ? "default" : "secondary"} className={`mt-2 text-xs ${session.isActive ? "bg-blue-600 hover:bg-blue-500" : "bg-white/10 text-slate-200"}`}>
                                {session.isActive ? "Active" : "Completed"}
                              </Badge>
                            </div>

                            <div className="text-center">
                              <p className="text-xs text-slate-400 mb-1">Risk Score</p>
                              <p className="text-2xl font-bold text-white">{session.riskScore.toFixed(1)}%</p>
                              <div className="w-full max-w-[100px] mx-auto bg-slate-800/50 rounded-full h-1.5 overflow-hidden border border-white/5 mt-1">
                                <motion.div initial={{ width: 0 }} whileInView={{ width: `${session.riskScore}%` }} className={`h-full rounded-full ${session.riskScore > 50 ? "bg-red-500" : "bg-blue-500"}`} />
                              </div>
                            </div>

                            <div className="text-center">
                              <p className="text-xs text-slate-400 mb-1">Questions</p>
                              <p className="text-base font-semibold text-white">
                                {session.currentQuestion + 1}/{session.totalQuestions}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-xs text-slate-400 mb-1">Anomalies</p>
                              <p className="text-base font-semibold text-white">{session.eventLog.length}</p>
                            </div>

                            <div className="text-right">
                              <Button size="sm" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                                View Dashboard
                              </Button>
                              {session.marks !== undefined && (
                                <p className="text-xs text-emerald-400 mt-2 font-medium">Marks: {session.marks}/100</p>
                              )}
                            </div>
                          </div>
                        </GlassCardContent>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No students have taken the exam yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Student data will appear here when they start their exam
                  </p>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
