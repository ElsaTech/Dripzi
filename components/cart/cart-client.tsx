"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { updateCartItem, removeFromCart } from "@/lib/actions/cart"
import { getProductById } from "@/lib/actions/products"
import { useRouter } from "next/navigation"

interface CartClientProps {
  cart: any
}

export function CartClient({ cart: initialCart }: CartClientProps) {
  const [cart, setCart] = useState(initialCart)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setLoading(false)
      return
    }

    const fetchCartItems = async () => {
      const items = await Promise.all(
        cart.items.map(async (item: any) => {
          const product = await getProductById(item.productId)
          return {
            ...item,
            product,
          }
        }),
      )
      setCartItems(items)
      setLoading(false)
    }

    fetchCartItems()
  }, [cart])

  const handleUpdateQuantity = async (productId: string, size: string, color: string, newQuantity: number) => {
    setUpdating(true)
    
    // Optimistic update
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId && (item.size || '') === (size || '') && (item.color || '') === (color || '')) {
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(item => item.quantity > 0)
    
    setCartItems(updatedItems)
    
    try {
      await updateCartItem(productId, size, color, newQuantity)
    } catch (error) {
      console.error('Error updating cart:', error)
      alert('Failed to update cart. Please try again.')
      // Revert optimistic update on error
      router.refresh()
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async (productId: string, size: string, color: string) => {
    setUpdating(true)
    
    // Optimistic update - remove item immediately
    const updatedItems = cartItems.filter(item => 
      !(item.productId === productId && (item.size || '') === (size || '') && (item.color || '') === (color || ''))
    )
    
    setCartItems(updatedItems)
    
    try {
      await removeFromCart(productId, size, color)
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert('Failed to remove item. Please try again.')
      // Revert optimistic update on error
      router.refresh()
    } finally {
      setUpdating(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.salePrice || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (loading) {
    return (
      <main className="relative mx-auto min-h-screen max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <LoadingScreen isLoading={true} />
      </main>
    )
  }

  if (!cart || cartItems.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-24 w-24 text-gray-300" />
          <h1 className="mb-4 font-serif text-4xl font-bold text-black">Your cart is empty</h1>
          <p className="mb-8 text-lg text-gray-600">Looks like you haven't added anything yet</p>
          <Button asChild className="neumorphic rounded-full bg-black px-8 py-6 text-white">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <LoadingScreen isLoading={updating} />
      <h1 className="mb-12 font-serif text-5xl font-bold text-black">Shopping Cart</h1>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.productId}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neumorphic rounded-3xl p-6"
              >
                <div className="flex gap-6">
                  <div className="neumorphic-inset relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.product?.images?.[0] || "/placeholder.svg"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-black">{item.product?.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId, item.size, item.color)}
                        className="text-gray-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="neumorphic-sm flex items-center gap-4 rounded-full p-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-black">
                          ${((item.product?.salePrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="neumorphic sticky top-24 rounded-3xl p-8">
            <h2 className="mb-6 text-2xl font-bold text-black">Order Summary</h2>

            <div className="space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && <p className="text-sm text-gray-500">Free shipping on orders over $100</p>}
            </div>

            <div className="mt-6 flex justify-between border-b border-gray-200 pb-6">
              <span className="text-xl font-bold text-black">Total</span>
              <span className="text-2xl font-bold text-black">${total.toFixed(2)}</span>
            </div>

            <Button
              asChild
              className="neumorphic mt-6 w-full rounded-2xl bg-black py-6 text-lg font-bold text-white transition-all hover:scale-105"
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="mt-4 w-full rounded-2xl border-2 border-gray-200 py-6 bg-transparent"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
