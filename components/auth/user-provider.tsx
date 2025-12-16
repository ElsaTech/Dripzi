"use client"

import { createContext, useContext, ReactNode } from "react"
import { useUser as useClerkUser } from "@clerk/nextjs"

/**
 * UserProvider Component
 * 
 * DEPRECATED: This component is kept for backwards compatibility
 * 
 * For new code, use Clerk's useUser hook directly:
 * ```tsx
 * import { useUser } from "@clerk/nextjs"
 * ```
 * 
 * Clerk provides all user data client-side, so this wrapper is unnecessary
 */
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
  const { user: clerkUser, isLoaded } = useClerkUser()

  // Map Clerk user to legacy User format for backwards compatibility
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        phone_number: "", // Not available from Clerk
        first_name: clerkUser.firstName || undefined,
        last_name: clerkUser.lastName || undefined,
        name: clerkUser.fullName || undefined,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || undefined,
        is_admin: false, // Admin check requires server-side validation
      }
    : initialUser || null

  const refreshUser = async () => {
    // Clerk automatically refreshes user data
    // This is kept for backwards compatibility but does nothing
  }

  return (
    <UserContext.Provider value={{ user, loading: !isLoaded, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * @deprecated Use Clerk's useUser hook directly instead
 */
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
