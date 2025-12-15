"use client"

/**
 * Orders table - read-only view.
 * Orders must be managed through Shopify Admin panel.
 */

interface OrdersTableProps {
  orders: any[]
}

export function OrdersTable({ orders }: OrdersTableProps) {

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Order ID</th>
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Customer</th>
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Items</th>
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Total</th>
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Status</th>
            <th className="pb-4 text-left text-sm font-bold text-gray-600">Date</th>
            <th className="pb-4 text-right text-sm font-bold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-gray-100">
              <td className="py-4">
                <p className="font-mono text-sm font-semibold text-black">{order._id.slice(-8)}</p>
              </td>
              <td className="py-4">
                <div>
                  <p className="font-semibold text-black">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.phoneNumber}</p>
                </div>
              </td>
              <td className="py-4">
                <p className="font-semibold text-black">{order.items.length} items</p>
              </td>
              <td className="py-4">
                <p className="font-semibold text-black">${order.total.toFixed(2)}</p>
              </td>
              <td className="py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-4">
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
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
  )
}
