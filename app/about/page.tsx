import { getCurrentUser } from "@/lib/actions/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Dripzi Store – Premium Streetwear Brand Philosophy",
  description:
    "Learn about Dripzi Store, a premium fashion brand redefining modern streetwear. Discover our philosophy of luxury in everyday silhouettes, quality craftsmanship, and sustainable fashion practices. Fashion With No Rules.",
  keywords: [
    "about Dripzi Store",
    "fashion brand story",
    "premium streetwear brand",
    "sustainable fashion",
    "luxury clothing philosophy",
  ],
  openGraph: {
    title: "About Dripzi Store – Premium Streetwear & Fashion Philosophy",
    description:
      "Dripzi Store redefines modern fashion with premium streetwear, oversized silhouettes, and sustainable practices.",
    type: "website",
  },
  alternates: {
    canonical: "https://dripzi.store/about",
  },
}

export default async function AboutPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">About Dripzi Store</h1>
          <p className="text-xl text-gray-600">Fashion With No Rules</p>
        </div>

        <div className="neumorphic space-y-8 rounded-3xl p-8 md:p-12">
          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Our Story</h2>
            <p className="leading-relaxed text-gray-700">
              Dripzi Store was born from a vision to redefine modern fashion and premium streetwear. We believe in
              breaking boundaries and creating pieces that empower individuals to express their unique style without
              constraints. Our collections feature oversized silhouettes, regular fits, and carefully designed pieces
              for men, women, and unisex fashion enthusiasts who appreciate quality and contemporary design.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Our Philosophy</h2>
            <p className="leading-relaxed text-gray-700">
              Experience the intersection of bold design principles and sophisticated aesthetics. We craft fashion that
              merges timeless style with contemporary innovation, creating premium streetwear pieces that stand the test
              of time. From designer coats and blazers to shirts and sweatshirts, each item reflects our commitment to
              form, fit, and presence.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Quality & Sustainability</h2>
            <p className="leading-relaxed text-gray-700">
              Every piece at Dripzi Store is crafted with premium materials and ethical manufacturing practices. We're
              committed to sustainability and ensuring that our fashion choices contribute positively to the world. Our
              luxury clothing is designed to last, reducing waste while maintaining the highest standards of quality and
              craftsmanship.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-black">Join the Movement</h2>
            <p className="leading-relaxed text-gray-700">
              Dripzi Store is more than a brand—it's a community of individuals who dare to be different. Join us in
              redefining what fashion means in the modern era. Explore our premium streetwear collections featuring
              oversized, regular, and designed styles that celebrate individuality and contemporary luxury.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
