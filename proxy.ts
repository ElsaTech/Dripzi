import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/checkout', '/admin', '/profile']
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !userId) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('login', 'true')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/admin/:path*',
    '/profile/:path*'
  ]
}