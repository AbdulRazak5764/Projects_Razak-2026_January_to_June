"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: "student" | "admin" | null
  userId: string
  userName: string
  userEmail: string
  login: (role: "student" | "admin", userId: string, userName: string, userEmail?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "admin" | null>(null)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const login = (role: "student" | "admin", id: string, name: string, email?: string) => {
    setIsAuthenticated(true)
    setUserRole(role)
    setUserId(id)
    setUserName(name)
    if (email) setUserEmail(email)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserId("")
    setUserName("")
    setUserEmail("")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, userName, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
