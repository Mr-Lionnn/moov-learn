-- Create announcement priority enum
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high', 'critical', 'emergency');

-- Create announcement visibility enum  
CREATE TYPE announcement_visibility AS ENUM ('public', 'private', 'role_specific');

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    priority announcement_priority NOT NULL DEFAULT 'medium',
    visibility announcement_visibility NOT NULL DEFAULT 'public',
    target_roles TEXT[], -- Array of role names
    target_users UUID[], -- Array of user IDs
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcement attachments table
CREATE TABLE public.announcement_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcement views table (tracking who has seen announcements)
CREATE TABLE public.announcement_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(announcement_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Authorized users can create announcements" ON public.announcements
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'director', 'team_chief')
    )
);

CREATE POLICY "Authorized users can update their announcements" ON public.announcements
FOR UPDATE TO authenticated
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'director')
    )
);

CREATE POLICY "Authorized users can delete their announcements" ON public.announcements
FOR DELETE TO authenticated
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'director')
    )
);

CREATE POLICY "Users can view announcements based on visibility" ON public.announcements
FOR SELECT TO authenticated
USING (
    is_published = true AND
    (scheduled_at IS NULL OR scheduled_at <= now()) AND
    (expires_at IS NULL OR expires_at > now()) AND
    (
        visibility = 'public' OR
        (visibility = 'private' AND author_id = auth.uid()) OR
        (visibility = 'role_specific' AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role = ANY(target_roles)
        )) OR
        (target_users IS NOT NULL AND auth.uid() = ANY(target_users))
    )
);

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments for visible announcements" ON public.announcement_attachments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.announcements 
        WHERE id = announcement_id 
        AND is_published = true
        AND (scheduled_at IS NULL OR scheduled_at <= now())
        AND (expires_at IS NULL OR expires_at > now())
    )
);

CREATE POLICY "Authorized users can manage attachments" ON public.announcement_attachments
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.announcements a
        JOIN public.profiles p ON p.user_id = auth.uid()
        WHERE a.id = announcement_id 
        AND (a.author_id = auth.uid() OR p.role IN ('admin', 'director'))
    )
);

-- RLS Policies for views
CREATE POLICY "Users can track their own views" ON public.announcement_views
FOR ALL TO authenticated
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_announcements_published ON public.announcements(is_published, scheduled_at, expires_at);
CREATE INDEX idx_announcements_priority ON public.announcements(priority);
CREATE INDEX idx_announcements_author ON public.announcements(author_id);
CREATE INDEX idx_announcement_views_user ON public.announcement_views(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();