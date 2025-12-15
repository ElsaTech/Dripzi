"use server"

import { getCurrentUser } from "./auth"

/**
 * Admin utilities
 * Note: Product and order management is handled by Shopify Admin.
 * Products and orders should be managed through the Shopify admin panel.
 */

export async function checkAdmin() {
  const user = await getCurrentUser()
  if (!user || !user.is_admin) {
    throw new Error("Unauthorized access")
  }
  return user
}

// Product and order management functions removed - use Shopify Admin instead
// Products and orders are now managed through Shopify's admin interface
