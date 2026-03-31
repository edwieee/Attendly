import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase URL and Public Anon Key
// Source: Supabase Project Settings > API
const SUPABASE_URL = "https://xhyzpxnheeuxcictdwrw.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_Shbtg3_8PXKYY_3aySPPOw_qPB428fz";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
