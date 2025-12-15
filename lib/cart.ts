import "server-only"

/**
 * Shopify Cart API Implementation
 * 
 * Implements Shopify Storefront Cart API mutations:
 * - cartCreate: Creates a new cart and returns cart ID
 * - cartLinesAdd: Adds items to an existing cart
 * - cartLinesRemove: Removes items from cart
 * 
 * Cart ID persistence is handled in lib/actions/cart.ts via HTTP-only cookies.
 * All functions require a cartId parameter which is managed by the actions layer.
 */

import { storefrontFetch } from "./shopify"

/**
 * Wrapper for storefrontFetch that handles the official client's response format
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

// Shopify Cart types
interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      id: string
      handle: string
      title: string
    }
    selectedOptions: Array<{ name: string; value: string }>
    image?: {
      url: string
      altText?: string
    }
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: Array<{ node: ShopifyCartLine }>
  }
}

interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface ShopifyCartGetResponse {
  cart: ShopifyCart | null
}

interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

// Cookie management functions - these accept cartId as parameter
// Actual cookie reading/writing is done in lib/actions/cart.ts

// Note: This file does not use process.env directly - cookie secure flag is handled in actions layer

/**
 * Creates a new cart using Shopify cartCreate mutation
 * @returns The cart ID (GID format: gid://shopify/Cart/...)
 */
export async function createCart(): Promise<string> {
  const query = `mutation CreateCart {
    cartCreate {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyCartCreateResponse>(query)

  if (!data.cartCreate?.cart) {
    const errors = data.cartCreate?.userErrors || []
    throw new Error(errors[0]?.message || "Failed to create cart")
  }

  return data.cartCreate.cart.id
}

/**
 * Gets existing cart by ID
 */
export async function getCartById(cartId: string): Promise<ShopifyCart | null> {
  const query = `query GetCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  handle
                  title
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
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyCartGetResponse>(query, { id: cartId })

  return data.cart || null
}

/**
 * Gets the current cart by ID (cartId must be provided from actions layer)
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (!cartId) {
    return null
  }

  return getCartById(cartId)
}

/**
 * Adds items to cart using Shopify cartLinesAdd mutation
 * @param cartId - Cart ID from createCart() or cookie
 * @param variantId - Shopify ProductVariant ID (GID format)
 * @param quantity - Quantity to add
 * @param attributes - Optional attributes (e.g., size, color)
 * @returns Updated cart object
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
  attributes?: Array<{ key: string; value: string }>,
): Promise<ShopifyCart> {

  // Format variant ID if needed
  const formattedVariantId = variantId.includes("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`

  const query = `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    handle
                    title
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
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`

  const lines = [
    {
      merchandiseId: formattedVariantId,
      quantity,
      attributes: attributes || [],
    },
  ]

  const data = await fetchFromShopify<ShopifyCartLinesAddResponse>(query, {
    cartId,
    lines,
  })

  if (!data.cartLinesAdd?.cart) {
    const errors = data.cartLinesAdd?.userErrors || []
    throw new Error(errors[0]?.message || "Failed to add to cart")
  }

  return data.cartLinesAdd.cart
}

/**
 * Updates cart line quantity (cartId must be provided from actions layer)
 */
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {

  if (quantity <= 0) {
    return removeCartLine(cartId, lineId)
  }

  const query = `mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    handle
                    title
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
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyCartLinesUpdateResponse>(query, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })

  if (!data.cartLinesUpdate?.cart) {
    const errors = data.cartLinesUpdate?.userErrors || []
    throw new Error(errors[0]?.message || "Failed to update cart")
  }

  return data.cartLinesUpdate.cart
}

/**
 * Removes a line from cart using Shopify cartLinesRemove mutation
 * @param cartId - Cart ID from createCart() or cookie
 * @param lineId - Cart line ID to remove
 * @returns Updated cart object
 */
export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {

  const query = `mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    handle
                    title
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
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`

  const data = await fetchFromShopify<ShopifyCartLinesRemoveResponse>(query, {
    cartId,
    lineIds: [lineId],
  })

  if (!data.cartLinesRemove?.cart) {
    const errors = data.cartLinesRemove?.userErrors || []
    throw new Error(errors[0]?.message || "Failed to remove from cart")
  }

  return data.cartLinesRemove.cart
}

/**
 * Gets checkout URL for a cart (cartId must be provided from actions layer)
 */
export async function getCheckoutUrl(cartId: string): Promise<string | null> {
  const cart = await getCart(cartId)
  return cart?.checkoutUrl || null
}
