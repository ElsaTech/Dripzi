import Link from "next/link"
import Image from "next/image"
import { Instagram, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="relative mb-4 h-12 w-32">
              <Image src="/images/image.png" alt="Dripzi Store" fill className="object-contain brightness-100" />
            </div>
            <p className="text-sm text-gray-400">FASHION WITH NO RULES</p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://instagram.com/dripzistore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.dripzi.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider">SHOP</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/shop/coats" className="hover:text-white">
                  Coats
                </Link>
              </li>
              <li>
                <Link href="/shop/blazers" className="hover:text-white">
                  Blazers
                </Link>
              </li>
              <li>
                <Link href="/shop/shirts" className="hover:text-white">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop/sweatshirts" className="hover:text-white">
                  Sweatshirts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider">SUPPORT</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider">COMPANY</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Dripzi Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
