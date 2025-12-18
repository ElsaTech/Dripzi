import "server-only"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Supabase Server Client
 * 
 * Used for server-side operations only (Server Components, Server Actions, API Routes)
 * Authenticates with Service Role key for full database access
 * 
 * Tables:
 * - users: User profiles (phone, name, email, admin flag)
 * - addresses: Saved shipping addresses
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role secret key (server-side only)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Create a new Supabase client instance
 * Each call returns a fresh client with Service Role credentials
 * 
 * PRODUCTION-SAFE: Validates environment variables and throws descriptive errors
 * API routes should catch these errors and return proper JSON responses
 */
export function createClient() {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment variables")
  }

  if (!supabaseKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Server-side only, no session persistence
      autoRefreshToken: false,
    },
  })
}

/**
 * Default singleton instance for convenient imports
 */
export const supabase = createClient()

/**
 * Database types matching Supabase tables
 */
export interface User {
  id?: string // UUID
  phone_number: string
  name?: string
  first_name?: string | null
  last_name?: string | null
  email?: string
  is_admin: boolean
  created_at?: string
  updated_at?: string
}

export interface Address {
  id?: string // UUID
  user_id: string // UUID reference to users.id
  full_name: string
  phone_number: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pin_code: string
  is_default: boolean
  created_at?: string
}
