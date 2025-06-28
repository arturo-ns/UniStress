import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://xesanftcibogmzonkwkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2FuZnRjaWJvZ216b25rd2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUyMTMsImV4cCI6MjA2NDY0MTIxM30.PXJh4PCNiynXnqe21YbgpuVHqVjYw6DVd5AaKJcAi8U'
);