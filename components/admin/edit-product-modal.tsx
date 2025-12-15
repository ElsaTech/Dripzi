"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Note: Product updates are handled by Shopify Admin
// This component is kept for reference but should not be used
import { useRouter } from "next/navigation"

interface EditProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    salePrice: product.salePrice?.toString() || "",
    stock: product.stock.toString(),
    featured: product.featured,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Product updates must be done through Shopify Admin panel.")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="neumorphic rounded-3xl bg-white p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-black">Edit Product</h2>
                <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="neumorphic-inset rounded-2xl border-0"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="neumorphic-inset w-full rounded-2xl border-0 p-4"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="neumorphic-inset rounded-2xl border-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black">Sale Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="neumorphic-inset rounded-2xl border-0"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black">Stock *</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="neumorphic-inset rounded-2xl border-0"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-edit"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-5 w-5 rounded"
                  />
                  <label htmlFor="featured-edit" className="text-sm font-semibold text-black">
                    Featured Product
                  </label>
                </div>

                <Button
                  type="submit"
                  className="neumorphic w-full rounded-2xl bg-black py-6 text-lg font-bold text-white"
                >
                  Update Product
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
