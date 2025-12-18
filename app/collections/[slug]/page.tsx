import { Suspense } from "react"
import { getProducts } from "@/lib/actions/products"
import { CollectionPageClient } from "@/components/collections/collection-page-client"
import { StructuredData } from "@/components/seo/structured-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

const collectionData: Record<string, { name: string; description: string; filterTag: string }> = {
  "new-arrival": {
    name: "New Arrival",
    description: "Fresh from the runway, discover our latest pieces that define the season ahead",
    filterTag: "new-arrival",
  },
  regular: {
    name: "Regular",
    description: "Classic fits and timeless silhouettes for everyday luxury",
    filterTag: "regular",
  },
  oversized: {
    name: "Oversized",
    description: "Contemporary proportions that redefine modern elegance",
    filterTag: "oversized",
  },
  designed: {
    name: "Designed",
    description: "Exclusive curated pieces from our signature collections",
    filterTag: "designed",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = collectionData[slug]

  if (!collection) {
    return {
      title: "Collection Not Found | Dripzi Store",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${collection.name} Collection | Premium Fashion`,
    description: `${collection.description}. Shop ${collection.name.toLowerCase()} styles at Dripzi Store featuring premium streetwear and luxury fashion pieces.`,
    keywords: [
      `${collection.name.toLowerCase()} fashion`,
      "premium clothing",
      "luxury streetwear",
      "designer collection",
    ],
    openGraph: {
      title: `${collection.name} Collection | Dripzi Store`,
      description: collection.description,
      type: "website",
    },
    alternates: {
      canonical: `https://dripzi.store/collections/${slug}`,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = collectionData[slug]

  if (!collection) {
    notFound()
  }

  const allProducts = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <StructuredData
        type="collection"
        data={{
          name: collection.name,
          description: collection.description,
        }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <CollectionPageClient collection={collection} initialProducts={allProducts} />
      </Suspense>
    </div>
  )
}
