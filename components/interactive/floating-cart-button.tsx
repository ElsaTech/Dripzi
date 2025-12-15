"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper"

export function FloatingCartButton() {
  const [cartCount, setCartCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // In production, this would fetch from cart state/context
  useEffect(() => {
    // Mock cart count - replace with actual cart logic
    const mockCount = 0
    setCartCount(mockCount)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: 0.5
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      <MagneticWrapper strength={0.15}>
        <Link 
          href="/cart"
          onClick={() => setIsLoading(true)}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black shadow-2xl transition-all hover:shadow-xl"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ rotate: [-5, 5, -5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <ShoppingBag className="h-7 w-7 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.2 }}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              >
                <motion.span
                  key={cartCount}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {cartCount}
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        </Link>
      </MagneticWrapper>
    </motion.div>
  )
}
