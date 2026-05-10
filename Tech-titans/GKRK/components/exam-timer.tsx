"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface ExamTimerProps {
  timeLimit: number
}

export function ExamTimer({ timeLimit }: ExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)

  useEffect(() => {
    setTimeRemaining(timeLimit)
  }, [timeLimit])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const isLowTime = timeRemaining < 30

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isLowTime ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="font-mono font-semibold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  )
}
