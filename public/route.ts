import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase"

/**
 * Check if user has password stored in Supabase
 * 
 * This endpoint:
 * - Checks Supabase users table for has_password flag
 * - Returns the password status from database (source of truth)
 * - Used by frontend to determine if password setup banner should show
 */
export async function GET() {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      )
    }

    // Get authenticated user from Clerk
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Create Supabase client
    let supabase
    try {
      supabase = createClient()
    } catch (clientError: any) {
      console.error("Failed to create Supabase client:", clientError)
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 },
      )
    }

    // Check Supabase for user's password status
    const { data: dbUser, error: findError } = await supabase
      .from("users")
      .select("has_password, password_hash")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle()

    if (findError && !findError.message?.includes("does not exist")) {
      console.error("Supabase find error:", findError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to check password status",
          details: process.env.NODE_ENV === "development" ? findError.message : undefined
        },
        { status: 500 },
      )
    }

    // If user doesn't exist in Supabase, they don't have a password
    const hasPassword = dbUser?.has_password === true || false
    const hasPasswordHash = !!dbUser?.password_hash

    return NextResponse.json({ 
      success: true,
      hasPassword,
      hasPasswordHash,
    })
  } catch (error: any) {
    console.error("check-password-status API error:", error)
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
