import { Header } from "@/components/layout/header"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getCurrentUser, validateAdmin } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { getProducts } from "@/lib/actions/products"

export default async function AdminPage() {
  const user = await getCurrentUser()
  const isAdmin = await validateAdmin()

  if (!user || !isAdmin) {
    redirect("/")
  }

  const products = await getProducts()
  // Orders are managed in Shopify Admin - no local order data available
  const orders: any[] = []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <AdminDashboard products={products} orders={orders} />
    </div>
  )
}
