"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ShieldAlert, MonitorOff, Activity, Shield, TrendingUp } from "lucide-react"
import { useExam } from "@/contexts/exam-context"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function ExplainableRisk() {
  const { riskScore, eventLog, addEvent, timelineData } = useExam()
  
  // Local state for simulation offset to not break original algorithm
  const [simulationOffset, setSimulationOffset] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  // 1 & 2. Live Risk Updates & Calculation
  const actualRisk = Math.min(100, riskScore + simulationOffset)
  
  // 5. Risk Level Indicator
  const riskLevel = actualRisk <= 30 ? "Low" : actualRisk <= 60 ? "Medium" : "High"
  const riskColor = riskLevel === "Low" 
    ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" 
    : riskLevel === "Medium" 
      ? "bg-amber-500/20 text-amber-500 border-amber-500/30" 
      : "bg-red-500/20 text-red-500 border-red-500/30"

  // 3. Cheating Simulation Controls
  const simulateTabSwitch = () => {
    setSimulationOffset(prev => prev + 25)
    addEvent("Tab switching detected", "Risk +25% (Simulation)")
  }

  const simulateNoFace = () => {
    setSimulationOffset(prev => prev + 40)
    addEvent("Face not detected in frame", "Risk +40% (Simulation)")
  }

  const simulateSuspiciousActivity = () => {
    setSimulationOffset(prev => prev + 15)
    addEvent("Suspicious background noise / activity", "Risk +15% (Simulation)")
  }

  // Reset Simulation Offset over time to mimic natural proctoring relaxation
  useEffect(() => {
    if (simulationOffset > 0) {
       const timer = setInterval(() => {
           setSimulationOffset(prev => Math.max(0, prev - 2))
       }, 5000)
       return () => clearInterval(timer)
    }
  }, [simulationOffset])

  // 4. Alert System
  useEffect(() => {
    if (actualRisk > 70) {
      setShowAlert(true)
      const timer = setTimeout(() => setShowAlert(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [actualRisk])

  // Get active explainable reasons from recent negative events
  const recentReasons = eventLog
      .filter(log => log.impact.includes('Risk') || log.impact.includes('CRITICAL'))
      .slice(-4).reverse()

  return (
    <div className="space-y-4">
      {/* 4. Alert System UI */}
      {showAlert && (
        <div className="bg-destructive/90 text-destructive-foreground p-3 rounded-md flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 border border-destructive shadow-lg">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span className="font-bold tracking-wide">⚠️ Suspicious Activity Detected! (Risk &gt; 70%)</span>
        </div>
      )}

      {/* Main Risk Card */}
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Explainable Risk Analysis
            </CardTitle>
            <Badge variant="outline" className={riskColor}>
              {riskLevel} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 gap-4">
            <div className="flex-shrink-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Live Risk Score</p>
              <div className="flex items-baseline gap-1">
                 <h2 className={`text-5xl font-extrabold ${actualRisk > 60 ? 'text-red-500' : actualRisk > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                   {actualRisk.toFixed(0)}
                 </h2>
                 <span className="text-xl text-muted-foreground font-semibold">%</span>
              </div>
            </div>
            
            <div className="w-full md:text-right border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-4">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Active Reasons</p>
               {recentReasons.length > 0 ? (
                 <ul className="text-sm space-y-2">
                   {recentReasons.map((log, i) => (
                     <li key={i} className="flex items-start md:justify-end gap-2 text-left md:text-right">
                       <span className="text-muted-foreground text-xs font-mono mt-0.5 whitespace-nowrap">[{log.time}]</span> 
                       <span className="break-words text-foreground font-medium">{log.event}</span> 
                       <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30 px-1 py-0 h-4 bg-destructive/10 whitespace-nowrap">
                          {log.impact}
                       </Badge>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-emerald-500 mt-1 font-medium flex items-center md:justify-end gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Normal Behavior Maintained
                  </p>
               )}
            </div>
          </div>

          {/* 6. Live Risk Graph */}
          <div className="h-[120px] w-full mt-2 rounded-md p-1 bg-background/50 relative overflow-hidden">
            <p className="text-[10px] text-muted-foreground mb-1 ml-1 flex items-center gap-1 font-mono uppercase">
              <TrendingUp className="w-3 h-3 text-primary" /> Live Trend
            </p>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={timelineData}>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '4px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke={actualRisk > 60 ? "#ef4444" : actualRisk > 30 ? "#f59e0b" : "#10b981"} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Real AI Proctoring Controls */}
          <div className="pt-3 border-t border-border mt-2">
            <p className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-wider flex items-center gap-1">
               <Shield className="w-3 h-3 text-emerald-500" /> AI ACTIVE MONITORING
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-500 font-bold tracking-tight">
                <MonitorOff className="w-3 h-3" /> TAB DETECTION: AUTO ACTIVE
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-500 font-bold tracking-tight">
                <AlertCircle className="w-3 h-3" /> FACE DETECTION: AUTO ACTIVE
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-500 font-bold tracking-tight">
                <Activity className="w-3 h-3" /> BEHAVIOR ANALYSIS: AUTO ACTIVE
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground mt-3 italic">
              * The system is automatically tracking illegal actions. No manual interaction required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
