import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase"
import { createHash } from "crypto"

/**
 * Mark password prompt as completed and store password hash in Supabase
 * 
 * PRODUCTION-GRADE APPROACH:
 * - Stores password hash (SHA-256) in Supabase for authentication
 * - Marks prompt as completed so it doesn't reappear
 * - Allows password-based auth without relying on Clerk's broken API
 * - Password is hashed on client, then stored securely
 * 
 * SECURITY:
 * - Password is hashed on client before sending (SHA-256)
 * - Server stores hash only, never plaintext
 * - Can be used for custom password verification if needed
 */
export async function POST(request: Request) {
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

    // Parse request body
    const { passwordHash } = await request.json()

    if (!passwordHash || typeof passwordHash !== 'string') {
      return NextResponse.json(
        { success: false, error: "Password hash is required" },
        { status: 400 }
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

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || null
    const fullName = clerkUser.fullName || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()

    // Determine auth provider
    const hasGoogleOAuth = clerkUser.externalAccounts?.some(
      (account) => account.provider === "oauth_google"
    ) || false

    const authProvider = hasGoogleOAuth ? "google+password" : "password"

    // Prepare update data
    // Store password hash and mark prompt as completed
    const updateData: any = {
      clerk_id: clerkUser.id,
      email: primaryEmail,
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      name: fullName || null,
      has_password: true, // User has set a password (stored in our DB)
      auth_provider: authProvider,
      password_prompt_completed: true,
      password_hash: passwordHash, // SHA-256 hash of password
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
      console.error("Supabase update error:", {
        message: error.message,
        details: error.details,
        code: error.code,
      })
      
      // Check if password_hash column doesn't exist
      if (error.message?.includes("column") && error.message?.includes("password_hash")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Database schema needs password_hash column",
            details: process.env.NODE_ENV === "development" 
              ? "Add 'password_hash TEXT' column to users table"
              : undefined,
          },
          { status: 500 },
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to save password setup",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Password setup completed"
    })
  } catch (error: any) {
    console.error("mark-password-prompt-completed API error:", error)
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
