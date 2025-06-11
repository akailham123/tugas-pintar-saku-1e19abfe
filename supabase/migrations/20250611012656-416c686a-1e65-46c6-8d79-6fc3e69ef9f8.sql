-- Drop existing task policies
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.tasks;

-- Create new policies that allow users to see tasks from subjects they follow
CREATE POLICY "Users can view tasks from followed subjects" 
ON public.tasks 
FOR SELECT 
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_subjects 
    WHERE user_id = auth.uid() AND subject_id = tasks.subject_id
  )
);

CREATE POLICY "Users can update completion status on tasks from followed subjects" 
ON public.tasks 
FOR UPDATE 
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_subjects 
    WHERE user_id = auth.uid() AND subject_id = tasks.subject_id
  )
);

CREATE POLICY "Admins can manage all tasks" 
ON public.tasks 
FOR ALL 
USING (public.is_admin());