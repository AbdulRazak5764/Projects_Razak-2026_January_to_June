"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Activity, MousePointer, Keyboard, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useExam } from "@/contexts/exam-context"

export function BehavioralMetrics() {
  const { behavioralData } = useExam()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Behavioral Metrics (5 Features)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Feature 1: Eye Gaze Tracking */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">1. Eye Gaze Deviation</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{behavioralData.gazeDeviation.toFixed(1)}%</span>
          </div>
          <Progress value={behavioralData.gazeDeviation} className="h-1.5" />
        </div>

        {/* Feature 2: Blink Rate Analysis */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">2. Blink Rate</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{behavioralData.blinkRate.toFixed(0)}/min</span>
          </div>
          <Progress value={(behavioralData.blinkRate / 30) * 100} className="h-1.5" />
        </div>

        {/* Feature 3: Typing Pattern */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">3. Typing Speed</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{behavioralData.typingSpeed.toFixed(0)} WPM</span>
          </div>
          <Progress value={(behavioralData.typingSpeed / 80) * 100} className="h-1.5" />
        </div>

        {/* Feature 4: Mouse Movement */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">4. Mouse Hesitation</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{behavioralData.mouseHesitation.toFixed(1)}%</span>
          </div>
          <Progress value={behavioralData.mouseHesitation} className="h-1.5" />
        </div>

        {/* Feature 5: Head Movement */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">5. Head Movement</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{behavioralData.headMovement.toFixed(1)}%</span>
          </div>
          <Progress value={behavioralData.headMovement} className="h-1.5" />
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">Real-time behavioral tracking active</p>
        </div>
      </CardContent>
    </Card>
  )
}
