import "server-only"

/**
 * Shopify Storefront API Client
 * Supports both @shopify/storefront-api-client and direct fetch
 * 
 * Optimized for Shopify Headless Channel with flexible token support
 * - Attempts official @shopify/storefront-api-client first
 * - Falls back to direct fetch for token formats official client doesn't support
 * 
 * Environment Variables:
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN_PRIVATE: Private token for server operations
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN_PUBLIC: Public token for client operations
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN: Fallback generic token
 * - SHOPIFY_STORE_DOMAIN: Your Shopify domain
 * 
 * Server-side only - token never exposed to client
 */

import { createStorefrontApiClient } from "@shopify/storefront-api-client"

const STOREFRONT_API_VERSION = "2024-01"

export interface ShopifyStorefrontResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: { code?: string }
  }>
}

// Client instances cached per token type
let clientPrivate: ReturnType<typeof createStorefrontApiClient> | null = null
let clientPublic: ReturnType<typeof createStorefrontApiClient> | null = null
let clientPrivateUseFetch = false
let clientPublicUseFetch = false

/**
 * Get or create a Storefront API client instance
 */
function getStorefrontClient(usePublicToken: boolean = false) {
  // Return cached client if available
  if (usePublicToken && clientPublic) {
    return { client: clientPublic, useFetch: clientPublicUseFetch }
  }
  if (!usePublicToken && clientPrivate) {
    return { client: clientPrivate, useFetch: clientPrivateUseFetch }
  }

  const tokenEnvKey = usePublicToken
    ? "SHOPIFY_STOREFRONT_ACCESS_TOKEN_PUBLIC"
    : "SHOPIFY_STOREFRONT_ACCESS_TOKEN_PRIVATE"

  // Get token from environment
  let accessToken = process.env[tokenEnvKey]

  // Fallback to generic token name for backwards compatibility
  if (!accessToken && !usePublicToken) {
    accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  }

  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN

  if (!accessToken) {
    throw new Error(
      `Shopify Storefront token not found. Set ${tokenEnvKey} or SHOPIFY_STOREFRONT_ACCESS_TOKEN in environment`
    )
  }

  if (!shopDomain) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not set in environment variables")
  }

  // Remove protocol if present
  const cleanDomain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")

  // Try to create official client, fallback to manual fetch if token format not supported
  let useFetch = false
  let newClient: any = null

  try {
    newClient = createStorefrontApiClient({
      storeDomain: cleanDomain,
      accessToken: accessToken,
      apiVersion: STOREFRONT_API_VERSION,
    })
  } catch (error) {
    // Official client doesn't support this token format, will use manual fetch
    useFetch = true
    newClient = { domain: cleanDomain, token: accessToken }
  }

  // Cache the client
  if (usePublicToken) {
    clientPublic = newClient
    clientPublicUseFetch = useFetch
  } else {
    clientPrivate = newClient
    clientPrivateUseFetch = useFetch
  }

  return { client: newClient, useFetch }
}

/**
 * Direct fetch implementation for Headless Channel tokens
 */
async function storefrontFetchDirect<T>(
  domain: string,
  token: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<ShopifyStorefrontResponse<T>> {
  const response = await fetch(
    `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  if (result.errors) {
    console.error("Shopify GraphQL errors:", result.errors)
  }

  return result
}

/**
 * Execute a GraphQL query or mutation against Shopify Storefront API
 * Uses official @shopify/storefront-api-client when possible
 * Falls back to direct fetch for token formats not supported by official client
 */
export async function storefrontFetch<T>({
  query,
  variables,
  usePublicToken = false,
}: {
  query: string
  variables?: Record<string, unknown>
  usePublicToken?: boolean
}): Promise<ShopifyStorefrontResponse<T>> {
  try {
    const { client, useFetch } = getStorefrontClient(usePublicToken)

    if (useFetch) {
      // Use direct fetch for token formats official client doesn't support
      return await storefrontFetchDirect<T>(
        client.domain,
        client.token,
        query,
        variables
      )
    } else {
      // Use official @shopify/storefront-api-client
      return await client.request<T>(query, { variables })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Shopify API error"
    const tokenType = usePublicToken ? "public" : "private"
    console.error(`Shopify Storefront API error (${tokenType} token):`, errorMessage)

    if (
      errorMessage.includes("401") ||
      errorMessage.includes("Unauthorized") ||
      errorMessage.includes("access token")
    ) {
      throw new Error(`Unauthorized: Invalid or expired Storefront API ${tokenType} token`)
    }

    throw error
  }
}
