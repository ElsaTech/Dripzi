import { storefrontFetch } from "@/lib/shopify"

export async function GET() {
  try {
    const query = `{
      shop {
        name
        description
      }
    }`

    const result = await storefrontFetch({ query })

    return Response.json({
      success: true,
      shop: result.data?.shop || null,
      message: "Storefront API client is working!",
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      {
        success: false,
        error: errorMessage,
        message: "Failed to connect to Shopify Storefront API",
      },
      { status: 500 }
    )
  }
}
