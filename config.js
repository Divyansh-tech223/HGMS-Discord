alert('Config file loaded!');
// This is config.js

const supabaseUrl = "https://npcoundkqshdqdckmhst.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wY291bmRrcXNoZHFkY2ttaHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjgwNDcsImV4cCI6MjA3ODgwNDA0N30.LLf4XHoNi2kOuXv2znNKd3XNM6jQBaxguxkqLoER7zo";

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
