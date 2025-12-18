"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { ShoppingBag, Heart, Share2, Check } from "lucide-react"
import { addToCart } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  // Check if product has size/color options - fallback to defaults for demo
  const hasSizeOptions = product.sizes.length > 0
  const hasColorOptions = product.colors.length > 0

  // Auto-select first size if no size selected or no options available
  const effectiveSelectedSize = selectedSize || (hasSizeOptions ? product.sizes[0] : "M")
  const effectiveSelectedColor = selectedColor || (hasColorOptions ? product.colors[0] : "Black")

  // Find variant - use first available variant if exact match not found
  const selectedVariant =
    product.variants.find(
      (v) =>
        (!hasSizeOptions || v.size === effectiveSelectedSize) &&
        (!hasColorOptions || v.color === effectiveSelectedColor) &&
        v.available,
    ) ||
    product.variants.find((v) => v.available) ||
    product.variants[0]

  // Use variant price if a variant is selected, otherwise use product-level pricing
  const variantPrice = selectedVariant?.price
  const displayPrice = variantPrice || product.salePrice || product.price
  // For variant pricing, we compare to the base product price
  // For product-level pricing, we compare salePrice to regular price
  const regularPrice = variantPrice ? product.price : product.salePrice ? product.price : product.price
  const hasDiscount = variantPrice ? false : !!product.salePrice

  const handleAddToCart = async () => {
    const finalSize = selectedSize || effectiveSelectedSize
    const finalColor = selectedColor || effectiveSelectedColor

    setIsAdding(true)
    try {
      // Use product.id (Shopify product ID) instead of _id
      await addToCart(product.id, 1, finalSize, finalColor)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-20 sm:py-24">
      <LoadingScreen isLoading={isAdding} />
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3 sm:space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="neumorphic aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <div className="relative h-full w-full">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg?height=800&width=600"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`neumorphic-sm aspect-square overflow-hidden rounded-xl sm:rounded-2xl transition-all ${
                    selectedImage === index ? "ring-2 sm:ring-4 ring-black" : ""
                  }`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4 sm:mb-6">
            <h1 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-black">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {hasDiscount && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through">${regularPrice.toFixed(2)}</span>
              )}
              <span className="text-3xl sm:text-4xl font-bold text-black">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="rounded-full bg-black px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold text-white">
                  SAVE {Math.round(((regularPrice - displayPrice) / regularPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed text-gray-700">{product.description}</p>

          {/* Color Selection */}
          {hasColorOptions && (
            <div className="mb-4 sm:mb-6">
              <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">Color</h3>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.colors.map((color) => {
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 sm:border-4 transition-all ${
                        selectedColor === color ? "border-black scale-110" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {hasSizeOptions && (
            <div className="mb-6 sm:mb-8">
              <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                {product.sizes.map((size) => {
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`neumorphic-sm rounded-xl py-2 sm:py-3 font-bold transition-all text-sm sm:text-base ${
                        selectedSize === size ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto space-y-3 sm:space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="neumorphic w-full rounded-xl sm:rounded-2xl bg-black py-5 sm:py-6 text-base sm:text-lg font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                "Adding..."
              ) : showSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="neumorphic-sm flex-1 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white py-5 sm:py-6 font-semibold text-sm sm:text-base"
              >
                <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Wishlist
              </Button>
              <Button
                variant="outline"
                className="neumorphic-sm flex-1 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white py-5 sm:py-6 font-semibold text-sm sm:text-base"
              >
                <Share2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-10 sm:mt-12 space-y-4 sm:space-y-6 border-t border-gray-200 pt-6 sm:pt-8">
            <div>
              <h4 className="mb-2 font-bold text-black text-sm sm:text-base">Product Details</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• Premium quality materials</li>
                <li>• Ethically sourced and manufactured</li>
                <li>• Limited edition design</li>
                <li>• Machine washable</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-bold text-black text-sm sm:text-base">Shipping & Returns</h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Free shipping on orders over $100. 30-day easy returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
