"use client"

import { useEffect, useRef, useState } from "react"
import { useExam } from "@/contexts/exam-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Users, Watch, EyeOff, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface ObjectDetectionOverlayProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>
  enabled?: boolean
}

export function ObjectDetectionOverlay({ videoRef, enabled = false }: ObjectDetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [model, setModel] = useState<any>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [lastDetection, setLastDetection] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(true) // Show by default as requested
  const { addEvent, riskScore, setExternalRiskOffset } = useExam()

  const requestRef = useRef<number | null>(null)
  const isMountedRef = useRef(true)

  // Labels to specifically track
  const SUSPICIOUS_LABELS = ['cell phone', 'laptop', 'mouse', 'remote', 'book', 'clock', 'laptop']

  // Load TF.js + Coco-SSD via CDN
  useEffect(() => {
    isMountedRef.current = true
    
    let checkInterval: NodeJS.Timeout;

    const loadCocoSsd = () => {
      console.log("Checking for Object Detection Libraries...")
      const coco = (window as any).cocoSsd;
      if (!coco) return;

      coco.load()
        .then((loadedModel: any) => {
          if (isMountedRef.current) {
            setModel(loadedModel)
            console.log("Object Detection Model Loaded Successfully")
          }
        })
        .catch((err: any) => {
          console.error("CocoSSD Model load error:", err)
        });
    }

    // Polling without new Promise constructor to bypass Turbopack issues
    checkInterval = setInterval(() => {
      if ((window as any).cocoSsd) {
        clearInterval(checkInterval)
        loadCocoSsd()
      }
    }, 1000)

    return () => { 
      isMountedRef.current = false 
      clearInterval(checkInterval)
    }
  }, [])

  // Detection function handles its own loop to avoid piling up callbacks on re-renders
  useEffect(() => {
    if (!model || !enabled || !videoRef?.current || riskScore > 98) {
      setIsDetecting(false)
      return
    }

    let isActive = true

    const detect = () => {
      if (!isActive || !videoRef.current || !canvasRef.current || !model) return

      const video = videoRef.current
      if (video.readyState < 2) { // HAVE_CURRENT_DATA
        requestRef.current = requestAnimationFrame(detect)
        return
      }

      const canvas = canvasRef.current
      // Match the DISPLAY size of the video element for accurate bounding boxes
      canvas.width = video.clientWidth
      canvas.height = video.clientHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      setIsDetecting(true)

      model.detect(video)
        .then((predictions: any) => {
          // Calculate scaling if video is displayed differently than its raw pixels
          const scaleX = canvas.width / video.videoWidth
          const scaleY = canvas.height / video.videoHeight
          
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          let detectedMobile = false
          let detectedOtherDevice = false
          let detectedMultiplePersons = false
          let personCount = 0

          predictions.forEach((pred: any) => {
            const { bbox, class: className, score } = pred
            const conf = Math.round(score * 100)

            if (conf < 20) return // Aggressive detection for dark objects / phones

            // Scale coordinates
            const [x, y, w, h] = [bbox[0] * scaleX, bbox[1] * scaleY, bbox[2] * scaleX, bbox[3] * scaleY]

            // 1. DRAW RECTANGLE BOX
            const color = className === 'cell phone' ? '#ef4444' : 
                          (['laptop', 'remote', 'book', 'mouse'].includes(className)) ? '#f59e0b' : 
                          className === 'person' ? '#10b981' : '#f59e0b'

            ctx.strokeStyle = color
            ctx.lineWidth = 4 
            ctx.strokeRect(x, y, w, h)

            // 2. DRAW LABEL BACKGROUND
            ctx.fillStyle = color
            const text = `${className.toUpperCase()} ${conf}%`
            const textWidth = ctx.measureText(text).width
            ctx.fillRect(x, y > 25 ? y - 25 : y, textWidth + 10, 20)

            // 3. DRAW TEXT
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 13px Inter, sans-serif"
            ctx.fillText(text, x + 5, y > 25 ? y - 10 : y + 15)

            // Check detections
            if (className === 'cell phone' || className === 'remote' || className === 'small electronic') detectedMobile = true
            if (['laptop', 'book', 'mouse'].includes(className)) detectedOtherDevice = true
            if (className === 'person') {
              personCount++
              if (personCount >= 2) detectedMultiplePersons = true
            }
          })

          // Trigger risk events
          if (detectedMobile && lastDetection !== 'mobile') {
            addEvent('Mobile device detected (Real-Time AI)', 'Risk +35')
            setExternalRiskOffset((prev) => Math.min(100, prev + 35))
            setLastDetection('mobile')
          } else if (detectedOtherDevice && lastDetection !== 'device') {
            addEvent('External unauthorized object detected', 'Risk +15')
            setExternalRiskOffset((prev) => Math.min(100, prev + 15))
            setLastDetection('device')
          } else if (detectedMultiplePersons && lastDetection !== 'multiple') {
            addEvent('Multiple persons detected in frame', 'Risk +25')
            setExternalRiskOffset((prev) => Math.min(100, prev + 25))
            setLastDetection('multiple')
          } else if (!detectedMobile && !detectedOtherDevice && !detectedMultiplePersons) {
            setLastDetection(null)
          }

          if (isActive) requestRef.current = requestAnimationFrame(detect)
        })
        .catch((error: any) => {
          console.warn('Detection error:', error)
          if (isActive) requestRef.current = requestAnimationFrame(detect)
        });
    }

    requestRef.current = requestAnimationFrame(detect)

    return () => {
      isActive = false
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [model, enabled, videoRef, riskScore, addEvent, setExternalRiskOffset, lastDetection])

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-black/50 backdrop-blur-sm border-white/20 text-[10px] h-8"
          onClick={() => window.location.reload()}
        >
          Re-Sync AI
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`backdrop-blur-sm border-white/20 text-xs h-9 px-3 transition-colors ${showOverlay ? 'bg-primary/20 text-primary border-primary/50' : 'bg-black/50 text-white'}`}
          onClick={() => setShowOverlay(!showOverlay)}
        >
          {showOverlay ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {showOverlay ? 'Hide Labels' : 'Show Labels'}
          <Badge className="ml-2 h-4 px-1 text-[10px] bg-primary/20">
            {model ? 'AI LIVE' : 'INITIALIZING...'}
          </Badge>
        </Button>
      </div>

      {!model && enabled && (
        <div className="absolute top-16 right-4 z-50 animate-pulse">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px]">
            Waiting for detection engine...
          </Badge>
        </div>
      )}

      {showOverlay && (
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none rounded-lg z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {isDetecting && lastDetection && (
        <motion.div
          className="absolute bottom-4 left-4 z-50 bg-destructive/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/50 shadow-lg"
          initial={{ scale: 0.8, y: 10 }}
          animate={{ scale: 1, y: 0 }}
        >
          <Badge variant="destructive" className="text-xs font-bold tracking-tight">
            {lastDetection === 'mobile' ? <Smartphone className="w-3 h-3 mr-1.5" /> : 
             lastDetection === 'multiple' ? <Users className="w-3 h-3 mr-1.5" /> :
             <Watch className="w-3 h-3 mr-1.5" />}
            AI ALERT: {lastDetection.toUpperCase()} DETECTED [+RISK]
          </Badge>
        </motion.div>
      )}
    </>
  )
}


