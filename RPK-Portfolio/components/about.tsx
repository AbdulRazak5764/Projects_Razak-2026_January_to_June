'use client'

import { useEffect, useState } from 'react'
import { Lightbulb, Target, Zap } from 'lucide-react'

export function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('about')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const interests = [
    {
      icon: Lightbulb,
      title: 'Computational Nanoscience',
      description: 'Advanced simulations and theoretical modeling at the nanoscale'
    },
    {
      icon: Zap,
      title: 'Data Science & ML',
      description: 'Machine learning applications in climate and healthcare analytics'
    },
    {
      icon: Target,
      title: 'Climate Analytics',
      description: 'Environmental data analysis and predictive modeling'
    },
  ]

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">About Me</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-accent to-primary rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="card-premium">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Professional Objective</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To pursue a professional career with established organizations in development and research realms, seeking long-term association where individual skills, hard work, and honesty are recognized in a conducive work culture that fosters innovation and excellence.
              </p>
            </div>

            <div className="card-premium">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Research Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Dedicated to bridging the gap between theoretical research and practical applications. Passionate about leveraging computational methods and data-driven insights to solve real-world problems in environmental and healthcare domains.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground">Core Research Interests</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {interests.map((interest, idx) => {
                const Icon = interest.icon
                return (
                  <div key={idx} className="card-premium cursor-pointer hover:scale-105">
                    <Icon className="w-12 h-12 text-accent mb-4 hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-lg font-semibold mb-3 text-foreground hover:text-gradient transition-all duration-300">{interest.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{interest.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
