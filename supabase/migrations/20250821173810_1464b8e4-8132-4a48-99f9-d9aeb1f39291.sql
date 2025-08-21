-- Create storage bucket for announcement attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('announcements', 'announcements', true);

-- Create policies for announcement attachments storage
CREATE POLICY "Authenticated users can view announcement attachments" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'announcements');

CREATE POLICY "Authorized users can upload announcement attachments" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'announcements' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'director', 'team_chief')
  )
);

CREATE POLICY "Authorized users can update announcement attachments" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'announcements' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'director', 'team_chief')
  )
);

CREATE POLICY "Authorized users can delete announcement attachments" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'announcements' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'director', 'team_chief')
  )
);