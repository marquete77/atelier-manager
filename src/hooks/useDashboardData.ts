import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/useAuth';
import { AppointmentService } from '@/services/appointment.service';

export const useDashboardData = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        appointmentsToday: 0,
        pendingDeliveries: 0,
        monthlyRevenue: 0
    });
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const today = new Date().toLocaleDateString('en-CA');

            // 1. Appointments Today & 2. Pending Projects & 3. Monthly Revenue
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('en-CA');

            const [
                { count: aptCount },
                { count: projCount },
                { data: revenueData },
                { data: apts },
                { data: projs }
            ] = await Promise.all([
                supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('start_time', `${today}T00:00:00`).lte('start_time', `${today}T23:59:59`),
                supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['pending', 'in_progress']),
                supabase.from('projects').select('total_cost').eq('user_id', user.id).gte('created_at', firstDayOfMonth),
                AppointmentService.getDashboardAppointments(user.id, 10),
                supabase.from('projects').select('id, title, status, images, clients(full_name), appointments(start_time, type)').eq('user_id', user.id).in('status', ['pending', 'in_progress']).order('created_at', { ascending: false }).limit(4)
            ]);

            const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0) || 0;

            setStats({
                appointmentsToday: aptCount || 0,
                pendingDeliveries: projCount || 0,
                monthlyRevenue: totalRevenue
            });

            setRecentAppointments(apts || []);

            // Process projects for delivery date
            const processedProjs = projs?.map(p => {
                const deliveryApt = (p.appointments as any[])?.find(a => a.type === 'delivery');
                return {
                    ...p,
                    deliveryDate: deliveryApt?.start_time
                };
            });

            setRecentProjects(processedProjs || []);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return { stats, recentAppointments, recentProjects, loading, error, refresh: fetchDashboardData };
};
