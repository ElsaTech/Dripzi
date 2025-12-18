import { SmoothScrollProvider } from "@/components/home/smooth-scroll-provider"
import { HeroSection } from "@/components/home/hero-section"
import { EditorialCollections } from "@/components/home/editorial-collections"
import { BrandStory } from "@/components/home/brand-story"
import { FeaturedProducts } from "@/components/home/featured-products"
import { ParallaxSection } from "@/components/home/parallax-section"
import { FloatingCartButton } from "@/components/interactive/floating-cart-button"
import { ScrollToTop } from "@/components/interactive/scroll-to-top"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { getProducts } from "@/lib/products"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dripzi Store – Premium Streetwear & Luxury Fashion Essentials",
  description:
    "Shop premium streetwear, oversized silhouettes, and modern fashion at Dripzi Store. Discover designer coats, blazers, shirts, and sweatshirts for men, women, and unisex collections. Free shipping on orders over $100.",
  keywords: [
    "premium streetwear",
    "luxury fashion",
    "oversized clothing",
    "designer coats",
    "blazers",
    "modern fashion",
    "unisex fashion",
  ],
  openGraph: {
    title: "Dripzi Store – Premium Streetwear & Luxury Fashion",
    description:
      "Discover premium streetwear and luxury fashion essentials. Shop oversized, regular, and designed collections.",
    type: "website",
    url: "https://dripzi.store",
  },
  alternates: {
    canonical: "https://dripzi.store",
  },
}

export default async function Home() {
  const featuredProducts = await getProducts(undefined, true)

  return (
    <>
      <LoadingScreen />
      <SmoothScrollProvider>
        <div className="min-h-screen bg-background">
          <main>
            <HeroSection />
            <EditorialCollections />
            <BrandStory />
            <FeaturedProducts products={featuredProducts} />
            <ParallaxSection />
          </main>
          <FloatingCartButton />
          <ScrollToTop />
        </div>
      </SmoothScrollProvider>
    </>
  )
}
