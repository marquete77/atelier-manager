import { supabase } from '../config/supabase'
import { Database } from '../types/database'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export const ProjectService = {
    async getAll() {
        return await supabase
            .from('projects')
            .select('*, clients(full_name)')
            .order('created_at', { ascending: false })
    },

    async create(data: ProjectInsert) {
        return await supabase
            .from('projects')
            .insert(data)
            .select()
            .single()
    },

    async getByClientId(clientId: string) {
        return await supabase
            .from('projects')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
    },

    async uploadImage(file: File) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `references/${fileName}`

        const { data, error } = await supabase.storage
            .from('projects')
            .upload(filePath, file)

        return { data, error, filePath }
    },

    getPublicUrl(path: string) {
        return supabase.storage.from('projects').getPublicUrl(path).data.publicUrl
    }
}
