import { SmoothScrollProvider } from "@/components/home/smooth-scroll-provider"
import { HeroSection } from "@/components/home/hero-section"
import { EditorialCollections } from "@/components/home/editorial-collections"
import { FeaturedProducts } from "@/components/home/featured-products"
import { ParallaxSection } from "@/components/home/parallax-section"
import { DiscountPopup } from "@/components/interactive/discount-popup"
import { FloatingCartButton } from "@/components/interactive/floating-cart-button"
import { ScrollToTop } from "@/components/interactive/scroll-to-top"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { getProducts } from "@/lib/products"

export default async function Home() {
  // Fetch featured products from Shopify
  const featuredProducts = await getProducts(undefined, true)

  return (
    <>
      <LoadingScreen />
      <SmoothScrollProvider>
        <div className="min-h-screen bg-background">
          <main>
            <HeroSection />
            <EditorialCollections />
            <FeaturedProducts products={featuredProducts} />
            <ParallaxSection />
          </main>
          {/* <DiscountPopup /> */}
          <FloatingCartButton />
          <ScrollToTop />
        </div>
      </SmoothScrollProvider>
    </>
  )
}
