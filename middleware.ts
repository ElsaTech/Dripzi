import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

/**
 * Middleware for authentication and route protection
 * 
 * Architecture:
 * - Clerk handles all authentication (sign-in, sign-up, OAuth, sessions)
 * - Supabase is used only for user metadata storage (not authentication)
 * - Protected routes are enforced by Clerk's auth.protect()
 * 
 * Protected routes:
 * - /checkout - Requires authentication
 * - /admin - Requires authentication (admin check happens in page component)
 * - /profile - Requires authentication
 */
const isProtectedRoute = createRouteMatcher(["/checkout(.*)", "/admin(.*)", "/profile(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Clerk handles route protection - this is the source of truth for auth
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Create Supabase client for metadata access (not auth)
  // This is used for reading user data from Supabase, not for authentication
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Note: We don't check Supabase auth here because Clerk is the auth provider
  // Clerk's auth.protect() above handles all authentication checks
  // Supabase is only used for user metadata storage

  return supabaseResponse
})

export const config = {
  matcher: [
    // Match all application routes (including the homepage), but skip Next.js internals and static assets.
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
