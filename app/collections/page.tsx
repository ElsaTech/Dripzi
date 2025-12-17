"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "Unisex",
    slug: "unisex",
    image: "/luxury-designer-coats-hanging.jpg",
  },
  {
    name: "Tess",
    slug: "tess",
    image: "/premium-blazers-collection.jpg",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    image: "/black-premium-sweatshirt.jpg",
  },
  {
    name: "Sweetshirt",
    slug: "sweetshirt",
    image: "/minimalist-white-shirts.jpg",
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Desktop: Asymmetric 2-column grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative h-screen"
              >
                <Link href={`/shop/${collection.slug}`} className="group block h-full w-full">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={collection.image || `/placeholder.svg?height=1200&width=800&query=${collection.name} luxury editorial fashion winter`}
                      alt={collection.name}
                      fill
                      sizes="50vw"
                      priority={index < 2}
                      className="object-cover transition-all duration-[2000ms] ease-out group-hover:scale-[1.03]"
                    />
                    {/* Subtle overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Collection title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-12 md:p-16 lg:p-20">
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: index * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="editorial-display text-[4rem] md:text-[5rem] lg:text-[6rem] text-white mb-4"
                      >
                        {collection.name}
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.15 + 0.5, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                      >
                        <span className="editorial-subheading text-white/80">Explore</span>
                        <span className="text-white/60">→</span>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: One collection per screen */}
        <div className="block md:hidden">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative h-screen"
            >
              <Link href={`/shop/${collection.slug}`} className="group block h-full w-full">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={collection.image || `/placeholder.svg?height=1200&width=800&query=${collection.name} luxury editorial fashion winter`}
                    alt={collection.name}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover transition-all duration-[2000ms] ease-out group-hover:scale-[1.02]"
                  />
                  {/* Subtle overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Collection title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                      className="editorial-display text-[3.5rem] text-white mb-3"
                    >
                      {collection.name}
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.5, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    >
                      <span className="editorial-subheading text-white/80 text-xs">Explore</span>
                      <span className="text-white/60">→</span>
                    </motion.div>
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
