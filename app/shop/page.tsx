import { Suspense } from "react"
import { getProducts } from "@/lib/actions/products"
import { ShopPageClient } from "@/components/shop/shop-page-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop Premium Streetwear & Luxury Fashion",
  description:
    "Explore our complete collection of premium fashion pieces. Shop designer coats, blazers, shirts, and sweatshirts. Browse oversized, regular, and designed collections for men, women, and unisex styles at Dripzi Store.",
  keywords: [
    "shop streetwear",
    "luxury fashion shop",
    "designer clothing",
    "premium coats",
    "designer blazers",
    "fashion shopping",
  ],
  openGraph: {
    title: "Shop Premium Streetwear & Luxury Fashion | Dripzi Store",
    description:
      "Explore our complete collection of premium fashion pieces. Designer coats, blazers, shirts, and sweatshirts.",
    type: "website",
  },
  alternates: {
    canonical: "https://dripzi.store/shop",
  },
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen" />}>
        <ShopPageClient initialProducts={products} />
      </Suspense>
    </div>
  )
}
