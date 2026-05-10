"use client"

import Link from "next/link"
import { useState } from "react"
import { BarChart3, Eye, Brain, Activity, Zap, ChevronDown, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Eye, label: "Retinal Imaging", href: "/imaging" },
  { icon: BarChart3, label: "Predictive Analytics", href: "/analytics" },
  { icon: Brain, label: "Neural Visualization", href: "/neural" },
  { icon: Activity, label: "Health Timeline", href: "/timeline" },
  { icon: Zap, label: "AI Insights", href: "/insights" },
]

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`border-r border-border bg-sidebar transition-all ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <span className="font-semibold text-sidebar-foreground">Neuro-Glyph</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? "rotate-90" : ""}`} />
        </Button>
      </div>
      <nav className="space-y-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="w-full justify-start" title={item.label}>
              <item.icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
