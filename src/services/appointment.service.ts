import { supabase } from '../config/supabase'
import { Database } from '../types/database'

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']

export const AppointmentService = {
    async getAll() {
        return await supabase
            .from('appointments')
            .select('*, clients(full_name)')
            .order('start_time', { ascending: true })
    },

    async create(data: AppointmentInsert) {
        return await supabase
            .from('appointments')
            .insert(data)
            .select()
            .single()
    },

    async update(id: string, data: Partial<AppointmentInsert>) {
        return await supabase
            .from('appointments')
            .update(data)
            .eq('id', id)
            .select()
            .single()
    },

    async getByClientId(clientId: string) {
        return await supabase
            .from('appointments')
            .select('*')
            .eq('client_id', clientId)
            .order('start_time', { ascending: false })
    },

    async getByDate(date: string) {
        const startOfDay = `${date}T00:00:00`
        const endOfDay = `${date}T23:59:59`

        return await supabase
            .from('appointments')
            .select('start_time')
            .gte('start_time', startOfDay)
            .lte('start_time', endOfDay)
    },

    async getDashboardAppointments(userId: string, limit: number = 10) {
        // Use local date (YYYY-MM-DD) instead of toISOString to avoid day shift at late hours
        const today = new Date().toLocaleDateString('en-CA');
        const startOfToday = `${today}T00:00:00`;

        return await supabase
            .from('appointments')
            .select('id, start_time, type, status, clients(full_name)')
            .eq('user_id', userId)
            .gte('start_time', startOfToday)
            .order('start_time', { ascending: true })
            .limit(limit);
    }
}
