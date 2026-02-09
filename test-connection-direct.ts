import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hthciwgsadrcuhimjife.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0aGNpd2dzYWRyY3VoaW1qaWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDY3OTIsImV4cCI6MjA4NjIyMjc5Mn0.SosQ8oyko3bCHw2PFplnMK9-Ay8jlHZ1UFQIPIMa5FM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing Supabase direct connection...');
    try {
        const { data, error } = await supabase.from('projects').select('*').limit(5);
        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Projects found:', data?.length);
            console.log('Success! Your frontend can talk to Supabase.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
