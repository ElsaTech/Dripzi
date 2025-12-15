"use server"

import { supabase, type User } from "@/lib/supabase"
import { cookies } from "next/headers"

/**
 * Get current authenticated user from cookie + Supabase
 * Validates session and returns user data
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    const sessionToken = cookieStore.get("sessionToken")?.value

    if (!userId || !sessionToken) {
      return null
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error || !user) {
      // Clear invalid cookies
      cookieStore.delete("userId")
      cookieStore.delete("sessionToken")
      return null
    }

    return user
  } catch (error) {
    console.error('Auth validation failed:', error)
    return null
  }
}

/**
 * Logout user by clearing all session data
 */
export async function logout() {
  try {
    const cookieStore = await cookies()
    
    // Clear all auth-related cookies
    cookieStore.delete("userId")
    cookieStore.delete("sessionToken")
    cookieStore.delete("userRole")
    
    return { success: true }
  } catch (error) {
    console.error('Logout failed:', error)
    return { success: false, error: 'Logout failed' }
  }
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
 */
export async function validateAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user?.isAdmin === true
  } catch (error) {
    console.error('Admin validation failed:', error)
    return false
  }
}
