import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

export interface AppointmentType {
    id: string;
    slug: string;
    label: string;
}

export const useAppointmentTypes = () => {
    const [types, setTypes] = useState<AppointmentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const { data, error: fetchError } = await (supabase as any)
                    .from('appointment_types')
                    .select('id, slug, label')
                    .order('label', { ascending: true });

                if (fetchError) throw fetchError;
                setTypes(data || []);
            } catch (err) {
                console.error('Error fetching appointment types:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, []);

    return { types, loading, error };
};
