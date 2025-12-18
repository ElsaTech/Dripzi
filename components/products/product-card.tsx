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
    <motion.div whileHover={{ y: -12 }} transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }} className="group">
      <Link href={`/product/${product.slug}`}>
        <div className="space-y-6">
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20">
            <Image
              src={
                product.images[0] ||
                "/placeholder.svg?height=1400&width=1000&query=luxury+fashion+editorial+product+photography+minimal" ||
                "/placeholder.svg"
              }
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.08]"
            />

            {hasDiscount && (
              <div className="absolute top-6 right-6 bg-foreground text-background px-5 py-3">
                <span className="editorial-subheading text-[10px] tracking-[0.15em]">SALE</span>
              </div>
            )}
          </div>

          <div className="space-y-3 px-1">
            {/* Name */}
            <h3 className="editorial-heading text-lg md:text-xl text-foreground tracking-tight leading-tight line-clamp-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="luxury-body text-sm text-foreground">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="luxury-body text-xs text-muted-foreground/40 line-through">
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
