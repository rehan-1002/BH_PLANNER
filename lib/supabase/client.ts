import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bybbtulfskobkknhihrl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5YmJ0dWxmc2tvYmtrbmhpaHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjY2ODAsImV4cCI6MjEwNDIwMjY4MH0.he6Hl9wdNZVRxScqTdyCBh4R7Aysn4tGLQzy8syvEc0";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
