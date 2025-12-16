"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LuxuryAuthModal } from "./luxury-auth-modal"

interface AuthContextType {
  openLogin: () => void
  openSignup: () => void
  closeAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const openLogin = () => {
    setMode("signin")
    setIsOpen(true)
  }

  const openSignup = () => {
    setMode("signup")
    setIsOpen(true)
  }

  const closeAuth = () => {
    setIsOpen(false)
  }

  return (
    <AuthContext.Provider value={{ openLogin, openSignup, closeAuth }}>
      {children}
      <LuxuryAuthModal isOpen={isOpen} onClose={closeAuth} mode={mode} />
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
