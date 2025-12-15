import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { getCurrentUser } from "@/lib/actions/auth"
import { getProducts } from "@/lib/actions/products"

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const user = await getCurrentUser()
  const products = await getProducts(category)

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">{categoryName}</h1>
          <p className="text-lg text-gray-600">Explore our curated {categoryName.toLowerCase()} collection</p>
        </div>

        <ProductFilters />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-600">No products found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
