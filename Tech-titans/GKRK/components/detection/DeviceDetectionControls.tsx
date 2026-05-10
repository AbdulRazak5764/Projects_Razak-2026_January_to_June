"use client"

import { useExam } from "@/contexts/exam-context"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardDescription } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Watch, Users, ShieldAlert, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface DetectionRisk {
  name: string
  icon: any
  riskDelta: number
  color: string
  reason: string
}

const DETECTIONS: DetectionRisk[] = [
  {
    name: "Mobile Device 📱",
    icon: Smartphone,
    riskDelta: 30,
    color: "border-red-500/30 bg-red-500/10 text-red-400",
    reason: "Mobile device detected"
  },
  {
    name: "Smartwatch ⌚",
    icon: Watch,
    riskDelta: 20,
    color: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    reason: "Smartwatch detected"
  },
  {
    name: "Multiple Persons 👤👤",
    icon: Users,
    riskDelta: 25,
    color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    reason: "Multiple persons detected"
  }
]

export function DeviceDetectionControls() {
  const { addEvent, setExternalRiskOffset } = useExam()
  const [recentDetections, setRecentDetections] = useState<string[]>([])

  const simulateDetection = (detection: DetectionRisk) => {
    // Add explainable event (auto-shows in dashboard eventLog)
    addEvent(detection.reason, `Risk +${detection.riskDelta}`)
    
    // Bump risk offset (persists through periodic calculation)
    setExternalRiskOffset((prev) => Math.min(60, prev + detection.riskDelta))
    
    // Track recent for UI
    setRecentDetections(prev => [detection.reason, ...prev.slice(0, 2)])
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1"
    >
      <GlassCard className="h-full border-primary/20">
        <GlassCardHeader className="pb-2">
          <GlassCardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Detection Controls
          </GlassCardTitle>
          <GlassCardDescription className="text-xs">
            Simulate external device detection
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent className="space-y-2 pt-1">
          <div className="grid grid-cols-1 gap-2">
            {DETECTIONS.map((detection, idx) => {
              const Icon = detection.icon
              return (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className={`h-10 justify-start gap-2 text-xs font-medium border-2 hover:scale-[1.02] ${detection.color} hover:${detection.color.replace('10', '20')}`}
                  onClick={() => simulateDetection(detection)}
                >
                  <Icon className="w-4 h-4 h-4 flex-shrink-0" />
                  <span>{detection.name}</span>
                  <Badge 
                    variant="secondary" 
                    className="ml-auto h-5 px-2 text-[10px] font-mono bg-white/10 border-white/20"
                  >
                    +{detection.riskDelta}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {recentDetections.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Recent Triggers
              </p>
              <div className="flex flex-wrap gap-1">
                {recentDetections.map((reason, i) => (
                  <Badge 
                    key={i} 
                    variant="destructive" 
                    className="text-[10px] h-4 px-1.5 bg-destructive/20 border-destructive/30"
                  >
                    {reason.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  )
}

