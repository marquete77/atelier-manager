import { supabase } from '../config/supabase'
import { Database } from '../types/database'

export type AlterationGarment = Database['public']['Tables']['alteration_catalog_garments']['Row']
export type AlterationTask = Database['public']['Tables']['alteration_catalog_tasks']['Row']

export const AlterationCatalogService = {
    async getGarments() {
        const { data, error } = await supabase
            .from('alteration_catalog_garments')
            .select('*')
            .order('sort_order', { ascending: true })

        if (error) throw error
        return data as AlterationGarment[]
    },

    async getTasks() {
        const { data, error } = await supabase
            .from('alteration_catalog_tasks')
            .select('*')
            .order('sort_order', { ascending: true })

        if (error) throw error
        return data as AlterationTask[]
    }
}
