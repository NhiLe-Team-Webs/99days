import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dcbyllsbsassmgirygfi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYnlsbHNic2Fzc21naXJ5Z2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTAxMDgsImV4cCI6MjA3MTU2NjEwOH0.n449JZesGj978cs3tEaxwwN5j_nae8U9gsJSoE6w0Oo";

export const supabase = createClient(supabaseUrl, supabaseKey);