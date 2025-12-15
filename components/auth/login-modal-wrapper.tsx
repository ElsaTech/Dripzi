"use client"

import { Suspense } from "react"
import { LoginModal } from "./login-modal"

interface LoginModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function LoginModalWrapper(props: LoginModalWrapperProps) {
  return (
    <Suspense fallback={null}>
      <LoginModal {...props} />
    </Suspense>
  )
}
