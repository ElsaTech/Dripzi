import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase"

/**
 * Mark the current user's Supabase profile as having a password.
 *
 * This endpoint:
 * - Trusts Clerk as the source of truth for authentication
 * - Uses Clerk's currentUser to resolve the app user
 * - Updates/creates a Supabase user record with password state
 * - PRODUCTION-SAFE: Never crashes, always returns JSON, handles all errors gracefully
 *
 * IMPORTANT:
 * - This route never receives or stores raw passwords.
 * - Ensure your Supabase "users" table has the expected columns before deploying:
 *   - id (text or UUID) mapped to Clerk user ID, OR clerk_id (text) column
 *   - email (text, nullable)
 *   - first_name, last_name, name (nullable text)
 *   - has_password (boolean, default false)
 *   - auth_provider (text, e.g. 'google' | 'password' | 'google+password')
 *   - password_prompt_completed (boolean, default false)
 */
export async function POST() {
  try {
    // Validate environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      )
    }

    // Get authenticated user from Clerk (source of truth)
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Create Supabase client with error handling
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

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || null
    const fullName = clerkUser.fullName || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()

    // Determine auth provider - check if user has Google OAuth
    const hasGoogleOAuth = clerkUser.externalAccounts?.some(
      (account) => account.provider === "oauth_google"
    ) || false

    const authProvider = hasGoogleOAuth ? "google+password" : "password"

    // Prepare update data
    const updateData: any = {
      clerk_id: clerkUser.id,
      email: primaryEmail,
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      name: fullName || null,
      has_password: true,
      auth_provider: authProvider,
      password_prompt_completed: true,
      phone_number: clerkUser.phoneNumbers?.[0]?.phoneNumber || primaryEmail || "",
    }

    // Find user by clerk_id
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle()

    let error: any = null

    if (existingUser) {
      // User exists - update by UUID id
      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", existingUser.id)

      error = updateError
    } else {
      // User doesn't exist - insert new record
      const { error: insertError } = await supabase
        .from("users")
        .insert(updateData)

      error = insertError
    }

    if (error) {
      console.error("Supabase sync error (mark-password-enabled):", {
        message: error.message,
        details: error.details,
        code: error.code,
      })
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to sync password state to Supabase",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Catch all unexpected errors
    console.error("mark-password-enabled unexpected error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}


