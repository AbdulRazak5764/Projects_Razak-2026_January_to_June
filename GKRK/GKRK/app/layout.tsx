import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ExamProvider } from "@/contexts/exam-context"
import { AnimatedBackground } from "@/components/animated-background"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} min-h-screen bg-transparent text-slate-100 antialiased`}>
        <AnimatedBackground />
        <AuthProvider>
          <ExamProvider>{children}</ExamProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
