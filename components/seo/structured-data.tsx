"use client"

import { usePathname } from "next/navigation"

interface StructuredDataProps {
  type: "website" | "organization" | "product" | "breadcrumb" | "collection"
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const pathname = usePathname()

  const getStructuredData = () => {
    const baseUrl = "https://dripzi.store"

    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Dripzi Store",
          url: baseUrl,
          description:
            "Dripzi Store is a premium fashion e-commerce platform specializing in streetwear and luxury clothing. We offer oversized silhouettes, regular fits, and designed collections for men, women, and unisex fashion. Shop designer coats, blazers, shirts, and sweatshirts with modern, fashion-forward styles.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/shop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
          sameAs: [
            "https://instagram.com/dripzistore",
            "https://twitter.com/dripzistore",
            "https://facebook.com/dripzistore",
          ],
        }

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Dripzi Store",
          alternateName: "Dripzi",
          url: baseUrl,
          logo: `${baseUrl}/images/image.png`,
          description:
            "Dripzi Store is a premium streetwear and luxury fashion brand offering contemporary clothing for the modern individual. We specialize in oversized, regular, and designed collections with a focus on quality materials and timeless design. Our product range includes designer coats, blazers, shirts, and sweatshirts for men, women, and unisex styles.",
          slogan: "Fashion With No Rules",
          foundingDate: "2024",
          areaServed: "Worldwide",
          priceRange: "$$-$$$",
          category: "Premium Fashion & Streetwear",
          brand: {
            "@type": "Brand",
            name: "Dripzi Store",
            logo: `${baseUrl}/images/image.png`,
            slogan: "Fashion With No Rules",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-555-DRIPZI",
            contactType: "customer service",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
          },
          sameAs: ["https://instagram.com/dripzistore", "https://twitter.com/dripzistore"],
          keywords:
            "premium streetwear, luxury fashion, oversized clothing, designer coats, blazers, modern fashion, unisex fashion",
        }

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: data.name,
          description: data.description,
          image: data.images?.map((img: string) => `${baseUrl}${img}`) || [],
          brand: {
            "@type": "Brand",
            name: "Dripzi Store",
          },
          category: data.category,
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: "USD",
            availability: data.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${baseUrl}/product/${data.slug}`,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            itemCondition: "https://schema.org/NewCondition",
            seller: {
              "@type": "Organization",
              name: "Dripzi Store",
            },
          },
          aggregateRating: data.rating && {
            "@type": "AggregateRating",
            ratingValue: data.rating.average,
            reviewCount: data.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }

      case "collection":
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: data.name,
          description: data.description,
          url: `${baseUrl}${pathname}`,
          isPartOf: {
            "@type": "WebSite",
            name: "Dripzi Store",
            url: baseUrl,
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Collections",
                item: `${baseUrl}/collections`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: data.name,
                item: `${baseUrl}${pathname}`,
              },
            ],
          },
        }

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement:
            data.items?.map((item: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `${baseUrl}${item.url}`,
            })) || [],
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
