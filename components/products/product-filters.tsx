"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterOption {
  label: string
  value: string
}

const sizeOptions: FilterOption[] = [
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
]

const sortOptions: FilterOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
]

interface ProductFiltersProps {
  onFilterChange?: (filters: any) => void
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState("featured")
  const [isSizeOpen, setIsSizeOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size]
    setSelectedSizes(newSizes)
    onFilterChange?.({ sizes: newSizes, sort: selectedSort })
  }

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedSort("featured")
    onFilterChange?.({ sizes: [], sort: "featured" })
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {/* Size Filter */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="neumorphic-sm rounded-full border-2 border-gray-200 bg-white px-6 py-2 font-semibold"
        >
          Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isSizeOpen ? "rotate-180" : ""}`} />
        </Button>

        <AnimatePresence>
          {isSizeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="neumorphic absolute left-0 top-full z-10 mt-2 w-64 rounded-2xl bg-white p-4"
            >
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => toggleSize(size.value)}
                    className={`rounded-xl py-2 text-sm font-semibold transition-all ${
                      selectedSizes.includes(size.value)
                        ? "bg-black text-white"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort Filter */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="neumorphic-sm rounded-full border-2 border-gray-200 bg-white px-6 py-2 font-semibold"
        >
          Sort: {sortOptions.find((o) => o.value === selectedSort)?.label}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
        </Button>

        <AnimatePresence>
          {isSortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="neumorphic absolute left-0 top-full z-10 mt-2 w-64 rounded-2xl bg-white p-2"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.value)
                    setIsSortOpen(false)
                    onFilterChange?.({ sizes: selectedSizes, sort: option.value })
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    selectedSort === option.value ? "bg-black text-white" : "text-black hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear Filters */}
      {(selectedSizes.length > 0 || selectedSort !== "featured") && (
        <Button variant="ghost" onClick={clearFilters} className="rounded-full font-semibold text-gray-600">
          Clear All
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
