import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

export const useClientSearch = (searchTerm: string) => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (searchTerm.length < 3) {
            setResults([]);
            return;
        }

        const fetchClients = async () => {
            setLoading(true);
            try {
                const { data, error: searchError } = await supabase
                    .from('clients')
                    .select('id, full_name')
                    .ilike('full_name', `%${searchTerm}%`)
                    .limit(5);

                if (searchError) throw searchError;
                setResults(data || []);
            } catch (err) {
                console.error('Error searching clients:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchClients, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    return { results, loading, error };
};
