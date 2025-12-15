import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartClient } from "@/components/cart/cart-client"
import { getCurrentUser } from "@/lib/actions/auth"
import { getCart } from "@/lib/actions/cart"

export default async function CartPage() {
  // Authentication is optional for cart - guests can checkout
  const user = await getCurrentUser()

  const cart = await getCart()

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <CartClient cart={cart} />
      <Footer />
    </div>
  )
}
