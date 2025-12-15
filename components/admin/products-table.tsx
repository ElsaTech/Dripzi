"use client"

import Image from "next/image"

interface ProductsTableProps {
  products: any[]
}

/**
 * Products table - read-only view of Shopify products.
 * Products must be managed through Shopify Admin panel.
 */
export function ProductsTable({ products }: ProductsTableProps) {

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-4 text-left text-sm font-bold text-gray-600">Product</th>
              <th className="pb-4 text-left text-sm font-bold text-gray-600">Category</th>
              <th className="pb-4 text-left text-sm font-bold text-gray-600">Price</th>
              <th className="pb-4 text-left text-sm font-bold text-gray-600">Stock</th>
              <th className="pb-4 text-left text-sm font-bold text-gray-600">Status</th>
              <th className="pb-4 text-right text-sm font-bold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id || product._id} className="border-b border-gray-100">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-black">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-800">
                    {product.category}
                  </span>
                </td>
                <td className="py-4">
                  <div>
                    <p className="font-semibold text-black">${product.price.toFixed(2)}</p>
                    {product.salePrice && <p className="text-sm text-gray-600">${product.salePrice.toFixed(2)}</p>}
                  </div>
                </td>
                <td className="py-4">
                  <p className={`font-semibold ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock}
                  </p>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                      product.featured ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.featured ? "Featured" : "Regular"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="text-right text-sm text-gray-500">
                    Manage in Shopify Admin
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
