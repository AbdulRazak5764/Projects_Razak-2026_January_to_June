"use client"

import { Card } from "@/components/ui/card"
import { Brain, Zap, Activity } from "lucide-react"

export function NetworkMetrics() {
  const metrics = [
    { label: "Network Coherence", value: 87.3, unit: "%", icon: Brain },
    { label: "Signal Propagation", value: 145, unit: "ms", icon: Zap },
    { label: "Node Activity", value: 92, unit: "%", icon: Activity },
  ]

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.label} className="glass-card p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg bg-accent/20 p-2 text-accent">
              <metric.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-accent">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
              style={{ width: `${metric.value}%` }}
            />
          </div>
        </Card>
      ))}

      <Card className="glass-card p-4">
        <h4 className="mb-3 font-semibold">Network Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-background p-2">
            <span className="text-muted-foreground">Stability</span>
            <span className="font-semibold text-green-600">Optimal</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background p-2">
            <span className="text-muted-foreground">Latency</span>
            <span className="font-semibold text-accent">2.3ms</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background p-2">
            <span className="text-muted-foreground">Data Throughput</span>
            <span className="font-semibold text-accent">2.4Gbps</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-background p-2">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-semibold text-green-600">99.97%</span>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-4">
        <h4 className="mb-3 font-semibold">Model Insights</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Neural coherence shows strong correlation with retinal health metrics</p>
          <p className="text-accent">t-DNA integrity improved 2.1% in last 48h</p>
          <p>Emotional biomarker trending positive with 87% confidence</p>
        </div>
      </Card>
    </>
  )
}
