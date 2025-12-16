"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

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
    <section className="bg-background px-6 md:px-12 lg:px-16 py-32 md:py-40 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mb-24 md:mb-32 lg:mb-40 max-w-3xl"
        >
          <p className="editorial-subheading text-muted-foreground mb-8">Explore</p>
          <h2 className="editorial-display text-[4rem] md:text-[6rem] lg:text-[8rem] text-foreground">Collections</h2>
        </motion.div>

        <div className="grid gap-10 md:gap-12 lg:gap-16 md:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <Link href={`/shop/${category.slug}`} className="group block">
                <div className="space-y-6">
                  <motion.div
                    className="relative aspect-[3/4] overflow-hidden bg-muted/30"
                    whileHover={{ scale: 0.985 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={
                        category.image ||
                        `/placeholder.svg?height=900&width=675&query=${category.name} luxury editorial fashion`
                      }
                      alt={category.name}
                      fill
                      className="object-cover transition-all duration-1000 ease-out group-hover:scale-102 group-hover:brightness-[0.97]"
                    />
                  </motion.div>

                  <div>
                    <h3 className="editorial-heading text-3xl md:text-4xl text-foreground transition-colors duration-700 group-hover:text-accent">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
