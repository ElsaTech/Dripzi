"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/components/auth/auth-provider"
import { useUser } from "@clerk/nextjs"
import { useClerk } from "@clerk/nextjs"
import Image from "next/image"

interface HeaderProps {
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    fullName?: string | null
    imageUrl?: string
  } | null
}

export function Header({ user: initialUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const { openLogin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isHome = pathname === "/"
  const [isAtTop, setIsAtTop] = useState(true)

  const user = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      }
    : initialUser

  const { scrollY } = useScroll()

  const headerBg = useTransform(
    scrollY,
    [0, 150],
    [isHome ? "rgba(0, 0, 0, 0.25)" : "rgba(250, 249, 246, 0.95)", "rgba(250, 249, 246, 0.98)"],
  )
  const borderOpacity = useTransform(scrollY, [0, 150], [0, 0.1])

  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) return
      setIsAtTop(window.scrollY < 80)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isHome])

  const primaryNavColor =
    isHome && isAtTop ? "text-white hover:text-white/70" : "text-foreground hover:text-foreground/60"

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)

      try {
        router.push("/")
        router.refresh()
      } catch (routerError) {
        window.location.href = "/"
      }
    } finally {
      setTimeout(() => {
        setIsSigningOut(false)
      }, 3000)
    }
  }

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
        }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isHome ? "backdrop-blur-xl supports-[backdrop-filter]:bg-black/20" : "backdrop-blur-sm"
        }`}
      >
        {isHome && isAtTop && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
        )}

        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute bottom-0 left-0 right-0 h-px bg-foreground/30"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            <Link
              href="/"
              className="relative h-8 w-24 sm:h-9 sm:w-28 md:h-10 md:w-32 flex-shrink-0 transition-opacity duration-500 hover:opacity-70 z-10"
            >
              <Image
                src={isAtTop && isHome ? "/images/image.png" : "/images/image_logo.png" || "/placeholder.svg"}
                alt="Dripzi Store"
                fill
                className="object-contain"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 flex-1 justify-center">
              <Link
                href="/shop"
                className={`luxury-subheading transition-all duration-500 relative group whitespace-nowrap text-sm tracking-wider ${primaryNavColor}`}
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-500 group-hover:w-full" />
              </Link>
              <Link
                href="/collections"
                className={`luxury-subheading transition-all duration-500 relative group whitespace-nowrap text-sm tracking-wider ${primaryNavColor}`}
              >
                Collections
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-500 group-hover:w-full" />
              </Link>
              <Link
                href="/about"
                className={`luxury-subheading transition-all duration-500 relative group whitespace-nowrap text-sm tracking-wider ${primaryNavColor}`}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-500 group-hover:w-full" />
              </Link>
              <Link
                href="/contact"
                className={`luxury-subheading transition-all duration-500 relative group whitespace-nowrap text-sm tracking-wider ${primaryNavColor}`}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-500 group-hover:w-full" />
              </Link>
            </nav>

            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 z-10">
              {/* Cart icon - always visible */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full hover:bg-transparent hover:opacity-60 transition-all duration-500 h-10 w-10 ${
                    isHome && isAtTop ? "text-white" : ""
                  }`}
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>

              {/* User menu or sign in - desktop only */}
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`hidden lg:flex rounded-full hover:bg-transparent hover:opacity-60 transition-all duration-500 h-10 w-10 ${
                        isHome && isAtTop ? "text-white" : ""
                      }`}
                      aria-label="User menu"
                    >
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.fullName || "User"}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-6 bg-background border border-foreground/10 shadow-xl">
                    <div className="space-y-6">
                      <div className="border-b border-foreground/10 pb-4">
                        <h3 className="font-serif text-2xl text-foreground tracking-tight">
                          {user.fullName || "Account"}
                        </h3>
                        <p className="text-sm text-foreground/60 font-light mt-1">{user.email}</p>
                      </div>

                      <div className="space-y-4 text-sm">
                        {user.firstName && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">First Name</p>
                            <p className="text-foreground">{user.firstName}</p>
                          </div>
                        )}
                        {user.lastName && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Last Name</p>
                            <p className="text-foreground">{user.lastName}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Email</p>
                          <p className="text-foreground">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="w-full border border-foreground/20 py-3 text-foreground text-sm uppercase tracking-widest transition-all duration-500 hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        {isSigningOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
                  onClick={openLogin}
                  className={`hidden lg:block luxury-subheading transition-all duration-500 relative group whitespace-nowrap text-sm tracking-wider ${
                    isHome && isAtTop ? "text-white hover:text-white/70" : "text-foreground hover:text-foreground/60"
                  }`}
                  aria-label="Sign in to your account"
                >
                  Sign In
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-500 group-hover:w-full" />
                </button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden rounded-full hover:bg-transparent hover:opacity-60 transition-all duration-500 h-10 w-10 ${
                  isHome && isAtTop ? "text-white" : ""
                }`}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-foreground/10 bg-background/98 backdrop-blur-xl lg:hidden shadow-lg"
          >
            <nav
              className="flex flex-col space-y-1 px-4 sm:px-6 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {!user && (
                <button
                  onClick={() => {
                    openLogin()
                    setIsMenuOpen(false)
                  }}
                  className="luxury-subheading text-foreground text-left py-4 px-2 border-b border-foreground/10 hover:text-foreground/60 transition-colors duration-500"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
              )}
              {user && (
                <div className="py-4 px-2 border-b border-foreground/10">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Signed in as</p>
                  <p className="text-sm text-foreground font-light">{user.email}</p>
                </div>
              )}
              <Link
                href="/shop"
                className="luxury-subheading text-foreground py-4 px-2 hover:text-foreground/60 transition-colors duration-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="luxury-subheading text-foreground py-4 px-2 hover:text-foreground/60 transition-colors duration-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="luxury-subheading text-foreground py-4 px-2 hover:text-foreground/60 transition-colors duration-500"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="luxury-subheading text-foreground py-4 px-2 hover:text-foreground/60 transition-colors duration-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {user && (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  disabled={isSigningOut}
                  className="luxury-subheading text-foreground text-left py-4 px-2 mt-2 border-t border-foreground/10 hover:text-foreground/60 transition-colors duration-500 disabled:opacity-50"
                >
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </motion.header>
    </>
  )
}
