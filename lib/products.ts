import "server-only"

/**
 * Product queries using Shopify Storefront API
 * Maps Shopify product data to match existing UI structure
 */

import { storefrontFetch } from "./shopify"

/**
 * Wrapper for storefrontFetch that handles the official client's response format
 * The official client returns { data, errors } or throws
 */
async function fetchFromShopify<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await storefrontFetch<T>({ query, variables })

  if (response.errors && response.errors.length > 0) {
    const errorMsg = response.errors.map((e) => e.message).join("; ")
    throw new Error(`Shopify GraphQL Error: ${errorMsg}`)
  }

  if (!response.data) {
    throw new Error("No data returned from Shopify API")
  }

  return response.data
}

// Shopify GraphQL types
interface ShopifyImage {
  url: string
  altText?: string
}

interface ShopifyPrice {
  amount: string
  currencyCode: string
}

interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoneyV2
  compareAtPrice?: ShopifyMoneyV2
  selectedOptions: Array<{ name: string; value: string }>
  image?: ShopifyImage
}

interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  images: {
    edges: Array<{ node: ShopifyImage }>
  }
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>
  }
  priceRange: {
    minVariantPrice: ShopifyMoneyV2
    maxVariantPrice: ShopifyMoneyV2
  }
  tags: string[]
  productType?: string
  collections: {
    edges: Array<{ node: { handle: string; title: string } }>
  }
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

interface ShopifyProductResponse {
  product: ShopifyProduct | null
}

// UI-compatible Product type (matches lib/db/models.ts structure)
export interface Product {
  id: string
  _id?: string // Keep for backward compatibility
  name: string
  slug: string // Maps to handle
  description: string
  price: number
  salePrice?: number
  category: "coats" | "blazers" | "shirts" | "sweatshirts" | "accessories"
  images: string[]
  sizes: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[]
  colors: string[]
  stock: number
  featured: boolean
  variants: Array<{
    id: string
    size?: string
    color?: string
    price: number
    available: boolean
  }>
}

/**
 * Maps Shopify product type/category to our category enum
 */
function mapCategory(productType?: string, tags?: string[]): Product["category"] {
  const lowerType = productType?.toLowerCase() || ""
  const lowerTags = tags?.join(" ").toLowerCase() || ""

  const categoryString = (lowerType + " " + lowerTags).toLowerCase()

  if (categoryString.includes("coat") || categoryString.includes("jacket")) {
    return "coats"
  }
  if (categoryString.includes("blazer")) {
    return "blazers"
  }
  if (categoryString.includes("shirt")) {
    return "shirts"
  }
  if (categoryString.includes("sweatshirt") || categoryString.includes("sweater")) {
    return "sweatshirts"
  }
  if (
    categoryString.includes("accessory") ||
    categoryString.includes("accessories") ||
    categoryString.includes("bag") ||
    categoryString.includes("watch")
  ) {
    return "accessories"
  }

  // Default to shirts if no match
  return "shirts"
}

/**
 * Extracts available sizes and colors from variants
 */
function extractSizesAndColors(variants: ShopifyProductVariant[]): {
  sizes: Product["sizes"]
  colors: Product["colors"]
} {
  const sizesSet = new Set<Product["sizes"][number]>()
  const colorsSet = new Set<string>()

  variants.forEach((variant) => {
    variant.selectedOptions.forEach((option) => {
      const normalizedName = option.name.toLowerCase()
      const value = option.value

      if (normalizedName === "size") {
        if (["XS", "S", "M", "L", "XL", "XXL"].includes(value)) {
          sizesSet.add(value as Product["sizes"][number])
        }
      } else if (normalizedName === "color" || normalizedName === "colour") {
        colorsSet.add(value)
      }
    })
  })

  // Sort sizes in order
  const sizeOrder: Product["sizes"] = ["XS", "S", "M", "L", "XL", "XXL"]
  const sizes = sizeOrder.filter((size) => sizesSet.has(size))

  return {
    sizes: sizes.length > 0 ? sizes : (["XS", "S", "M", "L", "XL"] as Product["sizes"]),
    colors: colorsSet.size > 0 ? Array.from(colorsSet) : ["Black", "White", "Gray"],
  }
}

