import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-border/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24">
        <div className="grid gap-12 sm:gap-16 md:gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="relative mb-6 sm:mb-8 h-8 w-24 sm:h-10 sm:w-28">
              <Image src="/images/image_logo.png" alt="Dripzi Store" fill className="object-contain brightness-20" />
            </div>
            <p className="luxury-body text-background/60 max-w-md text-sm sm:text-base leading-relaxed">
              Contemporary fashion for the discerning individual
            </p>
          </div>

          <div>
            <nav className="space-y-3 sm:space-y-4">
              <Link
                href="/shop"
                className="block luxury-subheading text-background/80 hover:text-background transition-colors duration-700"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block luxury-subheading text-background/80 hover:text-background transition-colors duration-700"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block luxury-subheading text-background/80 hover:text-background transition-colors duration-700"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 md:mt-24 pt-6 sm:pt-8 border-t border-background/10">
          <p className="luxury-body text-xs sm:text-sm text-background/40">© 2025 Dripzi Store</p>
        </div>
      </div>
    </footer>
  )
}
