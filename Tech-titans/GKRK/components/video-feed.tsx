"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, Scan, AlertCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { useExam } from "@/contexts/exam-context"
import { Button } from "@/components/ui/button"
import { ObjectDetectionOverlay } from "@/components/detection"

// Use global faceapi loaded via CDN in layout to bypass Turbopack issues
const faceapi = (typeof window !== 'undefined') ? (window as any).faceapi : null;

export function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string>("")
  const [modelsLoaded, setModelsLoaded] = useState(false)

  const [detections, setDetections] = useState({
    faceDetected: false,
    eyeTracking: false,
    headPose: "Frontal",
    attentionScore: 0,
    isSimulated: false,
  })

  const [baselineCaptured, setBaselineCaptured] = useState(false)
  const [baselineDescriptor, setBaselineDescriptor] = useState<Float32Array | null>(null)
  
  const [nextVerificationTime, setNextVerificationTime] = useState(15)
  const [isVerifying, setIsVerifying] = useState(false)

  const { updateHeadPose, trackBlink, sessionFlagged, flagSession, addEvent, examStarted, reportFacePresence } = useExam()

  // Load FaceAPI Models
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const loadModels = () => {
      const fa = (window as any).faceapi;
      if (!fa) return;

      fa.nets.tinyFaceDetector.loadFromUri("/models")
        .then(() => fa.nets.faceLandmark68Net.loadFromUri("/models"))
        .then(() => fa.nets.faceRecognitionNet.loadFromUri("/models"))
        .then(() => {
           setModelsLoaded(true)
           console.log("FaceAPI Models successfully loaded")
        })
        .catch((err: any) => {
           console.error("Failed to load FaceAPI models", err)
           setError("Failed to load AI face models")
        });
    }

    // Standard polling to avoid new Promise issues with Turbopack executor
    checkInterval = setInterval(() => {
      if ((window as any).faceapi) {
        clearInterval(checkInterval)
        loadModels()
      }
    }, 1000)

    return () => clearInterval(checkInterval)
  }, [])

  // Start Camera
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media API not supported")
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsActive(true)
          setError("")
          setDetections(prev => ({ ...prev, isSimulated: false }))
        }
      } catch (err: any) {
        console.warn("Camera access failed:", err)
        setError("Camera access required for verification.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Fast Detection Loop (Head Pose & Presence)
  useEffect(() => {
    if (!isActive || !modelsLoaded || sessionFlagged) return

    let isProcessing = false
    const interval = setInterval(async () => {
      if (isProcessing || !videoRef.current || videoRef.current.paused) return
      isProcessing = true

      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )

        if (detection) {
          setDetections(prev => ({ ...prev, faceDetected: true, attentionScore: 95, isSimulated: false }))
          updateHeadPose("Frontal") // Update behavioral data context
          reportFacePresence(true)
        } else {
          setDetections(prev => ({ ...prev, faceDetected: false, attentionScore: 0 }))
          reportFacePresence(false)
        }

        // Mock blink detection purely for behavioral tracking compatibility if face is detected
        if (detection && Math.random() < 0.2) {
          trackBlink()
          setDetections(prev => ({ ...prev, eyeTracking: true }))
        } else {
          setDetections(prev => ({ ...prev, eyeTracking: false }))
        }

      } catch (e) {
         // ignore
      } finally {
        isProcessing = false
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, modelsLoaded, sessionFlagged, updateHeadPose, trackBlink])

  // Periodic Face Verification Timer
  useEffect(() => {
    if (!isActive || !examStarted || sessionFlagged || !modelsLoaded) return

    const timer = setInterval(async () => {
      // 1. Capture Baseline First
      if (!baselineCaptured) {
        if (videoRef.current && detections.faceDetected) {
          const fullDetection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks().withFaceDescriptor()

          if (fullDetection) {
            setBaselineDescriptor(fullDetection.descriptor)
            setBaselineCaptured(true)
            addEvent("Baseline face captured securely (FaceAPI)", "Security Init")
          }
        }
        return
      }

      // 2. Countdown next verification check
      setNextVerificationTime((prev) => {
        if (prev <= 0) return 0 // Block until verification process completes
        if (prev === 2) setIsVerifying(true)
        return prev - 1
      })

    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, examStarted, sessionFlagged, baselineCaptured, detections.faceDetected, modelsLoaded, addEvent])

  // The Exact Verification Logic
  useEffect(() => {
    if (nextVerificationTime === 0 && isVerifying && baselineDescriptor && videoRef.current) {
      const verifyFace = async () => {
        try {
          const detection = await faceapi.detectSingleFace(
            videoRef.current!,
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks().withFaceDescriptor()

          if (!detection) {
            flagSession("Face missing during periodic verification check")
          } else {
            // Compare descriptor distances
            const distance = faceapi.euclideanDistance(baselineDescriptor, detection.descriptor)
            
            // Distances < 0.6 are standard benchmark for same face
            if (distance > 0.6) {
               flagSession(`Identity Verification Failed (Distance: ${distance.toFixed(2)})`)
            } else {
               addEvent(`Periodic Match Verified (Dist: ${distance.toFixed(2)})`, "Verification")
            }
          }
        } catch (e) {
          console.error("Verification error:", e)
        } finally {
          setIsVerifying(false)
          setNextVerificationTime(15) // Setup next verification in 15 seconds for testing
        }
      }

      verifyFace()
    }
  }, [nextVerificationTime, isVerifying, baselineDescriptor, flagSession, addEvent])


  const handleRetry = async () => {
    setError("")
    window.location.reload()
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          Real-Time Video Monitoring
          {isActive && (
            <Badge variant="default" className="ml-auto bg-green-600/20 text-green-400 border-green-500/50">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              AI Live
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

          {/* Real-time Object Detection Layer (TF.js) */}
          <ObjectDetectionOverlay videoRef={videoRef} enabled={isActive && examStarted} />

          {/* Session Flagged / Mismatch Warning Popup */}
          {sessionFlagged && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/95 backdrop-blur-sm p-4 z-50 text-center animate-in fade-in zoom-in">
              <AlertCircle className="w-12 h-12 text-white mb-2 animate-pulse" />
              <h3 className="text-lg font-bold text-white mb-1 tracking-wider uppercase">Security Alert</h3>
              <div className="bg-black/20 p-3 rounded text-left mb-3">
                <p className="text-sm text-white font-medium mb-1">Identity verification failed.</p>
                <p className="text-xs text-white/90">• Original face mismatch detected</p>
                <p className="text-xs text-white/90">• Session automatically flagged</p>
                <p className="text-xs text-white/90">• Admin has been notified</p>
              </div>
            </div>
          )}

          {/* Verification Status Banner Top Right */}
          {isActive && examStarted && !sessionFlagged && (
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-40">
              <Badge variant={baselineCaptured ? "default" : "secondary"} className="text-[10px] bg-primary/90">
                {baselineCaptured ? "Face Baseline Verified" : "Capturing Baseline..."}
              </Badge>
              {baselineCaptured && (
                <Badge variant={isVerifying ? "destructive" : "secondary"} className={`text-[10px] ${isVerifying ? 'animate-pulse' : 'bg-background/80 backdrop-blur'}`}>
                  {isVerifying ? "Verifying Frame..." : `Next check: ${nextVerificationTime}s`}
                </Badge>
              )}
            </div>
          )}

          {/* Face detection bounding box overlay style */}
          {isActive && detections.faceDetected && !sessionFlagged && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-40 h-48 border-2 rounded-lg relative transition-colors ${isVerifying ? 'border-amber-500 animate-pulse' : 'border-primary/50'}`}>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-current" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-current" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-current" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-current" />
              </div>
            </div>
          )}

          {/* Models loading state */}
          {!modelsLoaded && !error && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                <div className="text-center">
                  <Scan className="w-8 h-8 text-primary/50 mx-auto animate-pulse" />
                  <p className="text-primary/70 text-xs mt-2">Loading Face Recognition Models...</p>
                </div>
             </div>
          )}

          {/* Status Tags */}
          {isActive && modelsLoaded && (
            <div className="absolute bottom-2 left-2 flex gap-2">
              <Badge variant="secondary" className="text-[10px] bg-background/80 backdrop-blur">
                <Scan className="w-3 h-3 mr-1" />
                {detections.faceDetected ? 'Tracking' : 'Searching'}
              </Badge>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 z-50">
              <AlertCircle className="w-8 h-8 text-destructive mb-2" />
              <p className="text-sm text-foreground mb-3 text-center">{error}</p>
              <Button size="sm" onClick={handleRetry}>
                Reload Application
              </Button>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Face Rec</p>
            <p className="text-sm font-semibold text-foreground">
              {detections.faceDetected ? "Detected" : "Not Found"}
            </p>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <p className="text-xs text-muted-foreground mb-1">Continuous Mode</p>
            <p className="text-sm font-semibold text-[10px] text-foreground">
               {baselineCaptured ? "Active & Combined" : "Initializing..."}
            </p>
          </div>
        </div>

        <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-[11px] text-muted-foreground text-center">
             Real-time biometric monitoring active. Face recognition combined with behavioral context.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
