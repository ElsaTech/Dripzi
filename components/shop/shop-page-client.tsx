"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/products/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"

interface ShopPageClientProps {
  initialProducts: Product[]
}

export function ShopPageClient({ initialProducts }: ShopPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [productType, setProductType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (activeCategory !== "all" && product.category !== activeCategory) {
        return false
      }

      const price = product.salePrice || product.price
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      if (productType !== "all") {
        const tags = product.tags || []
        if (!tags.some((tag) => tag.toLowerCase().includes(productType.toLowerCase()))) {
          return false
        }
      }

      return true
    })
  }, [initialProducts, activeCategory, priceRange, productType])

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-hidden"
      >
        <Image
          src="/luxury-fashion-editorial-gallery-minimal.jpg"
          alt="Shop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 sm:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="editorial-display text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] text-white mb-4 sm:mb-6 leading-[0.85]"
            >
              Shop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="editorial-subheading text-white/90 max-w-lg mx-auto text-sm sm:text-base md:text-lg"
            >
              Contemporary fashion for the discerning individual
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="sticky top-14 md:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto py-4 sm:py-6 md:py-8 scrollbar-hide">
            {["all", "new-arrival", "unisex", "men", "women"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`luxury-subheading whitespace-nowrap transition-all duration-700 relative group flex-shrink-0 ${
                  activeCategory === category ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category === "all"
                  ? "All"
                  : category
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                {activeCategory === category && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-px bg-foreground"
                    transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            <div>
              <p className="editorial-subheading text-muted-foreground text-xs sm:text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="luxury-subheading text-foreground hover:text-muted-foreground transition-colors duration-500 flex items-center gap-3"
              >
                <span>Filters</span>
                <span className={`transition-transform duration-500 ${showFilters ? "rotate-180" : ""}`}>↓</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8 sm:pt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                  <ShopFilters
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    productType={productType}
                    onProductTypeChange={setProductType}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-16 sm:gap-y-20 md:gap-y-28"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: Math.min(index * 0.04, 0.4),
                ease: [0.19, 1, 0.22, 1],
              }}
              layout
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 sm:py-32 text-center">
            <p className="editorial-body text-muted-foreground text-base sm:text-lg">
              No products match your filters. Try adjusting your selection.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
