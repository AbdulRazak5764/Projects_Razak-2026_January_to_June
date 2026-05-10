"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from "lucide-react"

interface TimelineEvent {
  date: string
  title: string
  description: string
  type: "milestone" | "alert" | "update" | "insight"
  icon: React.ReactNode
  details: string[]
}

const timelineEvents: TimelineEvent[] = [
  {
    date: "2024-12-01",
    title: "Health Score Milestone",
    description: "Retinal health reached 94.2%, highest in history",
    type: "milestone",
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    details: ["Vessel integrity +3.2%", "Layer thickness normalized", "Recovery time improved"],
  },
  {
    date: "2024-11-15",
    title: "Stress Pattern Detection",
    description: "Elevated stress detected, recommended intervention",
    type: "alert",
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    details: ["Stress level 15% above baseline", "Retinal changes correlate", "Wellness program recommended"],
  },
  {
    date: "2024-11-01",
    title: "AI Model Update",
    description: "New quantum-inspired algorithm deployed",
    type: "update",
    icon: <Zap className="h-5 w-5 text-cyan-500" />,
    details: ["Prediction accuracy +2.3%", "Processing speed improved", "New biomarkers enabled"],
  },
  {
    date: "2024-10-15",
    title: "Trend Analysis",
    description: "Positive trajectory confirmed in health metrics",
    type: "insight",
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    details: ["Consistent improvement over 8 weeks", "Risk score declining", "Intervention effective"],
  },
]

export function HealthTimeline({
  selectedDate,
  onDateSelect,
}: { selectedDate: any; onDateSelect: (date: any) => void }) {
  return (
    <Card className="glass-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Event Timeline</h3>
        <p className="text-xs text-muted-foreground">Key milestones and health-related events</p>
      </div>

      <div className="space-y-4">
        {timelineEvents.map((event, idx) => (
          <button
            key={idx}
            onClick={() => onDateSelect(event.date)}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
              selectedDate === event.date
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/50 hover:bg-accent/5"
            }`}
          >
            <div className="flex gap-4">
              <div className="mt-1">{event.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{event.title}</h4>
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                {selectedDate === event.date && (
                  <div className="mt-3 space-y-1 rounded-lg bg-background/50 p-2">
                    {event.details.map((detail, i) => (
                      <p key={i} className="text-xs text-foreground">
                        • {detail}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Vertical Timeline Visualization */}
      <div className="mt-8">
        <div className="relative space-y-6 pl-6">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-4 mt-1 h-3 w-3 rounded-full bg-accent" />
              {idx < timelineEvents.length - 1 && <div className="absolute -left-3 top-3 h-6 w-0.5 bg-border" />}
              <div>
                <p className="text-xs font-medium text-muted-foreground">{event.date}</p>
                <p className="text-sm font-semibold">{event.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
