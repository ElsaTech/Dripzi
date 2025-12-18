"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "New Arrival",
    slug: "new-arrival",
    description: "Latest drops",
    image: "/editorial-fashion-photography-new-collection-luxur.jpg",
  },
  {
    name: "Regular",
    slug: "regular",
    description: "Classic fits",
    image: "/luxury-tailored-fashion-classic-menswear-editorial.jpg",
  },
  {
    name: "Oversized",
    slug: "oversized",
    description: "Statement pieces",
    image: "/oversized-fashion-editorial-luxury-streetwear-cont.jpg",
  },
]

export function EditorialCollections() {
  return (
    <section className="bg-[#f5f1ed] py-0">
      <div className="hidden lg:block">
        <div className="flex">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[60%] h-[70vh] lg:h-[85vh]"
          >
            <Link href={`/collections/${collections[0].slug}`} className="group block h-full relative overflow-hidden">
              <Image
                src={collections[0].image || "/placeholder.svg"}
                alt={collections[0].name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
                <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 lg:mb-3 font-light">
                  {collections[0].description}
                </p>
                <h3 className="text-[3rem] lg:text-[5rem] leading-[0.9] text-white font-serif mb-4 lg:mb-6">
                  {collections[0].name}
                </h3>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <span className="text-sm tracking-[0.2em] uppercase text-white/70">View Collection</span>
                  <span className="text-white/50">→</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden lg:flex w-[40%] items-center justify-center p-12 xl:p-20 bg-[#e8e3dc]"
          >
            <div className="max-w-md">
              <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-6 lg:mb-8 font-light">
                Collections
              </p>
              <h2 className="text-[2.5rem] xl:text-[3rem] leading-[1.1] text-foreground font-serif mb-6 lg:mb-8">
                Designed to
                <br />
                Stand Apart
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-8 lg:mb-12 text-sm xl:text-base">
                Each piece reflects our commitment to timeless design, exceptional materials, and the quiet confidence
                of understated luxury.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors duration-700 group"
              >
                <span className="text-xs tracking-[0.2em] uppercase">View All</span>
                <span className="transform group-hover:translate-x-2 transition-transform duration-700">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="flex">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[55%] h-[60vh] lg:h-[70vh]"
          >
            <Link href={`/collections/${collections[1].slug}`} className="group block h-full relative overflow-hidden">
              <Image
                src={collections[1].image || "/placeholder.svg"}
                alt={collections[1].name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-14">
                <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 lg:mb-3 font-light">
                  {collections[1].description}
                </p>
                <h3 className="text-[3rem] lg:text-[4rem] leading-[0.9] text-white font-serif mb-4 lg:mb-6">
                  {collections[1].name}
                </h3>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <span className="text-sm tracking-[0.2em] uppercase text-white/70">View Collection</span>
                  <span className="text-white/50">→</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden lg:block w-[45%] h-[70vh]"
          >
            <Link href={`/collections/${collections[2].slug}`} className="group block h-full relative overflow-hidden">
              <Image
                src={collections[2].image || "/placeholder.svg"}
                alt={collections[2].name}
                fill
                sizes="45vw"
                className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-14">
                <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 lg:mb-3 font-light">
                  {collections[2].description}
                </p>
                <h3 className="text-[3rem] lg:text-[4rem] leading-[0.9] text-white font-serif mb-4 lg:mb-6">
                  {collections[2].name}
                </h3>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <span className="text-sm tracking-[0.2em] uppercase text-white/70">View Collection</span>
                  <span className="text-white/50">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="block lg:hidden">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative h-[75vh] sm:h-[80vh] md:h-[85vh]"
          >
            <Link href={`/collections/${collection.slug}`} className="group block h-full">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover transition-all duration-[2500ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 sm:mb-3 font-light">
                    {collection.description}
                  </p>
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[5rem] leading-[0.9] text-white font-serif mb-3 sm:mb-4">
                    {collection.name}
                  </h3>
                  <div className="flex items-center gap-3 text-white/70">
                    <span className="text-xs sm:text-sm tracking-[0.2em] uppercase">View Collection</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        <div className="bg-[#e8e3dc] p-8 sm:p-12 md:p-16 min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-4 sm:mb-6 font-light">Collections</p>
            <h2 className="text-[2.5rem] sm:text-[3rem] leading-[1.1] text-foreground font-serif mb-4 sm:mb-6">
              Designed to
              <br />
              Stand Apart
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">
              Each piece reflects our commitment to timeless design, exceptional materials, and the quiet confidence of
              understated luxury.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors duration-700 group"
            >
              <span className="text-xs tracking-[0.2em] uppercase">View All</span>
              <span className="transform group-hover:translate-x-2 transition-transform duration-700">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
