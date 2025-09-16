import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('❌ VITE_SUPABASE_URL is not configured or using placeholder value')
  console.log('📋 Please follow these steps:')
  console.log('1. Create a Supabase project at https://supabase.com')
  console.log('2. Copy your project URL from Settings → API')
  console.log('3. Add VITE_SUPABASE_URL=your-project-url to your .env file')
  console.log('4. Restart your development server')
}

if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not configured or using placeholder value')
  console.log('📋 Please follow these steps:')
  console.log('1. Go to your Supabase project Settings → API')
  console.log('2. Copy the "anon public" API key')
  console.log('3. Add VITE_SUPABASE_ANON_KEY=your-anon-key to your .env file')
  console.log('4. Restart your development server')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)