"use client"

import { motion } from "framer-motion"

interface ShopFiltersProps {
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  productType: string
  onProductTypeChange: (type: string) => void
}

const productTypes = [
  { label: "All Types", value: "all" },
  { label: "Hoodies", value: "hoodie" },
  { label: "Tees", value: "tee" },
  { label: "Sweatshirts", value: "sweatshirt" },
  { label: "Trousers", value: "trouser" },
]

const priceRanges = [
  { label: "All Prices", value: [0, 1000] as [number, number] },
  { label: "Under $50", value: [0, 50] as [number, number] },
  { label: "$50 - $100", value: [50, 100] as [number, number] },
  { label: "$100 - $200", value: [100, 200] as [number, number] },
  { label: "$200+", value: [200, 1000] as [number, number] },
]

export function ShopFilters({ priceRange, onPriceChange, productType, onProductTypeChange }: ShopFiltersProps) {
  return (
    <>
      {/* Product Type Filter */}
      <div className="space-y-5">
        <h3 className="editorial-subheading text-foreground text-sm mb-6">Collection Type</h3>
        <div className="flex flex-wrap gap-3">
          {productTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onProductTypeChange(type.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`luxury-body text-sm px-6 py-3 border transition-all duration-700 ${
                productType === type.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-5">
        <h3 className="editorial-subheading text-foreground text-sm mb-6">Price Range</h3>
        <div className="flex flex-wrap gap-3">
          {priceRanges.map((range) => (
            <motion.button
              key={range.label}
              onClick={() => onPriceChange(range.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`luxury-body text-sm px-6 py-3 border transition-all duration-700 whitespace-nowrap ${
                priceRange[0] === range.value[0] && priceRange[1] === range.value[1]
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>
    </>
  )
}
