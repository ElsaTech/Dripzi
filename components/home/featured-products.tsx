"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-[#f5f1ed] px-0 py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 mb-12 sm:mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-4 sm:mb-6 font-light">
              Latest Pieces
            </p>
            <h2 className="text-[3rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] leading-[0.95] text-foreground font-serif">
              Shop
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors duration-700 group"
          >
            <span className="text-xs tracking-[0.2em] uppercase">View All</span>
            <span className="transform group-hover:translate-x-2 transition-transform duration-700">→</span>
          </Link>
        </motion.div>
      </div>

      <div className="mx-auto max-w-[2000px]">
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-0">
          {products.slice(0, 6).map((product, index) => {
            const heightClass = index === 0 || index === 4 ? "h-[70vh] lg:h-[85vh]" : "h-[60vh] lg:h-[70vh]"

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className={heightClass}
              >
                <Link href={`/product/${product.slug}`} className="group block h-full relative overflow-hidden">
                  <Image
                    src={
                      product.images[0]?.url ||
                      `/placeholder.svg?height=1200&width=800&query=${product.title || "/placeholder.svg"} luxury fashion product photography`
                    }
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.05]"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-1000" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-1000">
                    <p className="text-white font-light text-sm mb-1">{product.title}</p>
                    <p className="text-white/50 text-xs tracking-wider">{product.priceFormatted}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="md:hidden space-y-0">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="h-[70vh] sm:h-[75vh]"
            >
              <Link href={`/product/${product.slug}`} className="group block h-full relative overflow-hidden">
                <Image
                  src={
                    product.images[0]?.url ||
                    `/placeholder.svg?height=1200&width=800&query=${product.title || "/placeholder.svg"} luxury fashion product photography`
                  }
                  alt={product.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-white font-light text-base mb-2">{product.title}</p>
                  <p className="text-white/60 text-sm tracking-wider">{product.priceFormatted}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="md:hidden mx-auto max-w-7xl px-6 mt-12 sm:mt-16 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors duration-700 group"
        >
          <span className="text-xs tracking-[0.2em] uppercase">View All Products</span>
          <span className="transform group-hover:translate-x-2 transition-transform duration-700">→</span>
        </Link>
      </div>
    </section>
  )
}
