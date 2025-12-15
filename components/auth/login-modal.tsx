"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * LoginModal with Phone.Email Widget Integration
 *
 * Flow:
 * 1. User clicks Sign In → Opens modal
 * 2. Phone.Email widget loads
 * 3. User verifies phone number
 * 4. Widget calls window.phoneEmailListener with user_json_url
 * 5. Modal sends user_json_url to /api/auth/verify-phone
 * 6. Backend verifies phone and creates session
 * 7. Modal redirects to returnTo or /shop
 *
 * Security:
 * - Phone verification happens at Phone.Email service
 * - Backend validates response before creating session
 * - HTTP-only cookies prevent client-side token access
 */
export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Get returnTo from query params (where user was before login)
  const returnTo = searchParams?.get("returnTo") || "/shop"

  // Build success callback URL for Phone.Email widget (computed outside effect)
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const successCallbackUrl = `${origin}/api/auth/phone-success?returnTo=${encodeURIComponent(returnTo)}`

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    // Load Phone.Email widget script
    const script = document.createElement("script")
    script.src = "https://www.phone.email/sign_in_button_v1.js"
    script.async = true

    // Define listener for Phone.Email widget (fallback)
    window.phoneEmailListener = async function (userObj: any) {
      setIsAuthenticating(true)
      try {
        const user_json_url = userObj.user_json_url

        if (!user_json_url) {
          toast({
            title: "Error",
            description: "Failed to get verification URL",
            variant: "destructive",
          })
          return
        }

        // Send to backend to verify phone and create session
        const response = await fetch("/api/auth/verify-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_json_url,
            returnTo,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          toast({
            title: "Authentication Failed",
            description: result.error || "Failed to authenticate",
            variant: "destructive",
          })
          return
        }

        // Close modal and handle success
        onClose()
        onSuccess?.()

        // Use router.push to go to the redirect URL
        router.push(result.redirectUrl)
        router.refresh() // Refresh to update getCurrentUser() in server components
      } catch (error) {
        console.error("Authentication error:", error)
        toast({
          title: "Error",
          description: "An error occurred during authentication",
          variant: "destructive",
        })
      } finally {
        setIsAuthenticating(false)
      }
    }

    // Append script to container
    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      // Cleanup
      window.phoneEmailListener = null
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script)
      }
    }
  }, [isOpen, onClose, router, returnTo, toast])

  const handleClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div
              className="relative rounded-3xl bg-white p-8 shadow-2xl"
              style={{
                boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
              }}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-black">Welcome to Dripzi</h2>
                <p className="mt-2 text-gray-600">Sign in with your phone number</p>
              </div>

              {/* Phone.Email Widget Container */}
              <div ref={containerRef} className="relative flex justify-center">
                <LoadingScreen isLoading={isAuthenticating} />
                <div
                  className="pe_signin_button"
                  data-client-id="13976121635408167384"
                  data-success-callback-url={successCallbackUrl}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// TypeScript declaration for window.phoneEmailListener
declare global {
  interface Window {
    phoneEmailListener?: (userObj: { user_json_url: string }) => Promise<void>
  }
}
