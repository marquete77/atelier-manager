import { supabase } from '../config/supabase'
import { Database } from '../types/database'

type AlterationInsert = Database['public']['Tables']['alterations']['Insert']

export const AlterationService = {
    async create(data: AlterationInsert) {
        return await supabase
            .from('alterations')
            .insert(data)
            .select()
            .single()
    },

    async getByProjectId(projectId: string) {
        return await supabase
            .from('alterations')
            .select('*')
            .eq('project_id', projectId)
            .single()
    }
}
