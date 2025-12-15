"use server"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/actions/auth"
import Link from "next/link"

const collections = [
  {
    name: "2025 Collection",
    description:
      "Experience the intersection of bold Bauhaus design principles and sophisticated neumorphic interfaces.",
    slug: "2025-collection",
    image: "/fashion-model-black-and-white-minimalist.jpg",
  },
  {
    name: "Winter Essentials",
    description: "Stay warm and stylish with our curated winter collection featuring premium coats and layers.",
    slug: "winter-essentials",
    image: "/luxury-designer-coats-hanging.jpg",
  },
  {
    name: "Business Formal",
    description: "Make a statement in the boardroom with our professional blazers and tailored pieces.",
    slug: "business-formal",
    image: "/premium-blazers-collection.jpg",
  },
  {
    name: "Minimalist Basics",
    description: "Timeless pieces that form the foundation of any modern wardrobe.",
    slug: "minimalist-basics",
    image: "/minimalist-white-shirts.jpg",
  },
]

export default async function CollectionsPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">Our Collections</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover carefully curated collections that define modern fashion
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {collections.map((collection, index) => (
            <Link key={collection.slug} href={`/shop`} className="group">
              <div className="neumorphic overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-2 font-serif text-3xl font-bold text-black">{collection.name}</h3>
                  <p className="leading-relaxed text-gray-600">{collection.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
