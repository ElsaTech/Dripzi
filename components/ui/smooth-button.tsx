"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SmoothButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  disabled?: boolean
}

export function SmoothButton({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  disabled = false 
}: SmoothButtonProps) {
  const baseClasses = "relative overflow-hidden rounded-full px-6 py-3 font-semibold transition-all duration-300"
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-black hover:bg-gray-50",
    ghost: "bg-transparent text-black hover:bg-gray-100"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}