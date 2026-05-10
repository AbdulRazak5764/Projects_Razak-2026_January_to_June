import { AnalyticsHub } from "@/components/dashboard/analytics-hub"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { TopNav } from "@/components/navigation/top-nav"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Patient Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time analytics and predictive insights powered by quantum-inspired AI
            </p>
          </div>
          <AnalyticsHub />
        </main>
      </div>
    </div>
  )
}
