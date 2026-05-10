"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RetinalViewer({ imageIndex }: { imageIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "rgba(20, 30, 60, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw gradient retinal pattern (simulated)
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 300)
    gradient.addColorStop(0, "rgba(255, 150, 100, 0.3)")
    gradient.addColorStop(0.5, "rgba(100, 200, 255, 0.2)")
    gradient.addColorStop(1, "rgba(50, 100, 150, 0.1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw vessel network
    ctx.strokeStyle = "rgba(255, 100, 100, 0.6)"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2
      const x = 256 + Math.cos(angle) * 200
      const y = 256 + Math.sin(angle) * 200
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()

    // Draw optic disc
    ctx.fillStyle = "rgba(200, 150, 100, 0.4)"
    ctx.beginPath()
    ctx.arc(256, 256, 80, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  return (
    <Card className="glass-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Retinal Image {imageIndex + 1}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="gap-1">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="rounded bg-background px-3 py-1 text-sm">{(zoom * 100).toFixed(0)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="gap-1">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)} className="gap-1">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-lg bg-background p-4">
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          style={{
            maxWidth: "100%",
            height: "auto",
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease",
          }}
          className="rounded"
        />
      </div>
    </Card>
  )
}
