"use client"

import type React from "react"

import { useState } from "react"
import { Activity, BarChart3, Eye, Zap, Brain, Upload, Cpu, BarChart4 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Neuro-Glyph</h1>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm">
                Docs
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                Launch
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Link href="/upload">
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
                <Upload className="h-4 w-4" />
                Upload & Train
              </Button>
            </Link>
            <Link href="/predict">
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
                <Eye className="h-4 w-4" />
                Predict Disease
              </Button>
            </Link>
            <Link href="/training">
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
                <Cpu className="h-4 w-4" />
                Model Training
              </Button>
            </Link>
            <Link href="/inference">
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
                <Zap className="h-4 w-4" />
                Real-time Inference
              </Button>
            </Link>
            <Link href="/dashboard/analysis">
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap bg-transparent">
                <BarChart4 className="h-4 w-4" />
                Analysis History
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Quantum Intelligence Meets Retinal Science</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Advanced ML-powered retinal image analysis with real-time disease prediction, model training, and inference.
            Transform healthcare through precision analysis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Analysis
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="Image Upload & Training"
            description="Upload retinal images and automatically train ML models with GPU acceleration"
            link="/upload"
          />
          <FeatureCard
            icon={<Eye className="h-6 w-6" />}
            title="Disease Prediction"
            description="AI-powered disease detection with confidence scores and clinical recommendations"
            link="/predict"
          />
          <FeatureCard
            icon={<Cpu className="h-6 w-6" />}
            title="Model Training"
            description="Train deep learning models on retinal datasets with real-time monitoring"
            link="/training"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Real-time Inference"
            description="Sub-200ms predictions using optimized inference pipelines"
            link="/inference"
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analysis Dashboard"
            description="Track all predictions, health trends, and model performance metrics"
            link="/dashboard/analysis"
          />
          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Clinical Insights"
            description="AI-generated medical insights with risk assessment and recommendations"
            link="/insights"
          />
        </section>

        {/* Dashboard Preview */}
        <section className="rounded-lg border border-border bg-card p-8 glass-card glow-accent">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Platform Overview</h3>
            <p className="text-sm text-muted-foreground">Complete ML pipeline for retinal disease analysis</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto pb-2">
            {["Overview", "ML Pipeline", "Results", "Metrics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === tab.toLowerCase()
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="rounded-lg bg-background/50 p-6">
            {activeSection === "overview" && (
              <div className="space-y-4">
                <h4 className="font-semibold">ML System Overview</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <StatCard label="Models Trained" value="12" unit="total" trend="up" />
                  <StatCard label="Images Analyzed" value="847" unit="total" trend="up" />
                  <StatCard label="Model Accuracy" value="94.2" unit="%" trend="up" />
                  <StatCard label="Avg Inference" value="147" unit="ms" trend="down" />
                </div>
              </div>
            )}
            {activeSection === "ml pipeline" && (
              <div className="space-y-4">
                <h4 className="font-semibold">ML Pipeline Stages</h4>
                <div className="space-y-2">
                  {[
                    { stage: "Image Upload", status: "active" },
                    { stage: "Preprocessing", status: "active" },
                    { stage: "Feature Extraction", status: "active" },
                    { stage: "Model Training", status: "ready" },
                    { stage: "Inference", status: "ready" },
                  ].map((item) => (
                    <div key={item.stage} className="flex items-center justify-between rounded-lg bg-background p-3">
                      <span className="text-sm font-medium">{item.stage}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.status === "active" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === "results" && (
              <div className="space-y-4">
                <h4 className="font-semibold">Latest Analysis Results</h4>
                <div className="space-y-3">
                  {[
                    { disease: "Diabetic Retinopathy", confidence: 0.68 },
                    { disease: "Hypertensive Retinopathy", confidence: 0.45 },
                    { disease: "AMD", confidence: 0.32 },
                  ].map((item) => (
                    <div key={item.disease} className="p-3 rounded-lg bg-background">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{item.disease}</span>
                        <span className="text-sm font-semibold text-accent">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-secondary"
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === "metrics" && (
              <div className="space-y-4">
                <h4 className="font-semibold">System Performance</h4>
                <div className="grid gap-2 text-sm">
                  {[
                    { metric: "Model Precision", value: "0.87" },
                    { metric: "Model Recall", value: "0.85" },
                    { metric: "F1-Score", value: "0.86" },
                    { metric: "GPU Utilization", value: "72%" },
                  ].map((item) => (
                    <div key={item.metric} className="flex justify-between rounded-lg bg-background p-2">
                      <span>{item.metric}</span>
                      <span className="font-semibold text-accent">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <Card className="glass-card p-6 glow-accent transition-all hover:border-accent/50 cursor-pointer h-full">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 text-accent">
          {icon}
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </Link>
  )
}

function StatCard({ label, value, unit, trend }: { label: string; value: string; unit: string; trend: string }) {
  return (
    <div className="rounded-lg bg-background p-4">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-accent">{value}</span>
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        </div>
        <div
          className={`text-xs font-semibold ${
            trend === "up" ? "text-green-500" : trend === "down" ? "text-amber-500" : "text-blue-500"
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
        </div>
      </div>
    </div>
  )
}
