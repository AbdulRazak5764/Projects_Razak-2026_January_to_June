"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, User, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [role, setRole] = useState<"student" | "admin">("student")
  const [userId, setUserId] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return

    login(role, userId)

    if (role === "student") {
      router.push("/exam")
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground">
              <Brain className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">ExamGuard AI</h1>
          <p className="text-sm text-muted-foreground">Cognitive Proctoring System</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login to Continue</CardTitle>
            <CardDescription>Select your role and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Select Role</Label>
                <RadioGroup value={role} onValueChange={(val) => setRole(val as "student" | "admin")}>
                  <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex-1 cursor-pointer flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Student</p>
                        <p className="text-xs text-muted-foreground">Take exam and view your results</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-muted hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Admin/Proctor</p>
                        <p className="text-xs text-muted-foreground">Monitor students and review reports</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* User ID Input */}
              <div className="space-y-2">
                <Label htmlFor="userId">{role === "student" ? "Student ID" : "Admin ID"}</Label>
                <Input
                  id="userId"
                  placeholder={role === "student" ? "Enter your student ID" : "Enter your admin ID"}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                Continue as {role === "student" ? "Student" : "Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Mode:</strong> Enter any ID to continue. This is an academic project demonstration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
