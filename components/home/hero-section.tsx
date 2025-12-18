"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden -mt-16 md:-mt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/cinematic-fashion-campaign-model-in-luxury-minimal.jpg"
          alt="Premium streetwear fashion campaign featuring luxury minimal design and contemporary silhouettes from Dripzi Store"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="max-w-5xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[12rem] leading-[0.85] text-white font-serif tracking-tighter mb-6 sm:mb-8 md:mb-10"
          >
            Form.
            <br />
            Fit.
            <br />
            Presence.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 sm:gap-4 text-white/60 hover:text-white transition-colors duration-700 group"
              aria-label="Explore premium fashion collections"
            >
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-light">Explore Collections</span>
              <span className="transform group-hover:translate-x-2 transition-transform duration-700">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}
