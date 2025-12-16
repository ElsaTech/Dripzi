"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice || product.price
  const hasDiscount = !!product.salePrice

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="group">
      <Link href={`/product/${product.slug}`}>
        <div className="space-y-6">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
            <Image
              src={product.images[0] || "/placeholder.svg?height=900&width=675&query=luxury fashion product editorial"}
              alt={product.name}
              fill
              className="object-cover transition-all duration-1000 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="editorial-heading text-2xl md:text-3xl text-foreground tracking-tight">{product.name}</h3>

            <div className="flex items-baseline gap-3">
              <span className="editorial-body text-sm text-muted-foreground/80">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="editorial-body text-xs text-muted-foreground/40 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
