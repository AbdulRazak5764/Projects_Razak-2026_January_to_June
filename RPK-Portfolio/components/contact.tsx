'use client'

import { Mail, Phone, ExternalLink, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'

export function Contact() {
  const [copied, setCopied] = useState('')

  const contactItems = [
    {
      icon: Mail,
      title: 'Email',
      items: [
        { label: 'Personal', value: 'ramagiri.praveen594@gmail.com', href: 'mailto:ramagiri.praveen594@gmail.com' },
        { label: 'Official', value: 'Rpkumar2024@chaitanya.edu.in', href: 'mailto:Rpkumar2024@chaitanya.edu.in' },
      ],
    },
    {
      icon: Phone,
      title: 'Phone',
      items: [
        { label: 'Mobile', value: '+91-9618292794', href: 'tel:+919618292794' },
        { label: 'Alternative', value: '+91-6303771510', href: 'tel:+916303771510' },
      ],
    },
    {
      icon: ExternalLink,
      title: 'Academic Profiles',
      items: [
        { label: 'Google Scholar', value: 'View Profile', href: 'https://scholar.google.com/citations?user=RZaoPNEAAAAJ' },
        { label: 'ORCID', value: '0000-0002-6313-7915', href: 'https://orcid.org/0000-0002-6313-7915' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">Let's collaborate or discuss research opportunities</p>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-primary rounded-full mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactItems.map((group, idx) => {
            const Icon = group.icon
            return (
              <div
                key={idx}
                className="card-premium"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-6">{group.title}</h3>

                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.href}
                      target={item.href.startsWith('http') && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:') ? 'noopener noreferrer' : undefined}
                      className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                      onClick={() => {
                        if (item.href.startsWith('mailto:') || item.href.startsWith('tel:')) {
                          handleCopy(item.value)
                        }
                      }}
                    >
                      <p className="text-xs text-muted-foreground mb-1 hover:text-accent transition-colors">{item.label}</p>
                      <div className="flex items-center gap-2 justify-between">
                        <p className="text-sm font-medium text-accent hover:text-primary transition-colors">
                          {item.value}
                        </p>
                        {item.href.startsWith('http') && !item.href.startsWith('mailto:') && !item.href.startsWith('tel:') && (
                          <ExternalLink className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      {copied === item.value && item.href.startsWith('mailto:') && (
                        <p className="text-xs text-accent mt-2">Copied!</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="card-premium flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-bold mb-6 text-foreground">Follow My Work</h3>
          <div className="flex gap-6">
            {socialLinks.map((link, idx) => {
              const Icon = link.icon
              return (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-4 rounded-lg glass-effect hover:glass-dark hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                >
                  <Icon className="w-6 h-6 text-accent hover:text-primary transition-colors" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
