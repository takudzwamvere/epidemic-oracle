import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client instance for client-side operations.
 * @returns Supabase browser client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!
  )
}
