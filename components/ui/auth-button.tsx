"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SmoothButton } from "./smooth-button"

interface AuthButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  requireAuth?: boolean
}

export function AuthButton({ 
  children, 
  onClick, 
  className,
  variant = "primary",
  requireAuth = true 
}: AuthButtonProps) {
  const { requireAuth: showLogin } = useAuth()

  const handleClick = () => {
    if (requireAuth) {
      showLogin(onClick)
    } else {
      onClick()
    }
  }

  return (
    <SmoothButton 
      onClick={handleClick}
      className={className}
      variant={variant}
    >
      {children}
    </SmoothButton>
  )
}
