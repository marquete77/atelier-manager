-- 002_client_portal.sql
-- Phase 2: Client Portal Extensions
-- Adds: Client Login, Client Interactions (Feedback), Client Requested Appointments

-- 1. Extend Clients Table for Portal Access
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS portal_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS access_token TEXT; -- For "Magic Link" access

-- Verify RLS: Identify if we need a policy for 'portal_user_id' later. 
-- For now, artisan owns the record. 
-- FUTURE: Add policy "Clients can view their own record via portal_user_id"

-- 2. Client Interactions (Feedback Loop)
CREATE TABLE IF NOT EXISTS public.client_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('reference_image', 'issue_report', 'note')),
    content TEXT,
    attachment_url TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Client Interactions
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;
-- Policy: Artisan can view all interactions for their clients
CREATE POLICY "Artisans can view interactions for their projects" ON public.client_interactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = client_interactions.project_id
            AND p.user_id = auth.uid()
        )
    );

-- 3. Extend Appointments for Client Requests
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'artisan' CHECK (origin IN ('artisan', 'client_request'));

-- Update check constraint for status to include 'requested'
-- PostgreSQL requires dropping constraint and re-adding, or checking if it exists.
-- Simplified approach: Drop existing check and add new one.
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check 
    CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'requested'));
