'use client'

import { usePathname } from 'next/navigation'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'product' | 'breadcrumb'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const pathname = usePathname()

  const getStructuredData = () => {
    const baseUrl = 'https://dripzi.store'
    
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Dripzi Store',
          url: baseUrl,
          description: 'Premium fashion e-commerce platform with luxury clothing and modern shopping experience',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/shop?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          sameAs: [
            'https://instagram.com/dripzistore',
            'https://twitter.com/dripzistore',
            'https://facebook.com/dripzistore'
          ]
        }

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Dripzi Store',
          url: baseUrl,
          logo: `${baseUrl}/images/image.png`,
          description: 'Premium fashion retailer specializing in luxury coats, blazers, shirts, and sweatshirts',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-DRIPZI',
            contactType: 'customer service',
            availableLanguage: 'English'
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US'
          },
          sameAs: [
            'https://instagram.com/dripzistore',
            'https://twitter.com/dripzistore'
          ]
        }

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.images?.map((img: string) => `${baseUrl}${img}`) || [],
          brand: {
            '@type': 'Brand',
            name: 'Dripzi Store'
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Dripzi Store'
            }
          },
          aggregateRating: data.rating && {
            '@type': 'AggregateRating',
            ratingValue: data.rating.average,
            reviewCount: data.rating.count
          }
        }

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`
          })) || []
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
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}