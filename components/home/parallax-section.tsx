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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-foreground">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src="/fashion-model-black-and-white-minimalist.jpg" alt="" fill className="object-cover opacity-50" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full items-center justify-center px-6 md:px-12 text-center"
      >
        <div className="max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="editorial-display text-[3.5rem] md:text-[6rem] lg:text-[8rem] text-white mb-8"
          >
            Without
            <br />
            Compromise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="editorial-body text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Crafted for those who demand excellence in every detail
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
