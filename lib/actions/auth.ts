"use server"

import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase"
import type { User } from "@/lib/supabase"

/**
 * Get current authenticated user from Clerk + Supabase metadata
 * 
 * This function:
 * - Uses Clerk as the source of truth for authentication
 * - Fetches user metadata from Supabase (which is synced via sync-user API)
 * - Returns null if user is not authenticated in Clerk
 * 
 * IMPORTANT: This is the server-side equivalent of useAuthState hook
 * Use this in Server Components, Server Actions, and API routes
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get authenticated user from Clerk (source of truth)
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    // Fetch user metadata from Supabase
    // Supabase stores additional user data but Clerk handles authentication
    // Query by clerk_id since id is UUID (auto-generated)
    const supabase = createClient()
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle()

    if (error || !user) {
      // User exists in Clerk but not in Supabase - sync it
      // This can happen if sync-user hasn't run yet
      // We'll return a minimal user object based on Clerk data
      return {
        id: undefined, // UUID is auto-generated, not Clerk ID
        phone_number: clerkUser.phoneNumbers?.[0]?.phoneNumber || "", // Required field
        email: clerkUser.emailAddresses?.[0]?.emailAddress || undefined,
        first_name: clerkUser.firstName || null,
        last_name: clerkUser.lastName || null,
        name: clerkUser.fullName || undefined,
        is_admin: false,
      } as User
    }

    return user
  } catch (error) {
    console.error('Auth validation failed:', error)
    return null
  }
}

/**
 * Logout user
 * 
 * NOTE: This function is deprecated - sign-out is handled client-side via Clerk
 * Clerk manages sessions, so server-side logout is not needed
 * This is kept for backwards compatibility but does nothing
 * 
 * @deprecated Use Clerk's signOut() method in client components instead
 */
export async function logout() {
  // Clerk handles logout client-side
  // This function is kept for backwards compatibility
  return { success: true }
}

/**
 * Update user profile with authentication validation
 */
export async function updateProfile(name: string, email?: string) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        email: email?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      throw new Error("Failed to update profile")
    }

    return { success: true }
  } catch (error) {
    console.error('Profile update failed:', error)
    throw error
  }
}

/**
 * Validate admin access
 * 
 * Checks if the current Clerk user has admin privileges in Supabase
 */
export async function validateAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user?.is_admin === true
  } catch (error) {
    console.error('Admin validation failed:', error)
    return false
  }
}
