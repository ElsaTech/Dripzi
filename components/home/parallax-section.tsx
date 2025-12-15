"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src="/fashion-model-black-and-white-minimalist.jpg" alt="Fashion Model" fill className="object-cover opacity-60" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center px-4 text-center"
      >
        <div>
          <h2 className="mb-4 font-serif text-5xl font-bold text-white md:text-7xl">Fashion With No Rules</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
            Bold. Unconventional. Timeless. Break boundaries with Dripzi's revolutionary approach to modern fashion.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
