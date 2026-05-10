import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { Navigation } from '@/components/navigation'
import { About } from '@/components/about'
import { Experience } from '@/components/experience'
import { Education } from '@/components/education'
import { Publications } from '@/components/publications'
import { Patents } from '@/components/patents'
import { Achievements } from '@/components/achievements'
import { Certifications } from '@/components/certifications'
import { Skills } from '@/components/skills'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      <HeroSection />
      <main className="max-w-6xl mx-auto">
        <About />
        <Experience />
        <Education />
        <Skills />
        <Publications />
        <Patents />
        <Projects />
        <Achievements />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
