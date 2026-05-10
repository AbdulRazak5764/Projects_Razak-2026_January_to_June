'use client'

import { Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-dark backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50' 
        : 'bg-background/80 border-b border-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              RPK
            </h1>
            <p className="text-xs text-muted-foreground">Associate Professor</p>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a 
              href="mailto:ramagiri.praveen594@gmail.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect hover:glass-dark transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              title="Send Email"
            >
              <Mail className="w-4 h-4 text-accent hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">Email</span>
            </a>
            <a 
              href="tel:+919618292794"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect hover:glass-dark transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              title="Call"
            >
              <Phone className="w-4 h-4 text-accent hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">Call</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
