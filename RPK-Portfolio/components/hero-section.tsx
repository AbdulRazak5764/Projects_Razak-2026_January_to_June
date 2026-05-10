'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ExternalLink, ArrowDown } from 'lucide-react'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { value: '16+', label: 'Publications', icon: '📚' },
    { value: '2', label: 'Patents', icon: '🏆' },
    { value: '5.3+', label: 'Years', icon: '⭐' },
    { value: 'Ph.D', label: 'Qualification', icon: '🎓' },
  ]

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-primary/15 to-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`flex justify-center md:justify-start transform transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
            <div className="relative w-72 h-80 md:w-80 md:h-96">
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 rounded-3xl blur-2xl animate-glow"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/5 p-1 rounded-3xl border border-white/10">
                <Image
                  src="/profile.jpg"
                  alt="Dr. Ramagiri Praveen Kumar"
                  width={320}
                  height={380}
                  className="object-cover rounded-3xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '200ms' }}>
            <div className="space-y-6">
              <div className="inline-block animate-scale-in">
                <span className="px-4 py-2 rounded-full glass-effect text-xs font-semibold text-accent border border-accent/30">
                  Associate Professor & Researcher
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                <span className="text-gradient">Dr. Ramagiri</span>
                <br />
                <span className="text-gradient">Praveen Kumar</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-balance">
                Computational Nanoscience & Data Science Expert. Pioneering research in machine learning applications, climate analytics, and healthcare visualization with 16+ publications and 2 patents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#contact"
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Get in Touch
                  <ArrowDown className="w-4 h-4" />
                </a>
                <a 
                  href="https://scholar.google.com/citations?user=RZaoPNEAAAAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl font-semibold border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
                >
                  View Research
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="card-premium cursor-pointer hover:scale-105"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                      <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">{stat.label}</p>
                    </div>
                    <span className="text-2xl hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <ArrowDown className="w-5 h-5 text-accent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
