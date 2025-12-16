"use client"

import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from "@clerk/nextjs"

export { useUser, useClerkAuth as useAuth, useSignIn, useSignUp }

export type ClerkUser = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  imageUrl?: string
}

/**
 * Transform Clerk user to our User type
 */
export function transformClerkUser(clerkUser: any): ClerkUser | null {
  if (!clerkUser) return null

  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    fullName: clerkUser.fullName,
    imageUrl: clerkUser.imageUrl,
  }
}
