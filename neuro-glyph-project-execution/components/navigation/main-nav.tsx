"use client"

import Link from "next/link"
import { Upload, Eye, Cpu, Zap, BarChart4 } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/upload", label: "Upload & Train", icon: Upload },
  { href: "/predict", label: "Predict", icon: Eye },
  { href: "/training", label: "Training", icon: Cpu },
  { href: "/inference", label: "Inference", icon: Zap },
  { href: "/dashboard/analysis", label: "History", icon: BarChart4 },
]

export function MainNav() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href}>
            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
