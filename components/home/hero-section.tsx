"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-end bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/high-fashion-model-wearing-luxury-streetwear-edito.jpg"
          alt="Editorial fashion background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-amber-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-12 lg:px-16 pb-24 md:pb-32 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="editorial-subheading text-white/60 mb-10 md:mb-12"
          >
            Spring Collection 2025
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="editorial-display text-[6rem] md:text-[10rem] lg:text-[14rem] leading-[0.82] text-white mb-8"
          >
            Pure
            <br />
            Drip
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="pt-6"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-4 editorial-subheading text-white/85 hover:text-white transition-all duration-700 border-b border-white/25 hover:border-white pb-1.5"
            >
              <span>View Collection</span>
              <span className="inline-block transition-transform duration-700 ease-out group-hover:translate-x-3">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
