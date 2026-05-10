"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface Node {
  x: number
  y: number
  z: number
  id: string
  intensity: number
}

export function NeuralCanvas({
  mode,
  animationSpeed,
  intensity,
}: { mode: string; animationSpeed: number; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initialize neural nodes
    nodesRef.current = Array.from({ length: 12 }, (_, i) => ({
      x: Math.cos((i / 12) * Math.PI * 2) * 150 + 256,
      y: Math.sin((i / 12) * Math.PI * 2) * 150 + 256,
      z: Math.sin((i / 12) * Math.PI) * 100,
      id: `node-${i}`,
      intensity: 0.5 + Math.random() * 0.5,
    }))

    const animate = () => {
      timeRef.current += animationSpeed * 0.016

      // Clear canvas
      ctx.fillStyle = "rgba(18, 24, 42, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

      ctx.fillStyle = `rgba(100, 200, 255, ${intensity})`
      particlesRef.current.forEach((p) => {
        p.x += p.vx * animationSpeed
        p.y += p.vy * animationSpeed
        p.life -= 0.02
        const radius = 2 * (p.life / 1)
        if (radius > 0) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Emit new particles from nodes
      if (Math.random() > 0.7) {
        const sourceNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)]
        const targetNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)]
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x)
        const speed = 2 + Math.random() * 2
        particlesRef.current.push({
          x: sourceNode.x,
          y: sourceNode.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
        })
      }

      // Draw neural network connections
      if (mode === "network" || mode === "tdna") {
        ctx.strokeStyle = `rgba(65, 150, 255, ${0.3 * intensity})`
        ctx.lineWidth = 1

        nodesRef.current.forEach((node, i) => {
          const nextNode = nodesRef.current[(i + 1) % nodesRef.current.length]
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(nextNode.x, nextNode.y)
          ctx.stroke()
        })

        // Draw cross-connections
        ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * intensity})`
        for (let i = 0; i < nodesRef.current.length; i += 2) {
          const node1 = nodesRef.current[i]
          const node2 = nodesRef.current[(i + 4) % nodesRef.current.length]
          ctx.beginPath()
          ctx.moveTo(node1.x, node1.y)
          ctx.lineTo(node2.x, node2.y)
          ctx.stroke()
        }
      }

      // Draw nodes
      nodesRef.current.forEach((node, i) => {
        const pulse = Math.sin(timeRef.current * 2 + i) * 0.3 + 0.7
        const radius = 8 * pulse

        // Glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2)
        gradient.addColorStop(0, `rgba(100, 200, 255, ${0.5 * intensity * node.intensity})`)
        gradient.addColorStop(1, `rgba(100, 200, 255, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Core node
        ctx.fillStyle = `rgba(150, 220, 255, ${0.9 * intensity * node.intensity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw emotional biomarker visualization
      if (mode === "emotion") {
        ctx.fillStyle = `rgba(200, 100, 255, ${0.3 * intensity})`
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + timeRef.current * 0.5
          const radius = 100 + Math.sin(timeRef.current * 2 + i) * 30
          const x = 256 + Math.cos(angle) * radius
          const y = 256 + Math.sin(angle) * radius
          ctx.beginPath()
          ctx.arc(x, y, 15 * (0.5 + 0.5 * Math.sin(timeRef.current + i)), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mode, animationSpeed, intensity])

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={512}
      className="w-full rounded-lg bg-gradient-to-b from-primary/5 to-accent/5"
    />
  )
}
