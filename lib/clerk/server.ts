"use server"

import { currentUser } from "@clerk/nextjs/server"

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  imageUrl?: string
}

/**
 * Get current authenticated user from Clerk
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      imageUrl: user.imageUrl,
    }
  } catch (error) {
    console.error("Auth validation failed:", error)
    return null
  }
}
