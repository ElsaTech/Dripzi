"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/components/auth/auth-provider"
import { useUser } from "@/components/auth/user-provider"
import Image from "next/image"
import { logout } from "@/lib/actions/auth"

interface HeaderProps {
  user?: any
}

export function Header({ user: serverUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openLogin } = useAuth()
  const { user, refreshUser } = useUser()
  const router = useRouter()
  
  // Use client-side user state if available, fallback to server user
  const currentUser = user || serverUser
  const { scrollY } = useScroll()
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"])
  const headerShadow = useTransform(scrollY, [0, 100], ["0px 0px 0px rgba(0,0,0,0)", "0px 8px 24px rgba(0,0,0,0.08)"])

  const handleLogout = async () => {
    await logout()
    await refreshUser() // Update user state
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          boxShadow: headerShadow,
        }}
        className="fixed left-0 right-0 top-0 z-40 border-b border-gray-200/20 backdrop-blur-lg transition-all duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="relative h-12 w-32">
              <Image src="/images/image.png" alt="Dripzi Store" fill className="object-contain" />
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link href="/shop" className="text-sm font-semibold text-black transition-colors hover:text-gray-600">
                SHOP
              </Link>
              <Link
                href="/collections"
                className="text-sm font-semibold text-black transition-colors hover:text-gray-600"
              >
                COLLECTIONS
              </Link>
              <Link href="/about" className="text-sm font-semibold text-black transition-colors hover:text-gray-600">
                ABOUT
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-black transition-colors hover:text-gray-600">
                CONTACT
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="touch-target rounded-full"
                  style={{
                    boxShadow: "5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff",
                  }}
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>

              {currentUser ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="touch-target rounded-full"
                      style={{
                        boxShadow: "5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff",
                      }}
                      aria-label="User menu"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      {/* User Header */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold text-black">
                          {currentUser.first_name && currentUser.last_name
                            ? `${currentUser.first_name} ${currentUser.last_name}`
                            : currentUser.name || "User"}
                        </h3>
                        <p className="text-sm text-gray-600">{currentUser.phone_number}</p>
                      </div>

                      {/* User Info */}
                      <div className="space-y-3 text-sm">
                        {currentUser.first_name && (
                          <div>
                            <p className="text-gray-500">First Name</p>
                            <p className="text-black font-medium">{currentUser.first_name}</p>
                          </div>
                        )}
                        {currentUser.last_name && (
                          <div>
                            <p className="text-gray-500">Last Name</p>
                            <p className="text-black font-medium">{currentUser.last_name}</p>
                          </div>
                        )}
                        {currentUser.email && (
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="text-black font-medium">{currentUser.email}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="text-black font-medium">{currentUser.phone_number}</p>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <Button
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  onClick={openLogin}
                  className="hidden touch-target rounded-full bg-black px-6 py-2 text-sm font-extrabold text-white md:block"
                  style={{
                    boxShadow: "5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff",
                  }}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target rounded-full md:hidden"
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
            className="border-t border-gray-200 bg-white md:hidden"
          >
            <nav className="flex flex-col space-y-4 px-4 py-6" role="navigation" aria-label="Mobile navigation">
              <Link href="/shop" className="touch-target text-base font-semibold text-black py-3" onClick={() => setIsMenuOpen(false)}>
                SHOP
              </Link>
              <Link href="/collections" className="touch-target text-base font-semibold text-black py-3" onClick={() => setIsMenuOpen(false)}>
                COLLECTIONS
              </Link>
              <Link href="/about" className="touch-target text-base font-semibold text-black py-3" onClick={() => setIsMenuOpen(false)}>
                ABOUT
              </Link>
              <Link href="/contact" className="touch-target text-base font-semibold text-black py-3" onClick={() => setIsMenuOpen(false)}>
                CONTACT
              </Link>
              {!currentUser && (
                <Button
                  onClick={() => {
                    openLogin()
                    setIsMenuOpen(false)
                  }}
                  className="touch-target rounded-full bg-black text-white mt-4"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </motion.header>


    </>
  )
}
