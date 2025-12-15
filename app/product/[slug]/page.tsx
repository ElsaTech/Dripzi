import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetailClient } from "@/components/products/product-detail-client"
import { StructuredData } from "@/components/seo/structured-data"
import { getCurrentUser } from "@/lib/actions/auth"
import { getProductBySlug } from "@/lib/actions/products"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Revalidate product data every 60 seconds to get fresh inventory from Shopify
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Dripzi Store',
      description: 'The requested product could not be found.',
      robots: { index: false, follow: false }
    }
  }

  const price = product.salePrice || product.price
  const availability = product.stock > 0 ? 'In Stock' : 'Out of Stock'
  
  return {
    title: `${product.name} | Premium ${product.category} | Dripzi Store`,
    description: `${product.description.slice(0, 155)}... Shop premium ${product.category} at Dripzi Store. ${availability}. Free shipping over $100.`,
    keywords: [`${product.name}`, `${product.category}`, 'premium fashion', 'luxury clothing', 'designer apparel', 'mobile shopping', '3D fashion'],
    openGraph: {
      title: `${product.name} | Dripzi Store`,
      description: `${product.description} - $${price} ${availability}`,
      images: product.images.map((img, index) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${product.name} - Image ${index + 1}`,
        type: 'image/jpeg'
      })),
      type: 'website',
      url: `https://dripzi.store/product/${slug}`,
      siteName: 'Dripzi Store'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Dripzi Store`,
      description: `${product.description.slice(0, 200)}`,
      images: [product.images[0]],
      creator: '@dripzistore'
    },
    alternates: {
      canonical: `/product/${slug}`
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'USD',
      'product:availability': availability.toLowerCase().replace(' ', '_'),
      'product:condition': 'new',
      'product:brand': 'Dripzi Store'
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await getCurrentUser()
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const breadcrumbData = {
    items: [
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), url: `/shop/${product.category}` },
      { name: product.name, url: `/product/${slug}` }
    ]
  }

  return (
    <div className="min-h-screen bg-white">
      <StructuredData type="product" data={{
        name: product.name,
        description: product.description,
        images: product.images,
        price: product.salePrice || product.price,
        inStock: product.stock > 0,
        rating: {
          average: 4.8,
          count: 127
        }
      }} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <Header user={user} />
      <ProductDetailClient product={product} />
      <Footer />
    </div>
  )
}
