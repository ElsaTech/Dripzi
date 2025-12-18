import { ProductDetailClient } from "@/components/products/product-detail-client"
import { StructuredData } from "@/components/seo/structured-data"
import { getCurrentUser } from "@/lib/actions/auth"
import { getProductBySlug } from "@/lib/actions/products"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | Dripzi Store",
      description: "The requested product could not be found.",
      robots: { index: false, follow: false },
    }
  }

  const price = product.salePrice || product.price
  const availability = product.stock > 0 ? "In Stock" : "Out of Stock"
  const categoryFormatted = product.category.charAt(0).toUpperCase() + product.category.slice(1)

  return {
    title: `${product.name} – Premium ${categoryFormatted}`,
    description: `${product.description.slice(0, 155)}. Shop ${product.name} at Dripzi Store. ${availability}. Premium ${categoryFormatted.toLowerCase()} from our luxury fashion collection. Free shipping over $100.`,
    keywords: [
      product.name,
      `premium ${product.category}`,
      `luxury ${product.category}`,
      "designer fashion",
      "streetwear",
      categoryFormatted,
      "Dripzi Store",
    ],
    openGraph: {
      title: `${product.name} | Dripzi Store`,
      description: `${product.description.slice(0, 200)} - $${price}. ${availability}.`,
      images: product.images.map((img, index) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${product.name} from Dripzi Store - Premium ${categoryFormatted} - View ${index + 1}`,
        type: "image/jpeg",
      })),
      type: "website",
      url: `https://dripzi.store/product/${slug}`,
      siteName: "Dripzi Store",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Dripzi Store`,
      description: `${product.description.slice(0, 200)}`,
      images: [product.images[0]],
      creator: "@dripzistore",
    },
    alternates: {
      canonical: `/product/${slug}`,
    },
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "USD",
      "product:availability": availability.toLowerCase().replace(" ", "_"),
      "product:condition": "new",
      "product:brand": "Dripzi Store",
      "product:category": categoryFormatted,
    },
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
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" },
      { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), url: `/shop/${product.category}` },
      { name: product.name, url: `/product/${slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white pt-10 md:pt-14">
      <StructuredData
        type="product"
        data={{
          name: product.name,
          description: product.description,
          images: product.images,
          price: product.salePrice || product.price,
          inStock: product.stock > 0,
          category: product.category,
          slug: slug,
          rating: {
            average: 4.8,
            count: 127,
          },
        }}
      />
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <ProductDetailClient product={product} />
    </div>
  )
}
