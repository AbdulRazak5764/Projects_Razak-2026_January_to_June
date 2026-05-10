"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Upload, Search, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth-modal"

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BookOpen className="w-8 h-8 text-cyan-500" />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">ThesisAI</span>
          </motion.div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setAuthModal("login")} className="hover:bg-secondary">
              Sign In
            </Button>
            <Button
              onClick={() => setAuthModal("register")}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Gradient background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                Smart Thesis Management
              </span>
              <br />
              Powered by AI
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Upload your research papers and let AI automatically extract abstracts and keywords. Organize, search, and
              manage your thesis collection with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => setAuthModal("register")}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white"
              >
                Start Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setAuthModal("login")}>
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Right - Feature cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: Upload, title: "Quick Upload", desc: "PDF support" },
              { icon: Sparkles, title: "AI Magic", desc: "Auto-analysis" },
              { icon: Search, title: "Smart Search", desc: "Filter keywords" },
              { icon: BookOpen, title: "Organized", desc: "Your library" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-card border border-border hover:border-cyan-500/50 transition-colors"
                whileHover={{ y: -4 }}
              >
                <item.icon className="w-8 h-8 text-cyan-500 mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal !== null}
        mode={authModal as "login" | "register"}
        onClose={() => setAuthModal(null)}
      />
    </div>
  )
}
