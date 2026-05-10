"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain } from "lucide-react"

interface CognitiveLoadPanelProps {
  cognitiveLoad: number
}

export function CognitiveLoadPanel({ cognitiveLoad }: CognitiveLoadPanelProps) {
  const getLoadLevel = () => {
    if (cognitiveLoad < 30) return { label: "Low", color: "text-chart-5" }
    if (cognitiveLoad < 70) return { label: "Moderate", color: "text-primary" }
    return { label: "High", color: "text-destructive" }
  }

  const loadLevel = getLoadLevel()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Cognitive Load
        </CardTitle>
        <CardDescription className="text-xs">Mental effort estimation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">{cognitiveLoad.toFixed(1)}%</span>
            <span className={`text-sm font-semibold ${loadLevel.color}`}>{loadLevel.label}</span>
          </div>
          <Progress value={cognitiveLoad} className="h-2" />
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {cognitiveLoad < 30 &&
              "Student appears to be handling the question comfortably with minimal mental strain."}
            {cognitiveLoad >= 30 &&
              cognitiveLoad < 70 &&
              "Moderate cognitive engagement detected. This is typical for problem-solving tasks."}
            {cognitiveLoad >= 70 &&
              "High mental effort detected. May indicate difficulty with the question or complex reasoning."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
