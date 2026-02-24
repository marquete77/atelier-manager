import { supabase } from '../config/supabase'
import { Database } from '../types/database'

type ClientInsert = Database['public']['Tables']['clients']['Insert']

export const ClientService = {
  async getAll() {
    return await supabase.from('clients').select('*')
  },

  async create(data: ClientInsert) {
    return await supabase.from('clients').insert(data).select().single()
  },

  async update(id: string, data: Partial<ClientInsert>) {
    return await supabase.from('clients').update(data).eq('id', id).select().single()
  },

  async getById(id: string) {
    return await supabase.from('clients').select('*').eq('id', id).single()
  }
}
