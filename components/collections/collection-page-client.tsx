"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/products/product-card"
import { CollectionFilters } from "@/components/collections/collection-filters"

interface CollectionPageClientProps {
  collection: {
    name: string
    description: string
    filterTag: string
  }
  initialProducts: Product[]
}

const collectionHeroImages: Record<string, string> = {
  "new-arrival": "/luxury-fashion-new-collection-minimalist-editorial.jpg",
  regular: "/classic-luxury-tailored-fashion-editorial.jpg",
  oversized: "/contemporary-oversized-fashion-editorial-minimal.jpg",
  designed: "/designer-luxury-fashion-curated-editorial.jpg",
}

const collectionSubtitles: Record<string, string> = {
  "new-arrival": "Fresh perspectives on contemporary style",
  regular: "Timeless cuts that transcend seasons",
  oversized: "Bold proportions, refined execution",
  designed: "Signature pieces from our atelier",
}

export function CollectionPageClient({ collection, initialProducts }: CollectionPageClientProps) {
  const [gender, setGender] = useState<string>("all")
  const [size, setSize] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [showFilters, setShowFilters] = useState(false)

  // Filter products based on collection tag and active filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Collection filter (by tag)
      const tags = product.tags || []
      const hasCollectionTag = tags.some((tag) => tag.toLowerCase().includes(collection.filterTag.toLowerCase()))
      if (!hasCollectionTag) return false

      // Gender filter
      if (gender !== "all") {
        const hasGenderTag = tags.some((tag) => tag.toLowerCase() === gender.toLowerCase())
        if (!hasGenderTag) return false
      }

      // Price filter
      const price = product.salePrice || product.price
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      return true
    })
  }, [initialProducts, collection.filterTag, gender, priceRange])

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative min-h-[85vh] md:min-h-screen overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh] md:min-h-screen">
          <div className="relative overflow-hidden bg-secondary min-h-[50vh] md:min-h-screen">
            <Image
              src={collectionHeroImages[collection.filterTag] || collectionHeroImages["new-arrival"]}
              alt={collection.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10" />
          </div>

          <div className="relative flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-16 sm:py-20 md:py-24 bg-background">
            <div className="max-w-xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="editorial-subheading text-muted-foreground mb-6 sm:mb-8 tracking-[0.2em] uppercase text-xs">
                  Collection
                </p>

                <h1 className="editorial-display text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] text-foreground mb-6 sm:mb-8 leading-[0.9]">
                  {collection.name}
                </h1>

                <p className="luxury-body text-muted-foreground text-base sm:text-lg md:text-xl mb-4 sm:mb-6 leading-relaxed">
                  {collectionSubtitles[collection.filterTag] || collection.description}
                </p>

                <p className="luxury-body text-muted-foreground/80 text-sm sm:text-base mb-10 sm:mb-12 leading-relaxed">
                  {collection.description}
                </p>

                <motion.button
                  onClick={() => {
                    const productsSection = document.getElementById("products-section")
                    productsSection?.scrollIntoView({ behavior: "smooth" })
                  }}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="group flex items-center gap-3 sm:gap-4 luxury-subheading text-foreground"
                >
                  <span>Explore Collection</span>
                  <span className="text-xl sm:text-2xl transition-transform duration-700 group-hover:translate-x-2">
                    →
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-px h-12 sm:h-16 bg-foreground/30"
          />
        </motion.div>
      </motion.div>

      <div
        id="products-section"
        className="mx-auto max-w-[1800px] px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-20 md:py-24 lg:py-32"
      >
        <div className="mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            <div>
              <p className="editorial-subheading text-muted-foreground text-xs sm:text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
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
                <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                  <CollectionFilters
                    gender={gender}
                    onGenderChange={setGender}
                    size={size}
                    onSizeChange={setSize}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
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
                delay: Math.min(index * 0.06, 0.6),
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
            <p className="editorial-body text-muted-foreground text-base sm:text-lg mb-4">
              No pieces match your current selection.
            </p>
            <p className="luxury-body text-muted-foreground/60 text-sm">Try adjusting your filters to discover more.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
