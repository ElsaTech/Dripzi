import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase"

/**
 * Sync Clerk user to Supabase
 * 
 * This endpoint:
 * - Creates or updates a Supabase user record based on Clerk user data
 * - Called automatically after OAuth sign-up/sign-in, password setup, and auth state changes
 * - Determines auth_provider based on Clerk user state (passwordEnabled, OAuth connections)
 * - IDEMPOTENT: Safe to call multiple times with the same user data
 * - PRODUCTION-SAFE: Never crashes, always returns JSON, handles all errors gracefully
 * 
 * IMPORTANT:
 * - Ensure your Supabase "users" table has the expected columns:
 *   - id (text or UUID) mapped to Clerk user ID
 *   - email (text, nullable)
 *   - first_name, last_name, name (nullable text)
 *   - has_password (boolean, default false)
 *   - auth_provider (text, e.g. 'google' | 'password' | 'google+password')
 *   - password_prompt_completed (boolean, default false)
 *   - is_admin (boolean, default false)
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
    const hasCompletedPasswordPrompt =
      (clerkUser.publicMetadata as any)?.hasCompletedPasswordSetupPrompt === true

    // Determine auth provider based on Clerk user state
    // This is the source of truth - Clerk determines what auth methods are available
    const hasPassword = clerkUser.passwordEnabled || false
    const hasGoogleOAuth = clerkUser.externalAccounts?.some(
      (account) => account.provider === "oauth_google"
    ) || false

    // Determine auth provider string
    let authProvider = "password" // default fallback
    if (hasGoogleOAuth && hasPassword) {
      authProvider = "google+password"
    } else if (hasGoogleOAuth) {
      authProvider = "google"
    } else if (hasPassword) {
      authProvider = "password"
    }

    // Prepare user data for Supabase public.users table
    // We use clerk_id as the link to Clerk users since id is UUID (auto-generated)
    const userData: any = {
      clerk_id: clerkUser.id, // Link to Clerk user
      email: primaryEmail,
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      name: fullName || null,
      has_password: hasPassword,
      auth_provider: authProvider,
      password_prompt_completed: hasCompletedPasswordPrompt,
      phone_number: clerkUser.phoneNumbers?.[0]?.phoneNumber || primaryEmail || "", // Required field
      is_admin: false, // Default, can be updated manually
    }

    // First, check if user exists by clerk_id
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id, clerk_id")
      .eq("clerk_id", clerkUser.id)
      .maybeSingle()

    if (findError && !findError.message?.includes("does not exist")) {
      // Log unexpected find errors (but "does not exist" is OK - means table doesn't exist yet)
      console.error("Supabase find error:", findError)
    }

    let error: any = null

    if (existingUser) {
      // User exists - update by UUID id
      const { error: updateError } = await supabase
        .from("users")
        .update(userData)
        .eq("id", existingUser.id)

      error = updateError
      
      if (error) {
        console.error("Supabase sync error (update):", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          clerkUserId: clerkUser.id,
        })
      }
    } else {
      // User doesn't exist - insert new record
      // Let Supabase generate UUID for id, use clerk_id for linking
      const { error: insertError } = await supabase
        .from("users")
        .insert(userData)

      error = insertError
      
      if (error) {
        console.error("Supabase sync error (insert):", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          clerkUserId: clerkUser.id,
        })
      }
    }

    // Handle errors
    if (error) {
      const errorMessage = error.message || "Unknown database error"
      const errorCode = error.code || "UNKNOWN"

      // Check if table doesn't exist - provide helpful error message
      if (errorMessage.includes("does not exist") || errorCode === "42P01") {
        console.error("Table 'users' does not exist in public schema")
        return NextResponse.json(
          { 
            success: false, 
            error: "Database table not found",
            details: process.env.NODE_ENV === "development" 
              ? "The 'public.users' table does not exist. Please create it with the required columns (see SQL migration below)."
              : undefined,
            migration: process.env.NODE_ENV === "development" ? `
-- Run this SQL in your Supabase SQL Editor to create the users table:

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  phone_number TEXT NOT NULL DEFAULT '',
  has_password BOOLEAN DEFAULT false,
  auth_provider TEXT DEFAULT 'password',
  password_prompt_completed BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
` : undefined,
          },
          { status: 500 },
        )
      }

      // Check for missing column errors
      if (errorMessage.includes("column") && errorMessage.includes("does not exist")) {
        console.error("Missing column in Supabase schema:", errorMessage)
        return NextResponse.json(
          { 
            success: false, 
            error: "Database schema mismatch - missing required columns",
            details: process.env.NODE_ENV === "development" 
              ? `Missing column: ${errorMessage}. Required columns: clerk_id, email, first_name, last_name, name, phone_number, has_password, auth_provider, password_prompt_completed, is_admin`
              : undefined,
          },
          { status: 500 },
        )
      }

      // Generic error handling
      console.error("Supabase sync error:", {
        message: errorMessage,
        code: errorCode,
        details: error.details,
        hint: error.hint,
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to sync user to Supabase",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Catch all unexpected errors
    console.error("sync-user unexpected error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}
