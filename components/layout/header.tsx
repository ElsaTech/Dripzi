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

  const headerBg = useTransform(scrollY, [0, 150], ["rgba(250, 249, 246, 0)", "rgba(250, 249, 246, 0.95)"])
  const borderOpacity = useTransform(scrollY, [0, 150], [0, 0.15])

  useEffect(() => {
    // Keep a simple scroll listener to decide when we're past the hero region on home.
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
    // Prevent double execution - idempotent sign-out
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)
    
    try {
      // Clerk sign-out - this is the critical operation
      // Even if backend APIs fail, we must complete sign-out
      await signOut()
      
      // Always redirect and refresh, regardless of any backend failures
      // Sign-out must NEVER get stuck
      router.push("/")
      router.refresh()
    } catch (error) {
      // Log error but ALWAYS complete sign-out flow
      console.error("Sign out error:", error)
      
      // Even on error, complete the sign-out flow
      // User should be signed out from Clerk even if backend fails
      try {
        router.push("/")
        router.refresh()
      } catch (routerError) {
        // If router fails, force page reload as last resort
        window.location.href = "/"
      }
    } finally {
      // Always reset state after a timeout to prevent permanent stuck state
      // This is a safety net in case navigation doesn't happen
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
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-700 ${
          isHome ? "backdrop-blur-md" : ""
        }`}
      >
        {/* Subtle overlay on home hero to preserve readability without breaking the image */}
        {isHome && isAtTop && (
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-transparent" />
        )}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
        />

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative h-9 w-24 md:h-10 md:w-28 transition-opacity duration-700 hover:opacity-70"
            >
              <Image src="/images/image.png" alt="Dripzi Store" fill className="object-contain" />
            </Link>

            <nav className="hidden items-center gap-12 md:flex">
              <Link
                href="/shop"
                className={`luxury-subheading transition-all duration-700 relative group ${primaryNavColor}`}
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-700 group-hover:w-full" />
              </Link>
              <Link
                href="/collections"
                className={`luxury-subheading transition-all duration-700 relative group ${primaryNavColor}`}
              >
                Collections
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-700 group-hover:w-full" />
              </Link>
              <Link
                href="/about"
                className={`luxury-subheading transition-all duration-700 relative group ${primaryNavColor}`}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-700 group-hover:w-full" />
              </Link>
              <Link
                href="/contact"
                className={`luxury-subheading transition-all duration-700 relative group ${primaryNavColor}`}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-700 group-hover:w-full" />
              </Link>
            </nav>

            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`touch-target rounded-full hover:bg-transparent hover:opacity-60 transition-opacity duration-700 ${
                    isHome && isAtTop ? "text-white" : ""
                  }`}
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>

              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`touch-target rounded-full hover:bg-transparent hover:opacity-60 transition-opacity duration-700 ${
                        isHome && isAtTop ? "text-white" : ""
                      }`}
                      aria-label="User menu"
                    >
                      {user.imageUrl ? (
                        // Using next/image for better performance and layout stability
                        <Image
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.fullName || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-6 bg-background border border-foreground/10">
                    <div className="space-y-6">
                      {/* User Header */}
                      <div className="border-b border-foreground/10 pb-4">
                        <h3 className="font-serif text-2xl text-foreground tracking-tight">
                          {user.fullName || "Account"}
                        </h3>
                        <p className="text-sm text-foreground/60 font-light mt-1">{user.email}</p>
                      </div>

                      {/* User Info */}
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

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="w-full border border-foreground/20 py-3 text-foreground text-sm uppercase tracking-widest transition-all duration-700 hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className={`hidden md:block luxury-subheading transition-all duration-700 relative group ${
                    isHome && isAtTop
                      ? "text-white hover:text-white/70"
                      : "text-foreground hover:text-foreground/60"
                  }`}
                  aria-label="Sign in to your account"
                >
                  Sign In
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-700 group-hover:w-full" />
                </button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`touch-target rounded-full md:hidden hover:bg-transparent hover:opacity-60 transition-opacity duration-700 ${
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border/20 bg-background md:hidden"
          >
            <nav className="flex flex-col space-y-2 px-6 py-8" role="navigation" aria-label="Mobile navigation">
              <Link
                href="/shop"
                className="touch-target luxury-subheading text-foreground py-4 hover:text-foreground/60 transition-colors duration-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="touch-target luxury-subheading text-foreground py-4 hover:text-foreground/60 transition-colors duration-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="touch-target luxury-subheading text-foreground py-4 hover:text-foreground/60 transition-colors duration-700"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="touch-target luxury-subheading text-foreground py-4 hover:text-foreground/60 transition-colors duration-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!user && (
                <button
                  onClick={() => {
                    openLogin()
                    setIsMenuOpen(false)
                  }}
                  className="touch-target luxury-subheading text-foreground text-left py-4 mt-4 border-t border-border/20 hover:text-foreground/60 transition-colors duration-700"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </motion.header>
    </>
  )
}
