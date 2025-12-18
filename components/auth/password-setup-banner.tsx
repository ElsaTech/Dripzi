"use client"

import { useState, useEffect, useRef } from "react"
import { useAuthState } from "@/lib/hooks/use-auth-state"
import { useClerk } from "@clerk/nextjs"

/**
 * Hash password on client before sending to server
 * Uses Web Crypto API for secure hashing
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Deterministic password setup banner for OAuth-only users
 * 
 * CORE RULE:
 * - IF Supabase has_password === true → NEVER show
 * - IF Supabase has_password === false → SHOW
 * 
 * PASSWORD SAVE FLOW:
 * 1. Hash password on client (SHA-256)
 * 2. Store password hash in Supabase via API
 * 3. Verify has_password === true in Supabase
 * 4. Hide banner immediately
 * 
 * SUPABASE IS SOURCE OF TRUTH - Not Clerk
 */
export function PasswordSetupBanner() {
  const authState = useAuthState()
  const { user, shouldShowPasswordPrompt, isLoaded } = authState
  const { openUserProfile } = useClerk()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const hasSyncedRef = useRef(false)
  const isProcessingRef = useRef(false)

  // Check Supabase for password status (source of truth)
  useEffect(() => {
    if (isLoaded && user && hasPassword === null) {
      fetch("/api/account/check-password-status")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHasPassword(data.hasPassword)
          }
        })
        .catch(() => {
          // If check fails, assume no password to be safe
          setHasPassword(false)
        })
    }
  }, [isLoaded, user, hasPassword])

  // Safety net: Sync user to Supabase once when user is first detected
  useEffect(() => {
    if (isLoaded && user && !hasSyncedRef.current && !isProcessingRef.current) {
      hasSyncedRef.current = true
      fetch("/api/account/sync-user", {
        method: "POST",
      }).catch(() => {
        // Non-fatal - just ensures user is synced
      })
    }
  }, [isLoaded, user])

  // CRITICAL: Check Supabase has_password (source of truth)
  // If hasPassword === true → NEVER render, no exceptions
  // Wait for password status check to complete
  if (!isLoaded || !user || hasPassword === null) {
    return null // Wait for password status check
  }

  if (hasPassword || !shouldShowPasswordPrompt) {
    return null // User has password in Supabase, don't show
  }

  // Additional safeguard: Close banner if password status changes
  useEffect(() => {
    if (hasPassword) {
      setOpen(false)
      isProcessingRef.current = false
    }
  }, [hasPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isProcessingRef.current) return

    if (!password || password.length < 8) {
      setError("Please choose a password with at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    // Prevent double submission
    isProcessingRef.current = true
    setLoading(true)
    setError(null)

    try {
      // STEP 1: Hash password on client before sending to server
      // This ensures password is never sent in plaintext
      const passwordHash = await hashPassword(password)

      // STEP 2: Store password hash in Supabase (source of truth)
      // This is where passwords are actually stored, not in Clerk
      const response = await fetch("/api/account/mark-password-prompt-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passwordHash: passwordHash,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save password")
      }

      // STEP 3: Verify password was stored in Supabase
      // Check Supabase to confirm has_password is now true
      const verifyResponse = await fetch("/api/account/check-password-status")
      const verifyResult = await verifyResponse.json()

      if (!verifyResponse.ok || !verifyResult.success) {
        throw new Error("Failed to verify password was saved")
      }

      if (!verifyResult.hasPassword) {
        throw new Error("Password was not successfully saved to database")
      }

      // STEP 4: Update local state to reflect password exists
      // This immediately hides the banner
      setHasPassword(true)
      setOpen(false)
      setPassword("")
      setConfirmPassword("")
      
      // Small delay to ensure UI updates smoothly
      setTimeout(() => {
        isProcessingRef.current = false
        setLoading(false)
      }, 100)
    } catch (err: any) {
      // Handle errors gracefully
      let message = "We couldn't save your password. Please try again."
      
      if (err?.message) {
        message = err.message
      } else if (typeof err === 'string') {
        message = err
      }

      setError(message)
      isProcessingRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-full max-w-xl -translate-x-1/2 px-4">
      {/* Collapsed banner */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-full border border-foreground/10 bg-background/90 px-6 py-4 text-left shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-foreground/25"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">
            Optional security
          </p>
          <p className="text-sm text-foreground/80">
            Add a password to your account to enable future email sign-ins.
          </p>
        </button>
      )}

      {/* Expanded minimal modal */}
      {open && (
        <div className="rounded-3xl border border-foreground/10 bg-background/95 px-6 py-6 shadow-2xl backdrop-blur-md transition-all duration-500">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">
                Account security
              </p>
              <h3 className="font-serif text-xl text-foreground">
                Add a password for email sign-in
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                // Simply close the banner - user can set password later via their profile
                // We don't persist dismissal - if they want to set a password later,
                // they can do so via Clerk's user profile component
                // The banner will show again on next session if passwordEnabled is still false
                setOpen(false)
              }}
              className="text-xs text-foreground/50 hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>

          <p className="mb-4 text-sm text-foreground/70">
            You currently sign in with Google. Set a password so you can also sign in directly with your email in the
            future.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-foreground/30"
                placeholder="At least 8 characters"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-foreground/20 bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-foreground/30"
                placeholder="Re-enter password"
              />
            </div>

            {error && <p className="text-xs text-red-900/70">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  // Simply close the banner - user can set password later via their profile
                  // We don't persist dismissal - if they want to set a password later,
                  // they can do so via Clerk's user profile component
                  // The banner will show again on next session if passwordEnabled is still false
                  setOpen(false)
                }}
                className="text-xs text-foreground/60 hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-foreground bg-foreground px-5 py-2 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
              >
                {loading ? "Saving..." : "Save password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
