import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ExamProvider } from "@/contexts/exam-context"
import { AnimatedBackground } from "@/components/animated-background"

export const metadata: Metadata = {
  title: "ExamGuard AI - Online Exam Cheating Risk Predictor",
  description: "Cognitive-behavioral, probability-based online proctoring system. B.Tech CSE Academic Project.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen bg-transparent text-slate-100 antialiased">
        <AnimatedBackground />
        
        {/* Universal AI Engine - Phase 1 */}
        <Script src="https://unpkg.com/@tensorflow/tfjs@4.20.0/dist/tf.min.js" strategy="beforeInteractive" />
        
        {/* specialized proctoring models - Phase 2 */}
        <Script src="https://unpkg.com/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js" strategy="beforeInteractive" />
        
        <AuthProvider>
          <ExamProvider>{children}</ExamProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
