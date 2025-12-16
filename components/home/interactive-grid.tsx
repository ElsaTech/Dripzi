"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Award, Package } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Crafted with the finest materials for unparalleled comfort and durability.",
  },
  {
    icon: Zap,
    title: "Fast Shipping",
    description: "Express delivery worldwide. Your style, delivered at lightning speed.",
  },
  {
    icon: Award,
    title: "Exclusive Designs",
    description: "Limited edition pieces that make you stand out from the crowd.",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "30-day hassle-free returns. Your satisfaction is our priority.",
  },
]

export function InteractiveGrid() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-5xl font-bold text-black md:text-6xl">Why Choose Dripzi Store</h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="neumorphic rounded-3xl p-8 transition-all"
              >
                <div className="neumorphic-sm mb-4 inline-flex rounded-2xl p-4">
                  <Icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-black">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
