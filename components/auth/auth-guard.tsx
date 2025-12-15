"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { LoadingScreen } from "@/components/interactive/loading-screen"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: AuthGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (requireAuth && !currentUser) {
          router.push('/?login=true')
          return
        }

        if (requireAdmin && (!currentUser || !currentUser.isAdmin)) {
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (requireAuth || requireAdmin) {
          router.push('/')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [requireAuth, requireAdmin, router])

  if (loading) {
    return <LoadingScreen isLoading={true} />
  }

  if (requireAuth && !user) {
    return null
  }

  if (requireAdmin && (!user || !user.isAdmin)) {
    return null
  }

  return <>{children}</>
}