import { getCart, getCheckoutUrl } from "@/lib/actions/cart"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

/**
 * Checkout page - requires authentication
 * Redirects to Shopify hosted checkout for authenticated users
 */
export default async function CheckoutPage() {
  // Verify user authentication
  const user = await getCurrentUser()
  if (!user) {
    redirect("/?login=true")
  }

  // Verify cart exists and has items
  const cart = await getCart()
  if (!cart || cart.items.length === 0) {
    redirect("/cart")
  }

  // Get Shopify checkout URL from cart and redirect
  // This URL leads to Shopify's hosted checkout where payment is processed
  // Authentication is NOT passed to Shopify - users can checkout as guests
  const checkoutUrl = await getCheckoutUrl()
  if (checkoutUrl) {
    redirect(checkoutUrl)
  }

  // Fallback: redirect back to cart if checkout URL unavailable
  redirect("/cart")
}
