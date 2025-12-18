"use client"

import { useUser } from "@clerk/nextjs"
import { useMemo, useState, useEffect } from "react"

/**
 * Centralized authentication state machine
 * 
 * States:
 * - unauthenticated: No user, Clerk not loaded or user is null
 * - authenticating: Clerk is loading
 * - authenticated: User exists and is signed in
 * - oauth-only: User exists but has no password enabled
 * - password-enabled: User exists and has password enabled
 * - signing-out: User is in the process of signing out (handled in component)
 */
export type AuthState = 
  | "unauthenticated"
  | "authenticating"
  | "authenticated"
  | "oauth-only"
  | "password-enabled"

export interface AuthStateData {
  state: AuthState
  user: ReturnType<typeof useUser>["user"] | null
  isLoaded: boolean
  hasPassword: boolean
  hasGoogleOAuth: boolean
  shouldShowPasswordPrompt: boolean
}

/**
 * Deterministic auth state hook
 * 
 * Provides a single source of truth for authentication state
 * that handles all edge cases and race conditions
 */
export function useAuthState(): AuthStateData {
  const { user, isLoaded } = useUser()
  const [supabaseHasPassword, setSupabaseHasPassword] = useState<boolean | null>(null)

  // Fetch password status from Supabase (source of truth)
  useEffect(() => {
    if (isLoaded && user) {
      fetch("/api/account/check-password-status")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSupabaseHasPassword(data.hasPassword)
          } else {
            // If check fails, assume no password to be safe
            setSupabaseHasPassword(false)
          }
        })
        .catch(() => {
          // If fetch fails, assume no password to be safe
          setSupabaseHasPassword(false)
        })
    } else {
      setSupabaseHasPassword(null)
    }
  }, [isLoaded, user])

  const stateData = useMemo((): AuthStateData => {
    // Clerk is still loading
    if (!isLoaded) {
      return {
        state: "authenticating",
        user: null,
        isLoaded: false,
        hasPassword: false,
        hasGoogleOAuth: false,
        shouldShowPasswordPrompt: false,
      }
    }

    // No user - unauthenticated
    if (!user) {
      return {
        state: "unauthenticated",
        user: null,
        isLoaded: true,
        hasPassword: false,
        hasGoogleOAuth: false,
        shouldShowPasswordPrompt: false,
      }
    }

    // User exists - determine detailed state
    // SOURCE OF TRUTH: Supabase has_password field (from database)
    // This is the ONLY reliable indicator that a user has a password
    // Wait for Supabase check to complete before making decisions
    const hasPassword = supabaseHasPassword === true

    const hasGoogleOAuth = user.externalAccounts?.some(
      (account) => account.provider === "oauth_google"
    ) || false

    // DETERMINISTIC RENDERING LOGIC:
    // Show password prompt ONLY if user does NOT have a password in Supabase
    // No exceptions, no metadata checks, no session hacks
    // If Supabase check is still loading (null), don't show prompt yet
    const shouldShowPasswordPrompt = supabaseHasPassword === false

    // Determine high-level state
    let state: AuthState
    if (hasPassword) {
      state = "password-enabled"
    } else if (hasGoogleOAuth) {
      state = "oauth-only"
    } else {
      // Edge case: user exists but has neither password nor OAuth
      // This shouldn't happen in normal flow, but handle gracefully
      state = "authenticated"
    }

    return {
      state,
      user,
      isLoaded: true,
      hasPassword,
      hasGoogleOAuth,
      shouldShowPasswordPrompt,
    }
  }, [user, isLoaded, supabaseHasPassword])

  return stateData
}
