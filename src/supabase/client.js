import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan kunci dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Membuat dan mengekspor instance client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase client initialized");
