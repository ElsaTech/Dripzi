"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SmoothButton } from "@/components/ui/smooth-button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-white px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-600"
          >
            2025 Collection Launch
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="mb-6 font-serif text-6xl font-bold leading-tight text-black md:text-8xl lg:text-9xl"
          >
            Aesthetics
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-gray-700 md:text-xl"
          >
            Experience the intersection of bold Bauhaus design principles and sophisticated neumorphic interfaces.
            Discover fashion redefined for the modern era.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/shop">
              <SmoothButton variant="primary" className="px-10 py-4 text-base">
                Shop Collection
              </SmoothButton>
            </Link>

            <Link href="/collections">
              <SmoothButton variant="secondary" className="px-10 py-4 text-base">
                Explore More
              </SmoothButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ 
            repeat: Number.POSITIVE_INFINITY, 
            duration: 2,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          className="rounded-full p-2 transition-all duration-300 hover:bg-gray-100"
        >
          <ChevronDown className="h-6 w-6 text-black" />
        </motion.div>
      </motion.div>
    </section>
  )
}
