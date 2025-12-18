import { NextResponse } from "next/server"
import { currentUser, clerkClient } from "@clerk/nextjs/server"

/**
 * Create password for OAuth-only users via server-side Clerk API
 * 
 * PRODUCTION-GRADE APPROACH:
 * - Uses Clerk's backend SDK (clerkClient) which has proper password management
 * - Bypasses client SDK issues with deprecated methods
 * - Server-side only - passwords never exposed to client
 * - Uses Clerk's official backend API endpoints
 */
export async function POST(request: Request) {
  try {
    // Get authenticated user from Clerk
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const { newPassword } = await request.json()

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Use Clerk's backend SDK to update password
    // Backend API allows setting password directly via updateUser
    // This bypasses frontend SDK limitations and deprecated methods
    try {
      const updatedUser = await clerkClient.users.updateUser(clerkUser.id, {
        password: newPassword,
        signOutOfOtherSessions: false, // Keep user signed in on other devices
      })

      // Verify password was actually set
      if (!updatedUser.passwordEnabled) {
        throw new Error("Password was not successfully enabled")
      }

      return NextResponse.json({ 
        success: true,
        message: "Password created successfully",
        passwordEnabled: updatedUser.passwordEnabled
      })
    } catch (clerkError: any) {
      console.error("Clerk password update error:", clerkError)
      
      // Handle specific Clerk errors
      const errorMessage = clerkError?.errors?.[0]?.message || clerkError?.message || "Failed to create password"
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: process.env.NODE_ENV === "development" ? clerkError : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("create-password API error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
