"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface BehavioralData {
  gazeDeviation: number
  blinkRate: number
  typingSpeed: number
  mouseHesitation: number
  headMovement: number
}

interface TimelinePoint {
  time: string
  risk: number
  cognitive: number
  timestamp: number
}

interface ExamEvent {
  time: string
  event: string
  impact: string
}

interface StudentSession {
  studentId: string
  studentName: string
  studentEmail: string
  startTime: number
  endTime?: number
  currentQuestion: number
  totalQuestions: number
  riskScore: number
  cognitiveLoad: number
  behavioralData: BehavioralData
  timelineData: TimelinePoint[]
  eventLog: ExamEvent[]
  isActive: boolean
  answers: Record<number, string>
  marks?: number
  remarks?: string
}

interface ExamContextType {
  // Exam state
  examStarted: boolean
  examCompleted: boolean
  currentQuestion: number
  totalQuestions: number
  startExam: () => void
  completeExam: () => void
  setCurrentQuestion: (q: number) => void

  // Real-time metrics
  riskScore: number
  cognitiveLoad: number
  behavioralData: BehavioralData
  timelineData: TimelinePoint[]
  eventLog: ExamEvent[]

  // Tracking functions
  trackMouseMovement: (x: number, y: number) => void
  trackTyping: (text: string, timeDelta: number) => void
  trackBlink: () => void
  updateHeadPose: (pose: string) => void

