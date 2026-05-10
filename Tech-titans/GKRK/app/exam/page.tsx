"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, AlertTriangle, LogOut, Eye, MousePointer, Keyboard, Activity, TrendingUp } from "lucide-react"
import { ExamTimer } from "@/components/exam-timer"
import { VideoFeed } from "@/components/video-feed"
import { ExplainableRisk } from "@/components/analysis/explainable-risk"
import { useExam } from "@/contexts/exam-context"
import { useAuth } from "@/contexts/auth-context"

const QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    difficulty: "Easy",
    question: "What is the time complexity of binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    timeLimit: 60,
  },
  {
    id: 2,
    type: "mcq",
    difficulty: "Easy",
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    timeLimit: 60,
  },
  {
    id: 3,
    type: "text",
    difficulty: "Medium",
    question: "Explain the concept of polymorphism in object-oriented programming with an example.",
    timeLimit: 180,
  },
  {
    id: 4,
    type: "mcq",
    difficulty: "Medium",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
    timeLimit: 90,
  },
  {
    id: 5,
    type: "text",
    difficulty: "Medium",
    question: "Write a function to reverse a linked list and explain your approach.",
    timeLimit: 180,
  },
  {
    id: 6,
    type: "mcq",
    difficulty: "Easy",
    question: "Which of the following is NOT a primitive data type in Java?",
    options: ["int", "float", "String", "boolean"],
    timeLimit: 60,
  },
  {
    id: 7,
    type: "text",
    difficulty: "Hard",
    question: "Design an algorithm to detect a cycle in a linked list and explain its space-time trade-offs.",
    timeLimit: 300,
  },
  {
    id: 8,
    type: "mcq",
    difficulty: "Medium",
    question: "What design pattern is used to create a single instance of a class?",
    options: ["Factory", "Singleton", "Observer", "Strategy"],
    timeLimit: 90,
  },
  {
    id: 9,
    type: "text",
    difficulty: "Hard",
    question: "Explain how garbage collection works in Java and discuss its advantages and disadvantages.",
    timeLimit: 240,
  },
  {
    id: 10,
    type: "mcq",
    difficulty: "Hard",
    question: "What is the space complexity of merge sort algorithm?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    timeLimit: 90,
  },
]

