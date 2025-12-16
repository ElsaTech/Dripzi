import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

/**
 * Phone.Email Success Callback Handler
 *
 * This endpoint receives the redirect from Phone.Email widget after successful phone verification.
 * Phone.Email redirects here with user_json_url as a query parameter.
 *
 * Flow:
 * 1. Phone.Email verifies phone number
 * 2. Redirects to /api/auth/phone-success?user_json_url=...&returnTo=...
 * 3. Backend fetches verified phone data from user_json_url
 * 4. Creates/finds user in Supabase
 * 5. Sets HTTP-only cookie for session
 * 6. Redirects to final destination (returnTo or /shop)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_json_url = searchParams.get("user_json_url")
    const returnTo = searchParams.get("returnTo") || "/shop"

    if (!user_json_url) {
      // No user_json_url provided, redirect to login
      return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
    }

    // Fetch verified phone data from Phone.Email service
    const response = await fetch(user_json_url)

    if (!response.ok) {
      return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
    }

    const userData = await response.json()

    // Log all returned fields for debugging
    console.log("Phone.Email Response:", userData)
    console.log("User First Name:", userData.user_first_name)
    console.log("User Last Name:", userData.user_last_name)

    // Extract phone number from Phone.Email response
    const phoneNumber = userData.user_phone_number || userData.phone_number || userData.phone
    const firstName = userData.user_first_name || ""
    const lastName = userData.user_last_name || ""
    const countryCode = userData.user_country_code || ""

    if (!phoneNumber) {
      return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
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
        return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
      }

      user = newUser
    } else if (findError) {
      console.error("Database error:", findError)
      return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
    }

    // Create response with redirect
    const redirectResponse = NextResponse.redirect(new URL(returnTo, request.url))

    // Set userId cookie (HTTP-only, secure, 30 days)
    const cookieStore = await cookies()
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return redirectResponse
  } catch (error) {
    console.error("Phone success callback error:", error)
    return NextResponse.redirect(new URL("/cart?auth=failed", request.url))
  }
}
