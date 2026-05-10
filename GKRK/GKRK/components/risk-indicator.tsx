"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react"

interface RiskIndicatorProps {
  riskScore: number
}

export function RiskIndicator({ riskScore }: RiskIndicatorProps) {
  const getRiskLevel = () => {
    if (riskScore < 30)
      return {
        label: "Low Risk",
        icon: ShieldCheck,
        color: "text-chart-5",
        bgColor: "bg-chart-5/10",
        borderColor: "border-chart-5/20",
      }
    if (riskScore < 60)
      return {
        label: "Moderate Risk",
        icon: AlertCircle,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/20",
      }
    return {
      label: "High Risk",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
    }
  }

  const risk = getRiskLevel()
  const Icon = risk.icon

  return (
    <Card className={`border-2 ${risk.borderColor}`}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={`w-4 h-4 ${risk.color}`} />
          Cheating Risk Probability
        </CardTitle>
        <CardDescription className="text-xs">Real-time assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-foreground">{riskScore.toFixed(1)}%</span>
            <span className={`text-sm font-semibold ${risk.color}`}>{risk.label}</span>
          </div>
          <Progress value={riskScore} className="h-3" />
        </div>

        <div className={`p-3 rounded-lg ${risk.bgColor}`}>
          <p className={`text-xs font-medium ${risk.color} mb-1`}>Assessment Factors:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Behavioral: 40% weight</li>
            <li>• Performance: 25% weight</li>
            <li>• Environmental: 20% weight</li>
            <li>• Digital: 15% weight</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