/**
 * Transforms Shopify product to UI-compatible format
 */
function transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  const variants = shopifyProduct.variants.edges.map((edge) => edge.node)
  const { sizes, colors } = extractSizesAndColors(variants)

  // Find min price and compareAtPrice for sale price
  const prices = variants.map((v) => parseFloat(v.price.amount))
  const comparePrices = variants
    .map((v) => (v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null))
    .filter((p): p is number => p !== null)

  const minPrice = Math.min(...prices)
  const minComparePrice = comparePrices.length > 0 ? Math.min(...comparePrices) : null
  const salePrice = minComparePrice && minComparePrice > minPrice ? minPrice : undefined
  const regularPrice = salePrice ? minComparePrice! : minPrice

  // Get images
  const images = shopifyProduct.images.edges.map((edge) => edge.node.url)

  // Check if featured (by tag)
  const isFeatured = shopifyProduct.tags.some(
    (tag) => tag.toLowerCase() === "featured" || tag.toLowerCase() === "feature",
  )

  // Calculate stock (count available variants)
  const availableCount = variants.filter((v) => v.availableForSale).length

  // Map variants with size/color info - only use real Shopify variants
  const mappedVariants = variants.map((variant) => {
    const sizeOption = variant.selectedOptions.find(
      (opt) => opt.name.toLowerCase() === "size",
    )?.value
    const colorOption = variant.selectedOptions.find(
      (opt) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour",
    )?.value

    return {
      id: variant.id,
      size: sizeOption,
      color: colorOption,
      price: parseFloat(variant.price.amount),
      available: variant.availableForSale,
    }
  })

  console.log(`[Product: ${shopifyProduct.title}] Total variants: ${variants.length} | Available: ${availableCount} | Mapped variants: ${mappedVariants.length}`)

  return {
    id: shopifyProduct.id,
    _id: shopifyProduct.id, // For backward compatibility
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    description: shopifyProduct.description || shopifyProduct.descriptionHtml.replace(/<[^>]*>/g, ""),
    price: regularPrice,
    salePrice,
    category: mapCategory(shopifyProduct.productType, shopifyProduct.tags),
    images,
    sizes,
    colors,
    stock: availableCount,
    featured: isFeatured,
    variants: mappedVariants,
  }
}

/**
 * Fetches all products (with optional category and featured filters)
 */
export async function getProducts(category?: string, featured?: boolean): Promise<Product[]> {
  let query = `query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                handle
                title
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyProductsResponse>(query, { first: 250 })

  let products = data.products.edges.map((edge) => transformShopifyProduct(edge.node))

  // Filter by category if provided
  if (category) {
    products = products.filter((p) => p.category === category)
  }

  // Filter by featured if provided
  if (featured) {
    products = products.filter((p) => p.featured)
  }

  return products
}

/**
 * Fetches a product by handle (slug)
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyProductResponse>(query, { handle })

  if (!data.product) {
    return null
  }

  return transformShopifyProduct(data.product)
}

/**
 * Fetches a product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  // Extract GID from Shopify ID format (gid://shopify/Product/123456)
  // or handle if it's just the numeric ID
  const productId = id.includes("gid://") ? id : `gid://shopify/Product/${id}`

  const query = `query GetProductById($id: ID!) {
    product(id: $id) {
      id
      handle
      title
      description
      descriptionHtml
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyProductResponse>(query, { id: productId })

  if (!data.product) {
    return null
  }

  return transformShopifyProduct(data.product)
}

/**
 * Searches products by query string
 */
export async function searchProducts(searchQuery: string): Promise<Product[]> {
  const query = `query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                handle
                title
              }
            }
          }
        }
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyProductsResponse>(query, {
    query: `title:*${searchQuery}* OR description:*${searchQuery}*`,
    first: 20,
  })

  return data.products.edges.map((edge) => transformShopifyProduct(edge.node))
}
