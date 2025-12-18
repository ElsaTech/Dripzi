import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/actions/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dripzi.store"

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]

  const collections = ["new-arrival", "regular", "oversized", "designed"]
  const collectionPages = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category pages
  const categories = ["coats", "blazers", "shirts", "sweatshirts"]
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/shop/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Product pages
  let productPages: any[] = []
  try {
    const products = await getProducts()
    productPages = products.map((product) => {
      const lastModified = product.updatedAt || product.createdAt
      return {
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: lastModified ? new Date(lastModified) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
  }

  return [...staticPages, ...collectionPages, ...categoryPages, ...productPages]
}
