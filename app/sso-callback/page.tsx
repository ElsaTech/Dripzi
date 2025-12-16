"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

/**
 * SSO Callback Page
 * 
 * Handles OAuth redirects from Google (and other providers)
 * - Works for both sign-in and sign-up flows
 * - Syncs user to Supabase after authentication completes
 * - Idempotent: Safe to call sync multiple times
 * - Handles all OAuth scenarios deterministically
 */
export default function SSOCallback() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const hasSyncedRef = useRef(false)

  // Sync user to Supabase after OAuth completes
  // This handles:
  // - New OAuth sign-ups (creates Supabase user)
  // - Existing OAuth sign-ins (updates Supabase user)
  // - OAuth linking (updates auth_provider)
  useEffect(() => {
    if (isLoaded && user && !hasSyncedRef.current) {
      hasSyncedRef.current = true
      
      // Sync user to Supabase in the background
      // This is idempotent and safe to call multiple times
      fetch("/api/account/sync-user", {
        method: "POST",
      }).catch((error) => {
        console.error("Failed to sync user to Supabase:", error)
        // Non-fatal - user can still proceed
        // Password setup banner will retry sync if needed
      })
    }
  }, [isLoaded, user])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-foreground mb-4">Completing authentication...</h2>
        <p className="text-foreground/60 text-sm">Please wait while we sign you in.</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  )
}
