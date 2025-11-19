/*
  This file holds your secret keys.
  You only need to set this ONCE.
*/

const SUPABASE_URL = 'https://npcoundkqshdqdckmhst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wY291bmRrcXNoZHFkY2ttaHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjgwNDcsImV4cCI6MjA3ODgwNDA0N30.LLf4XHoNi2kOuXv2znNKd3XNM6jQBaxguxkqLoER7zo';

// This creates the Supabase client for all other scripts to use
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
