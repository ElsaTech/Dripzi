import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

/**
 * Verify phone number from Phone.Email widget
 *
 * Flow:
 * 1. Client sends user_json_url from Phone.Email widget
 * 2. Server fetches verified phone number from user_json_url
 * 3. Creates/finds user in Supabase
 * 4. Sets userId HTTP-only cookie
 * 5. Returns success + redirect URL
 *
 * Security:
 * - Phone verification is done by Phone.Email service
 * - Backend validates response integrity
 * - HTTP-only cookie prevents client-side token access
 */

export async function POST(request: NextRequest) {
  try {
    const { user_json_url, returnTo } = await request.json()

    if (!user_json_url) {
      return NextResponse.json(
        { success: false, error: "Missing user_json_url" },
        { status: 400 }
      )
    }

    // Fetch verified phone data from Phone.Email service
    const response = await fetch(user_json_url)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to verify phone number" },
        { status: 400 }
      )
    }

    const userData = await response.json()
    
    // Log all returned fields for debugging
    console.log("Phone.Email Response:", userData)
    console.log("User First Name:", userData.user_first_name)
    console.log("User Last Name:", userData.user_last_name)
    
    // Extract phone number from Phone.Email response
    // Phone.Email returns: user_country_code, user_phone_number, user_first_name, user_last_name
    const phoneNumber = userData.user_phone_number || userData.phone_number || userData.phone
    const firstName = userData.user_first_name || ""
    const lastName = userData.user_last_name || ""
    const countryCode = userData.user_country_code || ""

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "No phone number found in verification" },
        { status: 400 }
      )
    }

    // Format full phone with country code for storage
    const fullPhoneNumber = countryCode ? `${countryCode}${phoneNumber}` : phoneNumber

    // Find or create user in Supabase
    const supabase = createClient()
    let { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", fullPhoneNumber)
      .maybeSingle()

    // User doesn't exist, create new
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          phone_number: fullPhoneNumber,
          first_name: firstName || null,
          last_name: lastName || null,
          name: `${firstName} ${lastName}`.trim() || null,
          is_admin: false,
        })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create user:", createError)
        return NextResponse.json(
          { success: false, error: "Failed to create user" },
          { status: 500 }
        )
      }

      user = newUser
    } else if (findError) {
      console.error("Database error:", findError)
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      )
    }

    // Set authentication cookies
    const cookieStore = await cookies()
    const sessionToken = crypto.randomUUID()
    
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
    
    cookieStore.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
    
    cookieStore.set("userRole", user.is_admin ? "admin" : "user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    // Determine redirect URL
    const redirectUrl = returnTo || "/shop"

    return NextResponse.json({
      success: true,
      user,
      redirectUrl,
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