export default function ExamPage() {
  const { isAuthenticated, userRole, userId, userName, userEmail, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login/student")
    } else if (userRole === "admin") {
      router.push("/admin")
    }
  }, [isAuthenticated, userRole, router])

  const {
    examStarted,
    examCompleted,
    currentQuestion,
    startExam,
    completeExam,
    setCurrentQuestion,
    trackMouseMovement,
    trackTyping,
    initializeStudentSession,
    resetExam,
    riskScore,
    cognitiveLoad,
    behavioralData,
  } = useExam()

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const examAreaRef = useRef<HTMLDivElement>(null)

  const handleAnswerChange = (value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [QUESTIONS[currentQuestion].id]: value,
    }))
  }

  useEffect(() => {
    if (!examStarted || examCompleted) return

    const handleMouseMove = (e: MouseEvent) => {
      trackMouseMovement(e.clientX, e.clientY)
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentAnswer = answers[QUESTIONS[currentQuestion].id] || ""
      trackTyping(currentAnswer, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [examStarted, examCompleted, trackMouseMovement, trackTyping, answers, currentQuestion])

  const handleStartExam = () => {
    if (userId && userName) {
      initializeStudentSession(userId, userName, userEmail)
    }
    startExam()
  }

  const handleNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitExam = () => {
    completeExam()
  }

  const handleLogout = () => {
    resetExam()
    logout()
    router.push("/")
  }

  if (!isAuthenticated || userRole !== "student") {
    return null
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Exam Submitted Successfully!</CardTitle>
            <CardDescription>Your responses have been recorded and are being analyzed by the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Your exam has been submitted</p>
              <p className="text-lg font-semibold text-foreground">Thank you for completing the assessment</p>
              <div className="pt-2 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground">
                  Student: <strong className="text-foreground">{userName}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Roll Number: <strong className="text-foreground">{userId}</strong>
                </p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Your exam session data has been recorded. Admin will review your performance and provide results.
              </p>
            </div>

            <Button onClick={handleLogout} className="w-full" size="lg">
              <LogOut className="w-4 h-4 mr-2" />
              Logout and Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">Roll No: {userId}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Online Examination</CardTitle>
            <CardDescription>Computer Science Fundamentals Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Total Questions</span>
                <span className="font-semibold text-foreground">{QUESTIONS.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Total Duration</span>
                <span className="font-semibold text-foreground">
                  {Math.floor(QUESTIONS.reduce((acc, q) => acc + q.timeLimit, 0) / 60)} minutes
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Question Types</span>
                <span className="font-semibold text-foreground">Multiple Choice & Text</span>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Proctoring Notice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This exam session will be monitored for security purposes using behavioral analysis. The system tracks 5
                key behavioral features: eye gaze, head pose, typing patterns, mouse movements, and blink rate. Please
                ensure you are in a quiet environment.
              </p>
            </div>

            <Button onClick={handleStartExam} className="w-full" size="lg">
              Start Exam Ready
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen bg-background" ref={examAreaRef}>
      <div className="grid lg:grid-cols-3 gap-4 p-4 h-screen">
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Computer Science Fundamentals</h1>
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {QUESTIONS.length} • {userName} ({userId})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ExamTimer timeLimit={question.timeLimit} />
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      question.difficulty === "Easy"
                        ? "default"
                        : question.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline">{question.type === "mcq" ? "Multiple Choice" : "Text Answer"}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{question.timeLimit} seconds</span>
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.type === "mcq" && question.options ? (
                <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange}>
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={option} id={`option-${idx}`} />
                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              )}

              <div className="flex items-center justify-between gap-4">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentQuestion
                          ? "bg-primary"
                          : answers[QUESTIONS[idx].id]
                            ? "bg-primary/50"
                            : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                {currentQuestion === QUESTIONS.length - 1 ? (
                  <Button onClick={handleSubmitExam}>Submit Exam</Button>
                ) : (
                  <Button onClick={handleNextQuestion}>Next</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exam Progress</span>
                  <span className="font-semibold text-foreground">
                    {Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%
                  </span>
                </div>
                <Progress value={((currentQuestion + 1) / QUESTIONS.length) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 overflow-y-auto">
          <ExplainableRisk />
          <VideoFeed />

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Live Risk Indicator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Cheating Risk Probability</span>
                  <span className="text-2xl font-bold text-foreground">{riskScore.toFixed(1)}%</span>
                </div>
                <Progress value={riskScore} className="h-3" />
                <Badge
                  variant={riskScore < 30 ? "default" : riskScore < 60 ? "secondary" : "destructive"}
                  className="mt-2"
                >
                  {riskScore < 30 ? "Low Risk" : riskScore < 60 ? "Moderate Risk" : "High Risk"}
                </Badge>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This is a probability-based risk indicator, not an
                  accusation. Stay focused and maintain natural behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">5 Behavioral Features</CardTitle>
              <CardDescription className="text-xs">Real-time monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Eye Gaze Deviation</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {behavioralData.gazeDeviation.toFixed(0)}%
                  </span>
                </div>
                <Progress value={behavioralData.gazeDeviation} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Head Pose / Attention</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {behavioralData.headMovement.toFixed(0)}%
                  </span>
                </div>
                <Progress value={behavioralData.headMovement} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Typing Speed & Pauses</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {behavioralData.typingSpeed.toFixed(0)} WPM
                  </span>
                </div>
                <Progress value={(behavioralData.typingSpeed / 100) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Mouse Movement</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {behavioralData.mouseHesitation.toFixed(0)}%
                  </span>
                </div>
                <Progress value={behavioralData.mouseHesitation} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Blink Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {behavioralData.blinkRate.toFixed(0)}/min
                  </span>
                </div>
                <Progress value={(behavioralData.blinkRate / 30) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Cognitive Load</span>
                  <span className="text-lg font-semibold text-foreground">{cognitiveLoad.toFixed(0)}%</span>
                </div>
                <Progress value={cognitiveLoad} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
