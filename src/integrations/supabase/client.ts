// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sasompvvaaajofsvyosy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc29tcHZ2YWFham9mc3Z5b3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDQ2MjYsImV4cCI6MjA2NTU4MDYyNn0._jPkmGCzgF3c9eI6l3YBii-66LzfqyZphyQJtOXDQ6M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);