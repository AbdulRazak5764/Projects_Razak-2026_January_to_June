'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Navigation() {
  const [active, setActive] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home', href: '#hero' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'education', label: 'Education', href: '#education' },
    { id: 'publications', label: 'Publications', href: '#publications' },
    { id: 'patents', label: 'Patents', href: '#patents' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => {
        const element = document.getElementById(item.id)
        return element
      })

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top < 150) {
          setActive(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-20 left-0 right-0 z-40 mt-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-dark rounded-full px-6 py-3 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(item.id)}
                className={`relative py-2 px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-full ${
                  active === item.id
                    ? 'text-primary bg-white/10 shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {item.label}
                {active === item.id && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
