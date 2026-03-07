import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';

export const useProjectDetails = (projectId: string | undefined) => {
    const [project, setProject] = useState<any>(null);
    const [client, setClient] = useState<any>(null);
    const [measurements, setMeasurements] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const loadData = useCallback(async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            setError(null);

            // 1. Fetch project first to get client_id
            const { data: proj, error: projError } = await supabase
                .from('projects')
                .select('*, clients(*)')
                .eq('id', projectId)
                .single();

            if (projError) throw projError;
            setProject(proj);
            setClient(proj.clients);

            // 2. Fetch associated data in parallel
            const [{ data: meas }, { data: apts }] = await Promise.all([
                supabase
                    .from('measurements')
                    .select('*')
                    .eq('client_id', proj.client_id)
                    .order('created_at', { ascending: false })
                    .limit(1),
                supabase
                    .from('appointments')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('start_time', { ascending: true })
            ]);

            setMeasurements(meas?.[0] || null);
            setAppointments(apts || []);

        } catch (err) {
            console.error('Error loading project details:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { project, client, measurements, appointments, loading, error, refresh: loadData };
};
