"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Loader2, X } from "lucide-react"
import { analyzeTablet } from "@/lib/detection-service"

export function CameraFeed({ onDetectionResult }: { onDetectionResult?: (result: any) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCamera, setIsCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectionResult, setDetectionResult] = useState<any>(null)

  useEffect(() => {
    if (isCamera && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          videoRef.current!.srcObject = stream
        })
        .catch((err) => console.error("Camera access denied:", err))
    } else if (!isCamera && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [isCamera])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context?.drawImage(videoRef.current, 0, 0)
      const imageData = canvasRef.current.toDataURL("image/jpeg")
      processImage(imageData)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        processImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async (imageData: string) => {
    setCapturedImage(imageData)
    setIsCamera(false)
    setIsProcessing(true)

    try {
      // Create an image element to analyze the captured image
      const img = new Image()
      img.src = imageData

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Draw image to canvas for pixel analysis
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      // Get image data for analysis
      const imageDataObj = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageDataObj?.data

      // Analyze image characteristics
      let totalBrightness = 0
      let redSum = 0, greenSum = 0, blueSum = 0
      let contrast = 0
      const pixelCount = pixels ? pixels.length / 4 : 0

      if (pixels) {
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]

          const brightness = (r + g + b) / 3
          totalBrightness += brightness
          redSum += r
          greenSum += g
          blueSum += b
        }

        const avgBrightness = totalBrightness / pixelCount
        for (let i = 0; i < pixels.length; i += 4) {
          const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
          contrast += Math.pow(brightness - avgBrightness, 2)
        }
        contrast = Math.sqrt(contrast / pixelCount)
      }

      // Create analysis data
      const analysisData = {
        imageData,
        dimensions: { width: img.width, height: img.height },
        averageBrightness: Math.round(totalBrightness / pixelCount),
        dominantColor: {
          r: Math.round(redSum / pixelCount),
          g: Math.round(greenSum / pixelCount),
          b: Math.round(blueSum / pixelCount)
        },
        contrast: Math.round(contrast),
        aspectRatio: img.width / img.height
      }

      const result = await analyzeTablet(JSON.stringify(analysisData))
      setDetectionResult(result)
      onDetectionResult?.(result)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorResult = {
        error: "Analysis failed. Please try again.",
      }
      setDetectionResult(errorResult)
      onDetectionResult?.(errorResult)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
        {isCamera && (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" width={1280} height={720} />

            {/* Tablet Detection Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-2/3 h-2/3 text-cyan-500 opacity-50" viewBox="0 0 200 250">
                <rect x="20" y="30" width="160" height="200" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="220" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </>
        )}

        {capturedImage && !isProcessing && (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
        )}

        {!isCamera && !capturedImage && (
          <div className="text-center">
            <Camera className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No image captured</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-cyan-500 mx-auto mb-3 animate-spin" />
              <p className="text-white font-semibold">Analyzing tablet...</p>
              <p className="text-slate-400 text-sm mt-1">Running AI detection</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex gap-3">
        {!isCamera ? (
          <>
            <Button
              onClick={() => setIsCamera(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <Button
              onClick={() => {
                setCapturedImage(null)
                setDetectionResult(null)
                onDetectionResult?.(null)
              }}
              variant="outline"
              className="flex-1"
              disabled={!capturedImage}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </>
        ) : (
          <Button onClick={capturePhoto} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        )}
      </div>
    </div>
  )
}
