"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { LoadingScreen } from "@/components/interactive/loading-screen"

/**
 * AuthGuard Component
 * 
 * Client-side route protection using Clerk
 * - requireAuth: Redirects to login if user is not authenticated
 * - requireAdmin: Checks admin status from Supabase (requires server-side check for production)
 * 
 * NOTE: For admin checks, prefer server-side validation in page components
 * This component is kept for backwards compatibility
 */
interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: AuthGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    if (requireAuth && !user) {
      router.push('/?login=true')
      return
    }

    // Note: Admin check requires server-side validation
    // This client-side check is a fallback only
    // Always validate admin status server-side in production
    if (requireAdmin && !user) {
      router.push('/')
      return
    }
  }, [isLoaded, user, requireAuth, requireAdmin, router])

  if (!isLoaded) {
    return <LoadingScreen isLoading={true} />
  }

  if (requireAuth && !user) {
    return null
  }

  // Admin check requires server-side validation - this is just a client-side guard
  // The actual admin check should happen in the page component
  if (requireAdmin && !user) {
    return null
  }

  return <>{children}</>
}
