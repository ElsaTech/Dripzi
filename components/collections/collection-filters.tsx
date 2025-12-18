"use client"

import { motion } from "framer-motion"

interface CollectionFiltersProps {
  gender: string
  onGenderChange: (gender: string) => void
  size: string
  onSizeChange: (size: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

const genders = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
]

const sizes = [
  { label: "All", value: "all" },
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
]

const priceRanges = [
  { label: "All Prices", value: [0, 1000] as [number, number] },
  { label: "Under $75", value: [0, 75] as [number, number] },
  { label: "$75 - $150", value: [75, 150] as [number, number] },
  { label: "$150 - $300", value: [150, 300] as [number, number] },
  { label: "$300+", value: [300, 1000] as [number, number] },
]

export function CollectionFilters({
  gender,
  onGenderChange,
  size,
  onSizeChange,
  priceRange,
  onPriceChange,
}: CollectionFiltersProps) {
  return (
    <>
      {/* Gender Filter */}
      <div className="space-y-5">
        <h3 className="editorial-subheading text-foreground text-sm mb-6">Gender</h3>
        <div className="flex flex-wrap gap-3">
          {genders.map((g) => (
            <motion.button
              key={g.value}
              onClick={() => onGenderChange(g.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`luxury-body text-sm px-6 py-3 border transition-all duration-700 ${
                gender === g.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {g.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-5">
        <h3 className="editorial-subheading text-foreground text-sm mb-6">Size</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((s) => (
            <motion.button
              key={s.value}
              onClick={() => onSizeChange(s.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`luxury-body text-sm px-5 py-3 border transition-all duration-700 ${
                size === s.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
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
