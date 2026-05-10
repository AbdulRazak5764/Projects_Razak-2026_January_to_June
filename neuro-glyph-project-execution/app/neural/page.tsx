"use client"

import { useState } from "react"
import { NeuralCanvas } from "@/components/neural/neural-canvas"
import { NeuralControls } from "@/components/neural/neural-controls"
import { NetworkMetrics } from "@/components/neural/network-metrics"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { TopNav } from "@/components/navigation/top-nav"
import { Card } from "@/components/ui/card"

export default function NeuralPage() {
  const [visualizationMode, setVisualizationMode] = useState("network")
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [particleIntensity, setParticleIntensity] = useState(0.7)

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="border-b border-border px-6 py-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Neural Architecture Visualization</h1>
              <p className="text-sm text-muted-foreground">
                Interactive 3D t-DNA network and emotional biomarker visualization with real-time particle dynamics
              </p>
            </div>
          </div>

          <div className="flex gap-6 p-6">
            {/* Main Visualization */}
            <div className="flex-1 space-y-4">
              <Card className="glass-card overflow-hidden p-4">
                <NeuralCanvas mode={visualizationMode} animationSpeed={animationSpeed} intensity={particleIntensity} />
              </Card>

              {/* Controls */}
              <NeuralControls
                mode={visualizationMode}
                onModeChange={setVisualizationMode}
                animationSpeed={animationSpeed}
                onAnimationSpeedChange={setAnimationSpeed}
                particleIntensity={particleIntensity}
                onParticleIntensityChange={setParticleIntensity}
              />
            </div>

            {/* Sidebar Metrics */}
            <div className="w-80 space-y-4">
              <NetworkMetrics />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
