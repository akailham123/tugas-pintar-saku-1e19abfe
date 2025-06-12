-- Drop ALL existing task policies to clean up
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can update all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Only admins can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Only admins can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view tasks from followed subjects" ON public.tasks;
DROP POLICY IF EXISTS "Users can update completion status on tasks from followed subjects" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own task completion" ON public.tasks;

-- Create clean, simple policies
-- 1. Users can view tasks from subjects they follow OR if they are admin
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

-- 2. Users can update completion status on tasks from subjects they follow OR if they are admin  
CREATE POLICY "Users can update task completion" 
ON public.tasks 
FOR UPDATE 
USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_subjects 
    WHERE user_id = auth.uid() AND subject_id = tasks.subject_id
  )
);

-- 3. Only admins can create tasks
CREATE POLICY "Only admins can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (public.is_admin());

-- 4. Only admins can delete tasks
CREATE POLICY "Only admins can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (public.is_admin());