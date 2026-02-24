import { supabase } from '../config/supabase'
import { Database } from '../types/database'

type MeasurementInsert = Database['public']['Tables']['measurements']['Insert']

export const MeasurementService = {
    async getAll() {
        return await supabase
            .from('measurements')
            .select('*, clients(full_name)')
            .order('created_at', { ascending: false })
    },

    async create(data: MeasurementInsert) {
        return await supabase
            .from('measurements')
            .insert(data)
            .select()
            .single()
    },

    async getByClientId(clientId: string) {
        return await supabase
            .from('measurements')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
    },

    async getLatestByClientId(clientId: string) {
        return await supabase
            .from('measurements')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
    }
}
