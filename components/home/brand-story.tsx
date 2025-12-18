"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function BrandStory() {
  return (
    <section className="bg-background py-32 md:py-40 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-[70vh] lg:h-[80vh]"
          >
            <Image
              src="/luxury-fashion-craftsmanship-detail-fabric-texture.jpg"
              alt="Close-up detail of premium fabric craftsmanship showing luxury texture and quality materials used in Dripzi Store clothing"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-xl"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8 font-light">Philosophy</p>

            <h2 className="text-[3.5rem] md:text-[4.5rem] leading-[1] text-foreground font-serif mb-12">
              Luxury in
              <br />
              Everyday
              <br />
              Silhouettes
            </h2>

            <div className="space-y-8 text-foreground/60 leading-relaxed">
              <p>
                Dripzi Store believes true luxury lies not in excess, but in restraint. In the precise cut of a
                shoulder, the weight of premium fabric, the subtle details only the wearer notices.
              </p>
              <p>
                Every garment is designed for those who understand that style is not about following trends—it's about
                defining presence through oversized silhouettes, regular fits, and carefully designed pieces.
              </p>
              <p>
                This is fashion for the confident. The considered. Those who know that the most powerful statement is
                often the quietest. We offer premium streetwear and luxury fashion for men, women, and unisex
                collections.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
