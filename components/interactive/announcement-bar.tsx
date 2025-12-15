"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Truck } from "lucide-react"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-black text-white"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex flex-1 items-center justify-center gap-2">
            <Truck className="h-4 w-4" />
            <p className="text-sm font-semibold">Free shipping on orders over $100 | Use code: FREESHIP</p>
          </div>
          <button onClick={() => setIsVisible(false)} className="rounded-full p-1 transition-colors hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
