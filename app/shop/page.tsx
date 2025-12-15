import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { getProducts } from "@/lib/actions/products"

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 font-serif text-5xl font-bold text-black md:text-6xl">Shop All</h1>
          <p className="text-lg text-gray-600">Discover our complete collection of premium fashion pieces</p>
        </div>

        <ProductFilters />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-600">No products found. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  )
}
