"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/high-fashion-model-wearing-luxury-streetwear-edito.jpg"
          alt="Editorial fashion background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Minimal, cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-12 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="editorial-display text-[5rem] md:text-[8rem] lg:text-[12rem] leading-[0.88] text-white tracking-tight"
          >
            Refined
            <br />
            Essence
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}
