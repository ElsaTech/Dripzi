import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StructuredData } from "@/components/seo/structured-data"
import { PageTransition } from "@/components/ui/page-transition"
import { AuthProvider } from "@/components/auth/auth-provider"
import { UserProvider } from "@/components/auth/user-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/actions/auth"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Dripzi Store - Premium Fashion & Designer Clothing | Modern Luxury Apparel",
    template: "%s | Dripzi Store"
  },
  description: "Shop premium fashion at Dripzi Store. Discover luxury coats, blazers, shirts & sweatshirts with modern neumorphic design. Free shipping over $100. Premium quality guaranteed.",
  keywords: ["premium fashion", "luxury clothing", "designer apparel", "modern fashion", "neumorphic design", "coats", "blazers", "shirts", "sweatshirts", "fashion store", "online shopping", "mobile shopping", "3D fashion"],
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
  metadataBase: new URL('https://dripzi.store'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Dripzi Store - Premium Fashion & Designer Clothing",
    description: "Shop premium fashion at Dripzi Store. Luxury coats, blazers, shirts & sweatshirts with modern design. Free shipping over $100.",
    url: 'https://dripzi.store',
    siteName: 'Dripzi Store',
    images: [
      {
        url: '/images/image.png',
        width: 1200,
        height: 630,
        alt: 'Dripzi Store - Premium Fashion Collection',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dripzi Store - Premium Fashion & Designer Clothing",
    description: "Shop premium fashion at Dripzi Store. Luxury apparel with modern neumorphic design.",
    images: ['/images/image.png'],
    creator: '@dripzistore',
    site: '@dripzistore',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dripzi Store',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialUser = await getCurrentUser()
  
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dripzi Store" />
        <meta name="application-name" content="Dripzi Store" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://api.dripzi.store" />
        <link rel="preload" href="/images/image.png" as="image" type="image/png" />
      </head>
      <body className={`font-sans antialiased touch-manipulation`} style={{WebkitTapHighlightColor: 'transparent'}}>
        <StructuredData type="website" data={{}} />
        <StructuredData type="organization" data={{}} />
        <UserProvider initialUser={initialUser}>
          <AuthProvider>
            <Header user={initialUser} />
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
          </AuthProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
