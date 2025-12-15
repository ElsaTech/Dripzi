import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Order confirmation page.
 * Note: With Shopify hosted checkout, order confirmation happens on Shopify's checkout page.
 * This page is a fallback for any direct access.
 */
export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-600" />
          <h1 className="mb-4 font-serif text-4xl font-bold text-black">Order Placed Successfully</h1>
          <p className="mb-8 text-lg text-gray-600">
            Your order confirmation and details are available in your Shopify checkout confirmation email.
          </p>
          <p className="mb-8 text-sm text-gray-500">
            Order ID: {orderId}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="rounded-full bg-black px-8 py-6 text-white">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
