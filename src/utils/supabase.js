import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xirysmltbxwbgmkxveyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcnlzbWx0Ynh3Ymdta3h2ZXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTA2NzksImV4cCI6MjA4MzY4NjY3OX0.5-kLtmgvhH7QxIukf6rHk1xrJj0dHQF_Yl2qNUHCWEw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
