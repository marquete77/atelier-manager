import { supabase } from './src/config/supabase';

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('projects').select('*').limit(5);
        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Projects found:', data?.length);
            if (data && data.length > 0) {
                console.log('Sample project:', data[0].title);
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
