import { supabase } from '../config/supabase'

export const ClientService = {
  // Example: Get all clients
  async getAll() {
    return await supabase.from('clients').select('*')
  },

  // Example: Create client
  // async create(data: TablesInsert<'clients'>) {
  //   return await supabase.from('clients').insert(data)
  // }
}
