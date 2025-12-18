import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { StructuredData } from "@/components/seo/structured-data"
import { PageTransition } from "@/components/ui/page-transition"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DiscountPopup } from "@/components/interactive/discount-popup"
import { PasswordSetupBanner } from "@/components/auth/password-setup-banner"
import { ClerkProvider } from "@clerk/nextjs"
import { getCurrentUser } from "@/lib/clerk/server"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "600"],
  display: "swap",
})

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Dripzi Store – Premium Streetwear & Luxury Fashion Essentials",
    template: "%s | Dripzi Store",
  },
  description:
    "Dripzi Store offers premium streetwear, oversized silhouettes, and modern fashion for men, women, and unisex collections. Shop designer coats, blazers, shirts, and sweatshirts with free shipping.",
  keywords: [
    "premium streetwear",
    "luxury fashion",
    "oversized clothing",
    "designer coats",
    "blazers",
    "modern fashion",
    "unisex fashion",
    "men's streetwear",
    "women's streetwear",
    "contemporary clothing",
    "fashion essentials",
  ],
  authors: [{ name: "Dripzi Store" }],
  creator: "Dripzi Store",
  publisher: "Dripzi Store",
  category: "fashion",
  classification: "E-commerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dripzi.store"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dripzi Store – Premium Streetwear & Luxury Fashion Essentials",
    description:
      "Discover premium streetwear and luxury fashion essentials. Shop oversized, regular, and designed collections for men, women, and unisex styles.",
    url: "https://dripzi.store",
    siteName: "Dripzi Store",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "Dripzi Store – Premium streetwear collection featuring oversized silhouettes and luxury fashion essentials",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dripzi Store – Premium Streetwear & Luxury Fashion",
    description:
      "Shop premium streetwear and luxury fashion. Oversized, regular, and designed collections for modern style.",
    images: ["/images/image.png"],
    creator: "@dripzistore",
    site: "@dripzistore",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: [{ url: "/images/image.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/images/image.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/images/image.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dripzi Store",
  },
  generator: "v0.app",
}

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialUser = await getCurrentUser()

  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${satoshi.variable}`}>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
          />
          <meta name="theme-color" content="#FAF9F6" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#1C1C1C" media="(prefers-color-scheme: dark)" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Dripzi Store" />
          <meta name="application-name" content="Dripzi Store" />
          <meta name="msapplication-TileColor" content="#F7F6F3" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://api.dripzi.store" />
          <link rel="preload" href="/images/image.png" as="image" type="image/png" />
        </head>
        <body className={`font-sans antialiased touch-manipulation`} style={{ WebkitTapHighlightColor: "transparent" }}>
          <StructuredData type="website" data={{}} />
          <StructuredData type="organization" data={{}} />
          <AuthProvider>
            <Header user={initialUser} />
            <div className="pt-16 md:pt-20">
              <PageTransition>{children}</PageTransition>
              <Footer />
            </div>
            <DiscountPopup />
            <PasswordSetupBanner />
          </AuthProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
