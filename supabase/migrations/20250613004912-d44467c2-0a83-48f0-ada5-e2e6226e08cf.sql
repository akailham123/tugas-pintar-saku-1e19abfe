-- Drop all existing policies on user_subjects to clean up
DROP POLICY IF EXISTS "Users can view their own followed subjects" ON public.user_subjects;
DROP POLICY IF EXISTS "Users can follow subjects" ON public.user_subjects;
DROP POLICY IF EXISTS "Users can unfollow subjects" ON public.user_subjects;
DROP POLICY IF EXISTS "Users can manage their own subject follows" ON public.user_subjects;
DROP POLICY IF EXISTS "Users can view their own subject follows" ON public.user_subjects;

-- Create correct policies for user_subjects
CREATE POLICY "Users can view their own followed subjects" 
ON public.user_subjects 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can follow subjects" 
ON public.user_subjects 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unfollow subjects" 
ON public.user_subjects 
FOR DELETE 
USING (user_id = auth.uid());