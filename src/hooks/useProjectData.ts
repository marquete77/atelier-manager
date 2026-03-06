import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useProjectData = (options: { limit?: number; status?: string[] } = {}) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchProjects = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('projects')
                .select(`
                    id, 
                    title, 
                    status, 
                    images,
                    clients(full_name),
                    appointments(start_time, type)
                `)
                .eq('user_id', user.id);

            if (options.status && options.status.length > 0) {
                query = query.in('status', options.status);
            }

            query = query.order('created_at', { ascending: false });

            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setProjects(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user, options.limit, JSON.stringify(options.status)]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refresh: fetchProjects };
};
