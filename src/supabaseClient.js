import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtztzpthcjlwzhpubghe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0enR6cHRoY2psd3pocHViZ2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjM2MjAsImV4cCI6MjA2ODgzOTYyMH0.SnWG7DQVDHLy0KtOc4BOOKrTul4TILquU-Xpb8Qq_eY'

export const supabase = createClient(supabaseUrl, supabaseKey) 