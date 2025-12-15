"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { SmoothCard } from "@/components/ui/smooth-card"

const categories = [
  {
    name: "Coats",
    slug: "coats",
    image: "/luxury-designer-coats-hanging.jpg",
  },
  {
    name: "Blazers",
    slug: "blazers",
    image: "/premium-blazers-collection.jpg",
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: "/minimalist-white-shirts.jpg",
  },
  {
    name: "Sweatshirts",
    slug: "sweatshirts",
    image: "/black-premium-sweatshirt.jpg",
  },
]

export function FeaturedCategories() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-600">Curated Collections</p>
          <h2 className="font-serif text-5xl font-bold text-black md:text-7xl">Featured Categories</h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <SmoothCard key={category.slug} delay={index * 0.1} className="p-0">
              <Link href={`/shop/${category.slug}`} className="group block">
                <div className="overflow-hidden rounded-2xl">
                  <motion.div 
                    className="relative aspect-[4/5] overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <motion.div 
                    className="p-6 text-center"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-black transition-colors group-hover:text-gray-700">
                      {category.name}
                    </h3>
                  </motion.div>
                </div>
              </Link>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  )
}
