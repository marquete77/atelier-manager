import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';

interface ClientDetails {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    address_link: string | null;
    notes: string | null;
}

interface Project {
    id: string;
    title: string;
    status: string;
    total_cost: number;
    type: string;
    created_at: string;
    appointments: any[];
}

export const useClientDetails = (clientId: string | undefined) => {
    const [client, setClient] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [measurements, setMeasurements] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const loadData = useCallback(async () => {
        if (!clientId) return;

        try {
            setLoading(true);
            setError(null);

            const [{ data: c, error: clientError }, { data: projs, error: projsError }, { data: meas, error: measError }] = await Promise.all([
                supabase.from('clients').select('*').eq('id', clientId).single(),
                supabase.from('projects').select('*, appointments(*)').eq('client_id', clientId).order('created_at', { ascending: false }),
                supabase.from('measurements').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(1),
            ]);

            if (clientError) throw clientError;

            setClient(c);
            setProjects(projs || []);
            setMeasurements(meas?.[0] || null);
        } catch (err) {
            console.error('Error loading client details:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { client, projects, measurements, loading, error, refresh: loadData };
};
