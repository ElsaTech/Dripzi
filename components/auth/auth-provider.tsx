"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { LoginModal } from "./login-modal"
import { useUser } from "./user-provider"

interface AuthContextType {
  openLogin: () => void
  closeLogin: () => void
  requireAuth: (callback: () => void) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)
  const { refreshUser } = useUser()

  const openLogin = () => setIsLoginOpen(true)
  const closeLogin = () => {
    setIsLoginOpen(false)
    setPendingCallback(null)
  }

  const requireAuth = (callback: () => void) => {
    setPendingCallback(() => callback)
    setIsLoginOpen(true)
  }

  const handleLoginSuccess = async () => {
    await refreshUser() // Refresh user state after login
    if (pendingCallback) {
      pendingCallback()
      setPendingCallback(null)
    }
    setIsLoginOpen(false)
  }

  return (
    <AuthContext.Provider value={{ openLogin, closeLogin, requireAuth }}>
      {children}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin}
        onSuccess={handleLoginSuccess}
      />
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