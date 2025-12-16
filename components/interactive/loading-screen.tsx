"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface LoadingScreenProps {
  isLoading?: boolean
  duration?: number
}

export function LoadingScreen({ isLoading: externalLoading, duration = 1500 }: LoadingScreenProps = {}) {
  const [internalLoading, setInternalLoading] = useState(true)
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  useEffect(() => {
    if (externalLoading === undefined) {
      const timer = setTimeout(() => {
        setInternalLoading(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [externalLoading, duration])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-32 w-48"
          >
            <Image
              src="/images/image.png"
              alt="Dripzi Store"
              fill
              className="object-contain brightness-50"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
