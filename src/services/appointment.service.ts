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

    async getByClientId(clientId: string) {
        return await supabase
            .from('appointments')
            .select('*')
            .eq('client_id', clientId)
            .order('start_time', { ascending: false })
    },

    async getByDate(date: string) {
        const startOfDay = `${date}T00:00:00Z`
        const endOfDay = `${date}T23:59:59Z`

        return await supabase
            .from('appointments')
            .select('start_time')
            .gte('start_time', startOfDay)
            .lte('start_time', endOfDay)
    }
}
