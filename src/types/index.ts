import { Database } from './database';

export type Client = Database['public']['Tables']['clients']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Measurement = Database['public']['Tables']['measurements']['Row'];
export type Alteration = Database['public']['Tables']['alterations']['Row'];
