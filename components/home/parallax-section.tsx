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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3])

  return (
    <section ref={containerRef} className="relative h-[90vh] overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/black-and-white-fashion-editorial-model-minimalist.jpg"
          alt="Editorial moment"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex h-full items-center justify-center px-6 md:px-12">
        <div className="max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] text-white font-serif mb-10"
          >
            Without
            <br />
            Compromise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed"
          >
            Crafted for those who demand excellence in every detail
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
