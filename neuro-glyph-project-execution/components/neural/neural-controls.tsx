"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"
import { useState } from "react"

export function NeuralControls({
  mode,
  onModeChange,
  animationSpeed,
  onAnimationSpeedChange,
  particleIntensity,
  onParticleIntensityChange,
}: {
  mode: string
  onModeChange: (mode: string) => void
  animationSpeed: number
  onAnimationSpeedChange: (speed: number) => void
  particleIntensity: number
  onParticleIntensityChange: (intensity: number) => void
}) {
  const [isPlaying, setIsPlaying] = useState(true)

  const modes = [
    { id: "network", label: "Neural Network", description: "t-DNA node connections" },
    { id: "tdna", label: "t-DNA Structure", description: "Temporal DNA architecture" },
    { id: "emotion", label: "Emotion Biomarker", description: "Emotional correlation field" },
    { id: "flow", label: "Data Flow", description: "Information propagation" },
  ]

  return (
    <Card className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Visualization Controls</h3>
        <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="gap-2">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-medium">Visualization Mode</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                mode === m.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
              }`}
            >
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Animation Speed</label>
            <span className="text-xs text-muted-foreground">{animationSpeed.toFixed(1)}x</span>
          </div>
          <Slider
            value={[animationSpeed]}
            onValueChange={(val) => onAnimationSpeedChange(val[0])}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Particle Intensity</label>
            <span className="text-xs text-muted-foreground">{(particleIntensity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[particleIntensity]}
            onValueChange={(val) => onParticleIntensityChange(val[0])}
            min={0}
            max={1}
            step={0.05}
            className="w-full"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 space-y-2 rounded-lg bg-background/50 p-3 text-xs text-muted-foreground">
        <p>Nodes: {12}</p>
        <p>Connections: {24}</p>
        <p>Processing: Real-time WebGL rendering</p>
      </div>
    </Card>
  )
}
