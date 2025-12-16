"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type { OAuthStrategy } from "@clerk/types"

interface LuxuryAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: "signin" | "signup"
}

export function LuxuryAuthModal({ isOpen, onClose, mode = "signin" }: LuxuryAuthModalProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">(mode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [showOauthHint, setShowOauthHint] = useState(false)

  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const router = useRouter()

  useEffect(() => {
    setAuthMode(mode)
  }, [mode])

  const handleGoogleAuth = async () => {
    if (!signIn || !signUp || !signInLoaded || !signUpLoaded || loading) return

    setLoading(true)
    setError("")
    setShowOauthHint(false)

    try {
      const strategy: OAuthStrategy = "oauth_google"

      // OAuth handles both sign-in and sign-up automatically
      // Clerk will create an account if one doesn't exist, or sign in if it does
      // We use the appropriate method based on mode, but Clerk handles the logic
      if (authMode === "signin") {
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        })
      } else {
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        })
      }
      // Note: We don't set loading to false here because we're redirecting
      // The SSO callback page will handle the rest
    } catch (err: any) {
      console.error("Google auth error:", err)
      setError("Unable to authenticate with Google. Please try again.")
      setShowOauthHint(false)
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn || !signInLoaded || loading) return

    setLoading(true)
    setError("")
    setShowOauthHint(false)

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        await signIn.setActive({ session: result.createdSessionId })
        
        // Sync user to Supabase after successful sign-in
        // This is idempotent and safe to call multiple times
        await fetch("/api/account/sync-user", {
          method: "POST",
        }).catch(() => {
          // Non-fatal - user can still proceed
          // Password setup banner will retry sync if needed
        })
        
        onClose()
        router.refresh()
      } else {
        // Non-terminal status (e.g. needs second factor, email verification)
        setError(
          "Additional verification is required to sign you in. Please follow the instructions sent to you.",
        )
        setLoading(false)
      }
    } catch (err: any) {
      console.error("Sign in error:", err)

      const clerkError = err?.errors?.[0]
      const code = clerkError?.code as string | undefined

      // Handle all error cases deterministically
      if (code === "form_identifier_not_found") {
        // Email isn't associated with a password-based sign-in in Clerk.
        // It may be an OAuth-only account (e.g. Google) or a brand new email.
        setError(
          "We couldn't sign you in with a password for this email. If you've used Google with this address before, continue with Google below.",
        )
        setShowOauthHint(true)
      } else if (code === "form_password_incorrect") {
        // Password is wrong. This is also what Clerk may return for OAuth-only users.
        setError(
          "The password doesn't match our records. If you originally signed up with Google for this email, use Continue with Google instead.",
        )
        setShowOauthHint(true)
      } else {
        setError(
          clerkError?.message || "Authentication failed. Please try again or use Google to continue.",
        )
        // For unknown errors, still offer the OAuth hint as a safe fallback.
        setShowOauthHint(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp || !signUpLoaded || loading) return

    setLoading(true)
    setError("")
    setShowOauthHint(false)

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      setVerificationSent(true)
    } catch (err: any) {
      console.error("Sign up error:", err)

      const clerkError = err?.errors?.[0]
      const code = clerkError?.code as string | undefined

      // Handle all sign-up error cases deterministically
      if (code === "form_identifier_exists" || code === "form_email_address_exists") {
        // An account (often an OAuth/Google one) already exists for this email.
        setError(
          "An account already exists for this email. Please sign in instead. If you used Google previously, choose Continue with Google above.",
        )
        setShowOauthHint(true)
      } else {
        setError(clerkError?.message || "Sign up failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setError("")
    setVerificationSent(false)
    setShowOauthHint(false)
  }

  const toggleMode = () => {
    resetForm()
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative bg-background border border-foreground/10 shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 text-foreground/40 hover:text-foreground transition-colors duration-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-12 py-16">
                {/* Clerk Smart CAPTCHA mount point for bot protection in custom flows */}
                <div id="clerk-captcha" className="hidden" />

                {!verificationSent ? (
                  <>
                    {/* Header */}
                    <div className="mb-12 text-center">
                      <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-3">
                        {authMode === "signin" ? "Welcome back" : "Join Dripzi Store"}
                      </h2>
                      <p className="text-foreground/60 font-light text-sm tracking-wide">
                        {authMode === "signin" ? "Access your account" : "Begin your journey with us"}
                      </p>
                    </div>

                    {/* Google Auth Button */}
                    <button
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full border border-foreground/20 py-4 text-foreground text-sm uppercase tracking-widest transition-all duration-700 hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-8"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {authMode === "signin" ? "Continue with Google" : "Sign up with Google"}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-foreground/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-foreground/40 tracking-widest">Or</span>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-6">
                      {authMode === "signup" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-foreground/50">
                              First name
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                              className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground outline-none transition-colors duration-700 focus:border-foreground placeholder:text-foreground/30"
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-foreground/50">
                              Last name
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                              className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground outline-none transition-colors duration-700 focus:border-foreground placeholder:text-foreground/30"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/50">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground outline-none transition-colors duration-700 focus:border-foreground placeholder:text-foreground/30"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="text-xs uppercase tracking-widest text-foreground/50">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground outline-none transition-colors duration-700 focus:border-foreground placeholder:text-foreground/30"
                          placeholder="••••••••"
                        />
                      </div>

                      {error && (
                        <div className="space-y-2">
                          <p className="text-sm text-red-900/70 font-light text-center">{error}</p>
                          {showOauthHint && (
                            <p className="text-xs text-foreground/60 text-center">
                              You can always{" "}
                              <button
                                type="button"
                                onClick={handleGoogleAuth}
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                              >
                                continue with Google
                              </button>{" "}
                              to access your existing account. After signing in, you can add a password from your
                              account settings for future email sign-ins.
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-foreground bg-foreground py-4 text-background text-sm uppercase tracking-widest transition-all duration-700 hover:bg-background hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {loading ? "Please wait..." : authMode === "signin" ? "Continue" : "Create account"}
                      </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-8 text-center">
                      <button
                        onClick={toggleMode}
                        className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-700 font-light"
                      >
                        {authMode === "signin" ? (
                          <>
                            New to Dripzi Store? <span className="border-b border-foreground/40">Create an account</span>
                          </>
                        ) : (
                          <>
                            Already have an account? <span className="border-b border-foreground/40">Sign in</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Verification Message */}
                    <div className="text-center">
                      <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-3">
                        Check your email
                      </h2>
                      <p className="text-foreground/60 font-light text-sm tracking-wide mb-8">
                        We sent a verification link to <strong>{email}</strong>
                      </p>
                      <p className="text-foreground/60 font-light text-sm tracking-wide mb-8">
                        Click the link in the email to complete your registration.
                      </p>

                      <button
                        onClick={() => {
                          resetForm()
                          onClose()
                        }}
                        className="border-b border-foreground/40 text-sm text-foreground/60 hover:text-foreground transition-colors duration-700 font-light"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
