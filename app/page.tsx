import { SmoothScrollProvider } from "@/components/home/smooth-scroll-provider"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { ParallaxSection } from "@/components/home/parallax-section"
import { InteractiveGrid } from "@/components/home/interactive-grid"
import { DiscountPopup } from "@/components/interactive/discount-popup"
import { FloatingCartButton } from "@/components/interactive/floating-cart-button"
import { ScrollToTop } from "@/components/interactive/scroll-to-top"
import { LoadingScreen } from "@/components/interactive/loading-screen"
import { AnnouncementBar } from "@/components/interactive/announcement-bar"
import { getProducts } from "@/lib/products"

export default async function Home() {
  // Fetch featured products from Shopify
  const featuredProducts = await getProducts(undefined, true)

  return (
    <>
      <LoadingScreen />
      <SmoothScrollProvider>
        <div className="min-h-screen bg-background">
          <AnnouncementBar />
          <main>
            <HeroSection />
            <FeaturedCategories />
            <FeaturedProducts products={featuredProducts} />
            <ParallaxSection />
            <InteractiveGrid />
          </main>
          {/* <DiscountPopup /> */}
          <FloatingCartButton />
          <ScrollToTop />
        </div>
      </SmoothScrollProvider>
    </>
  )
}
