// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nsymckpbfadigctfgkqg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zeW1ja3BiZmFkaWdjdGZna3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MDg1OTUsImV4cCI6MjA2MDk4NDU5NX0.ky3gU2b2MjYmFJdqwv7rghfzHbf3HE2hko8k_XwSF5Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);