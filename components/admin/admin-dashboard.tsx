"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, ShoppingCart } from "lucide-react"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { ProductsTable } from "./products-table"
import { OrdersTable } from "./orders-table"

interface AdminDashboardProps {
  products: any[]
  orders: any[]
}

/**
 * Admin Dashboard - Read-only view of Shopify products.
 * Products and orders must be managed through Shopify Admin panel.
 */
export function AdminDashboard({ products, orders }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  const [loading, setLoading] = useState(false)

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Order Management",
      value: "Shopify Admin",
      icon: ShoppingCart,
      color: "bg-green-500",
    },
  ]

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <LoadingScreen isLoading={loading} />
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-serif text-5xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your Dripzi Store</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="neumorphic rounded-3xl bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                </div>
                <div className={`${stat.color} flex h-14 w-14 items-center justify-center rounded-2xl`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="neumorphic mb-8 rounded-3xl bg-white p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
              activeTab === "products" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
              activeTab === "orders" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="neumorphic rounded-3xl bg-white p-8">
        {activeTab === "products" && (
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-black">Product Management</h2>
              <p className="text-sm text-gray-600">
                Products are managed through Shopify Admin. This is a read-only view.
              </p>
            </div>
            <ProductsTable products={products} />
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="mb-2 text-2xl font-bold text-black">Order Management</h2>
            <p className="mb-6 text-sm text-gray-600">
              Orders are managed through Shopify Admin. This is a read-only view.
            </p>
            <OrdersTable orders={orders} />
          </div>
        )}
      </div>
    </main>
  )
}
