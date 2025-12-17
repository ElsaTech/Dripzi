"use client"

import { motion } from "framer-motion"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/products"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-background px-6 md:px-12 lg:px-16 py-32 md:py-40 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mb-24 md:mb-32 lg:mb-40 max-w-3xl"
        >
          <p className="editorial-subheading text-muted-foreground mb-8">Curated Selection</p>
          <h2 className="editorial-display text-[4rem] md:text-[6rem] lg:text-[8rem] text-foreground">New Arrivals</h2>
        </motion.div>

        <div className="grid gap-12 md:gap-16 lg:gap-20 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
