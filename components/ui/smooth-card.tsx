"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SmoothCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export function SmoothCard({ 
  children, 
  className = "", 
  hover = true,
  delay = 0 
}: SmoothCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      className={`neumorphic rounded-2xl p-6 transition-all duration-300 ${className}`}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}