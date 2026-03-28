import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR OWN SUPABASE PROJECT VALUES SOURCED FROM YOUR SETTINGS
const SUPABASE_URL = "https://yzrjbdzcoxwkvfrxqiix.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_EjtmxddUAgd_t3CyBQIK5A_TE73nPvs";

// One client instance is exported for use throughout the project.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