  allStudentSessions: StudentSession[]
  initializeStudentSession: (studentId: string, studentName: string) => void
  saveStudentSession: () => void
  updateStudentMarks: (studentId: string, marks: number, remarks: string) => void
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export function ExamProvider({ children }: { children: ReactNode }) {
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [riskScore, setRiskScore] = useState(15)
  const [cognitiveLoad, setCognitiveLoad] = useState(40)
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([])
  const [eventLog, setEventLog] = useState<ExamEvent[]>([])
  const [examStartTime, setExamStartTime] = useState<number>(0)

  const [allStudentSessions, setAllStudentSessions] = useState<StudentSession[]>([])
  const [currentStudentId, setCurrentStudentId] = useState<string>("")
  const [currentStudentName, setCurrentStudentName] = useState<string>("")
  const [currentStudentEmail, setCurrentStudentEmail] = useState<string>("")

  // Behavioral tracking state
  const [behavioralData, setBehavioralData] = useState<BehavioralData>({
    gazeDeviation: 8,
    blinkRate: 18,
    typingSpeed: 45,
    mouseHesitation: 12,
    headMovement: 10,
  })

  // Mouse tracking
  const [mousePositions, setMousePositions] = useState<Array<{ x: number; y: number; time: number }>>([])
  const [lastTypingTime, setLastTypingTime] = useState<number>(Date.now())
  const [typingHistory, setTypingHistory] = useState<Array<{ chars: number; time: number }>>([])
  const [blinkCount, setBlinkCount] = useState(0)
  const [blinkTimestamps, setBlinkTimestamps] = useState<number[]>([])
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number>(Date.now())

  const initializeStudentSession = (studentId: string, studentName: string, studentEmail?: string) => {
    setCurrentStudentId(studentId)
    setCurrentStudentName(studentName)
    if (studentEmail) setCurrentStudentEmail(studentEmail)
  }

  const startExam = () => {
    setExamStarted(true)
    setExamStartTime(Date.now())
    setTimelineData([
      {
        time: "0:00",
        risk: 15,
        cognitive: 40,
        timestamp: Date.now(),
      },
    ])
  }

  const saveStudentSession = () => {
    if (!currentStudentId) return

    const newSession: StudentSession = {
      studentId: currentStudentId,
      studentName: currentStudentName,
      studentEmail: currentStudentEmail || `${currentStudentId}@student.university.edu`,
      startTime: examStartTime,
      endTime: Date.now(),
      currentQuestion: currentQuestion,
      totalQuestions: 10,
      riskScore: riskScore,
      cognitiveLoad: cognitiveLoad,
      behavioralData: { ...behavioralData },
      timelineData: [...timelineData],
      eventLog: [...eventLog],
      isActive: false,
      answers: {},
    }

    setAllStudentSessions((prev) => [...prev, newSession])
  }

  const completeExam = () => {
    setExamCompleted(true)
    saveStudentSession()
  }

  // Track mouse movement
  const trackMouseMovement = (x: number, y: number) => {
    const now = Date.now()
    setMousePositions((prev) => {
      const updated = [...prev, { x, y, time: now }].slice(-50)

      if (updated.length > 10) {
        const recent = updated.slice(-10)
        const distances = recent.map((pos, i) => {
          if (i === 0) return 0
          const prev = recent[i - 1]
          return Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2))
        })
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length

        // Hesitation is inverse of smooth movement (0-40 scale)
        const hesitation = Math.max(5, Math.min(40, 40 - avgDistance / 5))

        setBehavioralData((prev) => ({
          ...prev,
          mouseHesitation: hesitation,
        }))

        // Random chance of gaze deviation increasing
        if (Math.random() < 0.05) {
          setBehavioralData((prev) => ({
            ...prev,
            gazeDeviation: Math.max(5, Math.min(50, prev.gazeDeviation + (Math.random() * 5 - 2))),
          }))
        }
      }

      return updated
    })
  }

  // Track typing
  const trackTyping = (text: string, timeDelta: number) => {
    const now = Date.now()
    const chars = text.length

    // Calculate actual time since last keystroke
    const timeSinceLastKey = now - lastKeyPressTime
    setLastKeyPressTime(now)

    setTypingHistory((prev) => {
      const updated = [...prev, { chars, time: now }].slice(-20)

      if (updated.length >= 2) {
        const recent = updated.slice(-10)
        const totalChars = recent.reduce((sum, item) => sum + item.chars, 0)
        const timeSpan = (recent[recent.length - 1].time - recent[0].time) / 1000 / 60 // in minutes
        const avgWPM = timeSpan > 0 ? totalChars / 5 / timeSpan : 0

        setBehavioralData((prevData) => {
          // Detect sudden changes relative to previous typing speed average
          if (Math.abs(avgWPM - prevData.typingSpeed) > 25) {
            addEvent("Unusual typing pattern detected", "Risk +2%")
          }
          return {
            ...prevData,
            typingSpeed: Math.max(20, Math.min(100, avgWPM)),
          }
        })
      }

      return updated
    })
  }

  // Track blinks
  const trackBlink = () => {
    const now = Date.now()
    setBlinkTimestamps((prev) => {
      const updated = [...prev, now].filter((time) => now - time < 60000)

      const blinkRate = updated.length

      setBehavioralData((prevData) => ({
        ...prevData,
        blinkRate,
      }))

      if (blinkRate < 10 || blinkRate > 30) {
        setRiskScore((prev) => Math.min(100, prev + 1))
      }

      return updated
    })
  }

  // Update head pose
  const updateHeadPose = (pose: string) => {
    let movement = 10
    if (pose === "Left" || pose === "Right") movement = 28
    if (pose === "Up" || pose === "Down") movement = 35
    if (pose === "Away") movement = 55

    setBehavioralData((prev) => ({
      ...prev,
      headMovement: movement,
    }))

    if (movement > 35) {
      addEvent(`Head turned ${pose.toLowerCase()}`, "Risk +2%")
    }
  }

  // Add event to log
  const addEvent = (event: string, impact: string) => {
    const elapsed = Math.floor((Date.now() - examStartTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

    setEventLog((prev) => [...prev, { time: timeStr, event, impact }])
  }

  // Calculate real-time risk score based on all behavioral metrics
  useEffect(() => {
    if (!examStarted || examCompleted) return

    const interval = setInterval(() => {
      // Calculate risk from each feature (0-100 scale)
      const gazeRisk = (behavioralData.gazeDeviation / 50) * 25 // Max 25% from gaze
      const blinkRisk = (Math.abs(behavioralData.blinkRate - 18) / 18) * 15 // Max 15% from blink (normal is 18)
      const mouseRisk = (behavioralData.mouseHesitation / 40) * 20 // Max 20% from mouse
      const headRisk = (behavioralData.headMovement / 55) * 25 // Max 25% from head movement
      const typingRisk = (Math.abs(behavioralData.typingSpeed - 50) / 50) * 15 // Max 15% from typing deviation

      const calculatedRisk = Math.max(5, Math.min(100, gazeRisk + blinkRisk + mouseRisk + headRisk + typingRisk))

      setRiskScore(calculatedRisk)

      // Calculate cognitive load based on activity
      const typingLoad = Math.max(0, (100 - behavioralData.typingSpeed) * 0.4)
      const mouseLoad = behavioralData.mouseHesitation * 0.6
      const baseLoad = 30 + (currentQuestion / 10) * 15

      setCognitiveLoad(Math.min(100, typingLoad + mouseLoad + baseLoad))

      const elapsed = Math.floor((Date.now() - examStartTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

      setTimelineData((prev) => {
        const newPoint = {
          time: timeStr,
          risk: calculatedRisk,
          cognitive: cognitiveLoad,
          timestamp: Date.now(),
        }
        return [...prev, newPoint].slice(-60)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [examStarted, examCompleted, behavioralData, currentQuestion, cognitiveLoad, examStartTime])

  const updateStudentMarks = (studentId: string, marks: number, remarks: string) => {
    setAllStudentSessions((prev) =>
      prev.map((session) => (session.studentId === studentId ? { ...session, marks, remarks } : session)),
    )
  }

  const value = {
    examStarted,
    examCompleted,
    currentQuestion,
    totalQuestions: 10,
    startExam,
    completeExam,
    setCurrentQuestion,
    riskScore,
    cognitiveLoad,
    behavioralData,
    timelineData,
    eventLog,
    trackMouseMovement,
    trackTyping,
    trackBlink,
    updateHeadPose,
    allStudentSessions,
    initializeStudentSession,
    saveStudentSession,
    updateStudentMarks,
  }

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}

export function useExam() {
  const context = useContext(ExamContext)
  if (!context) {
    throw new Error("useExam must be used within ExamProvider")
  }
  return context
}

export type { StudentSession, BehavioralData, TimelinePoint, ExamEvent }
