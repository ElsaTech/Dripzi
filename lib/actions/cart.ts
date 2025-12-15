"use server"

/**
 * Cart Actions - Server Actions for Cart Management
 * 
 * Handles cart operations using Shopify Cart API:
 * - Cart ID persistence via HTTP-only cookies
 * - Product variant matching (size/color -> variant ID)
 * - Cart transformation for UI compatibility
 * 
 * All cart operations use Shopify Cart API mutations:
 * - cartCreate (via createCart in lib/cart.ts)
 * - cartLinesAdd (via addToCart in lib/cart.ts)
 * - cartLinesRemove (via removeCartLine in lib/cart.ts)
 */

import { getCart as getShopifyCart, addToCart as addToShopifyCart, updateCartLine, removeCartLine, createCart, getCartById, getCheckoutUrl as getShopifyCheckoutUrl } from "@/lib/cart"
import { getProductById } from "./products"
import type { Product } from "@/lib/products"
import { cookies } from "next/headers"

/**
 * UI-compatible Cart type (matches what components expect)
 */
export interface Cart {
  id: string
  items: Array<{
    id: string // cart line ID
    productId: string
    quantity: number
    size: string
    color: string
  }>
  updatedAt?: Date
}

/**
 * Gets cart ID from HTTP-only cookie
 * Cart ID persists across sessions for the same user
 */
async function getCartIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("shopify_cart_id")?.value || null
}

/**
 * Persists cart ID in HTTP-only cookie
 * Cookie expires after 1 year and is secure in production
 */
async function setCartIdInCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("shopify_cart_id", cartId, {
    httpOnly: true, // Prevents client-side access
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  })
}

/**
 * Gets or creates a cart ID
 * - Checks cookie for existing cart ID
 * - Verifies cart still exists in Shopify
 * - Creates new cart if missing or invalid
 * - Persists cart ID in cookie
 */
async function getOrCreateCartId(): Promise<string> {
  let cartId = await getCartIdFromCookie()

  if (!cartId) {
    // No cart ID in cookie - create new cart
    cartId = await createCart()
    await setCartIdInCookie(cartId)
  } else {
    // Verify cart still exists in Shopify
    const cart = await getCartById(cartId)
    if (!cart) {
      // Cart no longer exists - create new one
      cartId = await createCart()
      await setCartIdInCookie(cartId)
    }
  }

  return cartId
}

/**
 * Transforms Shopify cart to UI-compatible format
 */
async function transformShopifyCart(shopifyCart: any): Promise<Cart> {
  const items = await Promise.all(
    shopifyCart.lines.edges.map(async (edge: any) => {
      const line = edge.node
      const variant = line.merchandise
      const productId = variant.product.id

      // Extract size and color from variant selectedOptions
      const sizeOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === "size",
      )?.value || ""
      const colorOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour",
      )?.value || ""
      
      console.log(`Cart line ${line.id}: productId=${productId}, size=${sizeOption}, color=${colorOption}`)

      return {
        id: line.id,
        productId,
        quantity: line.quantity,
        size: sizeOption || "",
        color: colorOption || "",
      }
    }),
  )

  return {
    id: shopifyCart.id,
    items,
    updatedAt: new Date(),
  }
}

/**
 * Finds variant ID from product, size, and color
 * Falls back to first available variant if exact match not found
 */
function findVariantId(product: Product, size: string, color: string): string | null {
  // Try exact match first
  let variant = product.variants.find((v) => {
    const matchesSize = !size || v.size === size
    const matchesColor = !color || v.color === color
    return matchesSize && matchesColor && v.available
  })

  // Fallback to first available variant for demo purposes
  if (!variant) {
    variant = product.variants.find(v => v.available) || product.variants[0]
  }

  return variant?.id || null
}

/**
 * Gets cart in UI-compatible format
 */
export async function getCart(): Promise<Cart | null> {
  const cartId = await getCartIdFromCookie()
  if (!cartId) {
    return null
  }

  const shopifyCart = await getShopifyCart(cartId)
  if (!shopifyCart) {
    return null
  }

  return transformShopifyCart(shopifyCart)
}

/**
 * Adds item to cart using product ID, size, and color
 */
export async function addToCart(productId: string, quantity: number, size: string, color: string) {
  // Get product to find the matching variant
  const product = await getProductById(productId)
  if (!product) {
    throw new Error("Product not found")
  }

  // Find variant that matches size and color
  const variantId = findVariantId(product, size, color)
  if (!variantId) {
    throw new Error(`Variant not found for size: ${size}, color: ${color}`)
  }

  // Get or create cart ID
  const cartId = await getOrCreateCartId()

  // Add to Shopify cart
  await addToShopifyCart(cartId, variantId, quantity, [
    { key: "Size", value: size },
    { key: "Color", value: color },
  ])

  return { success: true }
}

/**
 * Updates cart item quantity
 */
export async function updateCartItem(productId: string, size: string, color: string, quantity: number) {
  const cartId = await getCartIdFromCookie()
  if (!cartId) {
    throw new Error("Cart not found")
  }

  const cart = await getCart()
  if (!cart) {
    throw new Error("Cart not found")
  }

  // Find the cart line that matches productId, size, and color
  // Handle cases where size/color might be empty or undefined
  const line = cart.items.find((item) => {
    const itemSize = item.size || ""
    const itemColor = item.color || ""
    const targetSize = size || ""
    const targetColor = color || ""
    
    return item.productId === productId && 
           itemSize === targetSize && 
           itemColor === targetColor
  })

  if (!line) {
    console.log('Cart items:', cart.items)
    console.log('Looking for:', { productId, size, color })
    throw new Error(`Cart item not found: ${productId} (${size}, ${color})`)
  }

  if (quantity <= 0) {
    await removeCartLine(cartId, line.id)
  } else {
    await updateCartLine(cartId, line.id, quantity)
  }

  return { success: true }
}

/**
 * Removes item from cart
 */
export async function removeFromCart(productId: string, size: string, color: string) {
  return updateCartItem(productId, size, color, 0)
}

/**
 * Clears the cart (removes all items)
 */
export async function clearCart() {
  const cartId = await getCartIdFromCookie()
  if (!cartId) {
    return { success: true }
  }

  const cart = await getCart()
  if (!cart) {
    return { success: true }
  }

  // Remove all cart lines
  await Promise.all(cart.items.map((item) => removeCartLine(cartId, item.id)))

  return { success: true }
}

/**
 * Gets checkout URL for the current cart
 */
export async function getCheckoutUrl(): Promise<string | null> {
  const cartId = await getCartIdFromCookie()
  if (!cartId) {
    return null
  }

  return getShopifyCheckoutUrl(cartId)
}
