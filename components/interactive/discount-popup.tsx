"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [dismissed, setDismissed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Show once per browser session to avoid annoying repeat popups
    const hasSeenPopup = typeof window !== "undefined"
      ? sessionStorage.getItem("dripzi_discount_seen")
      : null

    if (!hasSeenPopup && !dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 12000) // Show after 12 seconds

      return () => clearTimeout(timer)
    }
  }, [dismissed])

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setIsOpen(false)
    setDismissed(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dripzi_discount_seen", "true")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, save email to database
    console.log("Email subscribed:", email)
    toast({
      title: "Welcome to Dripzi",
      description: "Your 15% discount code: DRIPZI15",
    })
    handleClose()
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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <button
                onClick={handleClose}
                type="button"
                className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-gray-100 z-10"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-black to-gray-700"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>

                <h2 className="mb-2 font-serif text-3xl font-bold text-black">Welcome to Dripzi!</h2>
                <p className="mb-6 text-lg text-gray-600">Get 15% off your first order</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-2xl border-0 bg-gray-50 py-6 text-center shadow-inner"
                    required
                  />

                  <Button
                    type="submit"
                    className="neumorphic w-full rounded-2xl bg-black py-6 text-base font-bold text-white"
                  >
                    Claim Your Discount
                  </Button>
                </form>

                <p className="mt-4 text-xs text-gray-500">Limited time offer. Terms and conditions apply.</p>
              </div>

              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-black/5" />
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-black/5" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
