"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, Scan, AlertCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { useExam } from "@/contexts/exam-context"
import { Button } from "@/components/ui/button"

export function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string>("")
  const [detections, setDetections] = useState({
    faceDetected: false,
    eyeTracking: false,
    headPose: "Frontal",
    attentionScore: 0,
    isSimulated: false,
  })

  const { updateHeadPose, trackBlink } = useExam()

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media API not supported in this context (requires HTTPS or localhost)")
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsActive(true)
          setError("")
          setDetections(prev => ({ ...prev, isSimulated: false }))
        }
      } catch (err: any) {
        console.warn("[v0] Camera access failed, entering simulated mode:", err)
        setError("")
        setIsActive(true)
        setDetections(prev => ({ ...prev, isSimulated: true }))
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      // Simulate face detection analysis
      const faceDetected = Math.random() > 0.05
      const eyeTracking = faceDetected && Math.random() > 0.1
      const poses = ["Frontal", "Left", "Right", "Up", "Down"]
      const weights = [0.7, 0.1, 0.1, 0.05, 0.05] // Frontal is most common

      const randomPose = () => {
        const rand = Math.random()
        let sum = 0
        for (let i = 0; i < weights.length; i++) {
          sum += weights[i]
          if (rand < sum) return poses[i]
        }
        return poses[0]
      }

      const headPose = faceDetected ? randomPose() : "Not Detected"
      const attentionScore = faceDetected ? Math.max(60, Math.min(100, 85 + Math.random() * 20 - 10)) : 0

      setDetections(prev => ({
        ...prev,
        faceDetected,
        eyeTracking,
        headPose,
        attentionScore,
      }))

      // Update context with head pose
      if (faceDetected) {
        updateHeadPose(headPose)
      }

      // Random blink detection
      if (eyeTracking && Math.random() < 0.3) {
        trackBlink()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive, updateHeadPose, trackBlink])

  const handleRetry = async () => {
    setError("")
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media API not supported in this context")
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
        setDetections(prev => ({ ...prev, isSimulated: false }))
      }
    } catch (err: any) {
      console.warn("Camera retry failed, staying in simulated mode:", err)
      setIsActive(true)
      setDetections(prev => ({ ...prev, isSimulated: true }))
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          Video Monitoring
          {isActive && (
            <Badge variant="default" className="ml-auto">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          )}
          {error && (
            <Badge variant="destructive" className="ml-auto">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Real Video Feed */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary/30">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${detections.isSimulated ? 'hidden' : ''}`} />

          {/* Simulated Mode Placeholder */}
          {detections.isSimulated && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80">
              <div className="text-center">
                <Video className="w-10 h-10 text-primary/40 mx-auto mb-2 animate-pulse" />
                <p className="text-primary/60 font-medium text-sm">Simulated Camera Feed</p>
                <p className="text-muted-foreground text-xs mt-1">Due to HTTP network restrictions,<br/>falling back to simulated AI analysis</p>
              </div>
            </div>
          )}

          {/* Face detection overlay */}
          {isActive && detections.faceDetected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-40 border-2 border-primary rounded-lg relative animate-pulse">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />

                {/* Eye tracking indicators */}
                {detections.eyeTracking && (
                  <>
                    <div className="absolute top-12 left-8 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <div className="absolute top-12 right-8 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Status overlay */}
          {isActive && (
            <>
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur">
                  <Scan className="w-3 h-3 mr-1" />
                  Scanning
                </Badge>
              </div>

              <div className="absolute bottom-2 right-2">
                <Badge variant="default" className="text-xs bg-primary/90">
                  <Eye className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
              <AlertCircle className="w-8 h-8 text-destructive mb-2" />
              <p className="text-sm text-foreground mb-3">{error}</p>
              <Button size="sm" onClick={handleRetry}>
                Retry Camera Access
              </Button>
            </div>
          )}
        </div>

        {/* Detection Status */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Face</p>
            <p className="text-sm font-semibold text-foreground">
              {detections.faceDetected ? "Detected" : "Not Found"}
            </p>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Eye Track</p>
            <p className="text-sm font-semibold text-foreground">{detections.eyeTracking ? "Active" : "Inactive"}</p>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Head Pose</p>
            <p className="text-sm font-semibold text-foreground">{detections.headPose}</p>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Attention</p>
            <p className="text-sm font-semibold text-foreground">{detections.attentionScore.toFixed(0)}%</p>
          </div>
        </div>

        <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground text-center">
            {isActive ? "Real webcam feed with simulated AI detection" : "Waiting for camera access..."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
