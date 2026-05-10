'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">DiaCare Plus</h1>
            <p className="text-lg text-muted-foreground">Your Complete Diabetes Care Solution</p>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            A comprehensive management system for diabetic patients with advanced retinopathy image analysis and complete CRUD operations.
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/signup" className="w-full">
              <Button className="w-full" size="lg">
                Get Started - Sign Up
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
