"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "New Arrival",
    slug: "new-arrival",
    description: "Fresh from the runway",
    image: "/luxury-new-fashion-collection-editorial-minimal.jpg",
  },
  {
    name: "Regular",
    slug: "regular",
    description: "Classic fits, timeless style",
    image: "/classic-tailored-fashion-editorial-minimalist.jpg",
  },
  {
    name: "Oversized",
    slug: "oversized",
    description: "Contemporary silhouettes",
    image: "/oversized-contemporary-fashion-editorial-minimal.jpg",
  },
  {
    name: "Designed",
    slug: "designed",
    description: "Exclusive curated pieces",
    image: "/designer-luxury-curated-fashion-editorial.jpg",
  },
]

export default function CollectionsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative h-[75vh] md:h-screen overflow-hidden bg-secondary flex items-center justify-center"
      >
        <div className="text-center px-6 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="editorial-display text-[4.5rem] md:text-[9rem] lg:text-[13rem] text-foreground mb-10 leading-[0.85]"
          >
            Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="editorial-subheading text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
          >
            Curated fashion narratives that define contemporary luxury
          </motion.p>
        </div>
      </motion.div>

      <main className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-16 py-24 md:py-40">
        {/* Desktop: 2-column asymmetric grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-16">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.4,
                delay: index * 0.12,
                ease: [0.19, 1, 0.22, 1],
              }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative ${index % 3 === 0 ? "md:row-span-2" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/collections/${collection.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                    className="object-cover transition-all duration-[2800ms] ease-out group-hover:scale-[1.12]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-1200" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.12 + 0.4,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      viewport={{ once: true }}
                    >
                      <p className="editorial-subheading text-white/80 mb-4 text-sm tracking-wider">
                        {collection.description}
                      </p>
                      <h3 className="editorial-display text-[3.5rem] md:text-[5rem] lg:text-[6rem] text-white mb-6 leading-[0.9]">
                        {collection.name}
                      </h3>
                      <div
                        className={`flex items-center gap-4 transition-all duration-1000 ${
                          hoveredIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        }`}
                      >
                        <span className="luxury-subheading text-white text-sm">Explore Collection</span>
                        <span className="text-white text-xl">→</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Single column stack */}
        <div className="grid md:hidden gap-10">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: index * 0.08,
                ease: [0.19, 1, 0.22, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              <Link href={`/collections/${collection.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover transition-all duration-[2200ms] ease-out group-active:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="editorial-subheading text-white/80 mb-3 text-xs tracking-wider">
                      {collection.description}
                    </p>
                    <h3 className="editorial-display text-[3.5rem] text-white leading-[0.9]">{collection.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
