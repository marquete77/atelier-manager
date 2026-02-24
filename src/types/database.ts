export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            alterations: {
                Row: {
                    created_at: string | null
                    evidence_images: string[] | null
                    garment_type: string
                    id: string
                    notes: string | null
                    project_id: string
                    tasks: Json
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    evidence_images?: string[] | null
                    garment_type: string
                    id?: string
                    notes?: string | null
                    project_id: string
                    tasks?: Json
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    evidence_images?: string[] | null
                    garment_type?: string
                    id?: string
                    notes?: string | null
                    project_id?: string
                    tasks?: Json
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "alterations_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            appointments: {
                Row: {
                    client_id: string | null
                    created_at: string | null
                    end_time: string
                    id: string
                    notes: string | null
                    origin: string | null
                    project_id: string | null
                    start_time: string
                    status: string | null
                    title: string | null
                    type: string | null
                    user_id: string
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string | null
                    end_time: string
                    id?: string
                    notes?: string | null
                    origin?: string | null
                    project_id?: string | null
                    start_time: string
                    status?: string | null
                    title?: string | null
                    type?: string | null
                    user_id: string
                }
                Update: {
                    client_id?: string | null
                    created_at?: string | null
                    end_time?: string
                    id?: string
                    notes?: string | null
                    origin?: string | null
                    project_id?: string | null
                    start_time?: string
                    status?: string | null
                    title?: string | null
                    type?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "appointments_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "appointments_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            client_interactions: {
                Row: {
                    attachment_url: string | null
                    client_id: string
                    content: string | null
                    created_at: string | null
                    id: string
                    project_id: string
                    status: string | null
                    type: string | null
                }
                Insert: {
                    attachment_url?: string | null
                    client_id: string
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    project_id: string
                    status?: string | null
                    type?: string | null
                }
                Update: {
                    attachment_url?: string | null
                    client_id?: string
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    project_id?: string
                    status?: string | null
                    type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "client_interactions_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "client_interactions_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            clients: {
                Row: {
                    access_token: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string
                    id: string
                    notes: string | null
                    phone: string | null
                    address: string | null
                    address_link: string | null
                    portal_user_id: string | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    access_token?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name: string
                    id?: string
                    notes?: string | null
                    phone?: string | null
                    address?: string | null
                    address_link?: string | null
                    portal_user_id?: string | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    access_token?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string
                    id?: string
                    notes?: string | null
                    phone?: string | null
                    address?: string | null
                    address_link?: string | null
                    portal_user_id?: string | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            measurements: {
                Row: {
                    client_id: string
                    created_at: string | null
                    id: string
                    images: string[] | null
                    notes: string | null
                    project_id: string | null
                    user_id: string
                    values: Json
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    notes?: string | null
                    project_id?: string | null
                    user_id: string
                    values?: Json
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    id?: string
                    images?: string[] | null
                    notes?: string | null
                    project_id?: string | null
                    user_id?: string
                    values?: Json
                }
                Relationships: [
                    {
                        foreignKeyName: "measurements_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "measurements_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    client_id: string
                    created_at: string | null
                    deposit: number | null
                    description: string | null
                    id: string
                    is_paid: boolean | null
                    status: string | null
                    title: string
                    total_cost: number | null
                    type: string | null
                    images: string[] | null
                    user_id: string
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    deposit?: number | null
                    description?: string | null
                    id?: string
                    is_paid?: boolean | null
                    status?: string | null
                    title: string
                    total_cost?: number | null
                    type?: string | null
                    images?: string[] | null
                    user_id: string
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    deposit?: number | null
                    description?: string | null
                    id?: string
                    is_paid?: boolean | null
                    status?: string | null
                    title?: string
                    total_cost?: number | null
                    type?: string | null
                    images?: string[] | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
