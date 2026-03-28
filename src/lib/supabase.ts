import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
// from your Supabase Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('your-project-url')) {
  console.warn('Supabase URL is missing or placeholder. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
