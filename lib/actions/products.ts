"use server"

import { getProducts as getShopifyProducts, getProductByHandle, getProductById as getShopifyProductById, searchProducts as searchShopifyProducts, type Product } from "@/lib/products"

/**
 * Get products with optional category and featured filters
 */
export async function getProducts(category?: string, featured?: boolean): Promise<Product[]> {
  return getShopifyProducts(category, featured)
}

/**
 * Get product by slug (handle in Shopify)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getProductByHandle(slug)
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  return getShopifyProductById(id)
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  return searchShopifyProducts(query)
}
