import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-border/10">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
        <div className="grid gap-24 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative mb-8 h-10 w-28">
              <Image src="/images/image.png" alt="Dripzi" fill className="object-contain brightness-20" />
            </div>
            <p className="luxury-body text-background/60 max-w-md text-base">
              Contemporary fashion for the discerning individual
            </p>
          </div>

          <div>
            <nav className="space-y-4">
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

        <div className="mt-24 pt-8 border-t border-background/10">
          <p className="luxury-body text-sm text-background/40">© 2025 Dripzi</p>
        </div>
      </div>
    </footer>
  )
}
