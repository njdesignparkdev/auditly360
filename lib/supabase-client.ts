import { createClient } from '@supabase/supabase-js'

// Check for required environment variables
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate Supabase URL
const isValidUrl = (url: string | undefined) => {
  if (!url) return false
  try {
    new URL(url)
    return !url.includes('your-supabase-url')
  } catch (e) {
    return false
  }
}

if (!isValidUrl(supabaseUrl)) {
  console.warn(
    '⚠️ Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Using fallback for development to prevent crash.'
  )
  console.warn('Real database connection will fail until you update .env.local with valid credentials.')
  supabaseUrl = 'https://placeholder.supabase.co'
}

// Validate Anon Key
if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.warn(
    '⚠️ Invalid or missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Using fallback for development.'
  )
  supabaseAnonKey = 'placeholder-key'
}

export const isSupabaseConfigured = isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) && 
  (!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase-anon-key'));

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})
