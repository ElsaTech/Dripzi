"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice || product.price
  const hasDiscount = !!product.salePrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="neumorphic overflow-hidden rounded-3xl transition-all duration-300">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=450"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {hasDiscount && (
              <div className="absolute right-4 top-4 rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                SALE
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="mb-2 text-xl font-bold text-black">{product.name}</h3>
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{product.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasDiscount && <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>}
                <span className="text-2xl font-bold text-black">${displayPrice.toFixed(2)}</span>
              </div>

              <Button
                size="icon"
                className="neumorphic-sm h-12 w-12 rounded-full bg-black text-white transition-all hover:scale-110"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
