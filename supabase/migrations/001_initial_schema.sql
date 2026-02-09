-- 001_initial_schema.sql
-- Base Schema for Atelier Manager
-- Tables: clients, projects, measurements, alterations, appointments

-- 1. Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id);

-- 2. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('confection', 'alteration')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered')),
    deadline DATE,
    total_cost NUMERIC(10, 2),
    deposit NUMERIC(10, 2),
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- 3. Measurements
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Optional link to specific project
    "values" JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"busto": 90}
    notes TEXT,
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Measurements
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own measurements" ON public.measurements
    FOR ALL USING (auth.uid() = user_id);

-- 4. Alterations
CREATE TABLE IF NOT EXISTS public.alterations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    garment_type TEXT NOT NULL,
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"name": "Basta", "price": 10}]
    notes TEXT,
    evidence_images TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Alterations
ALTER TABLE public.alterations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own alterations" ON public.alterations
    FOR ALL USING (auth.uid() = user_id);

-- 5. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('fitting', 'delivery', 'consultation', 'measurement')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    title TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);
