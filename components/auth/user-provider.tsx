"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrentUser } from "@/lib/actions/auth"

interface User {
  id: string
  phone_number: string
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  is_admin: boolean
}

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [loading, setLoading] = useState(!initialUser)

  const refreshUser = async () => {
    try {
      setLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialUser) {
      refreshUser()
    }
  }, [initialUser])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}