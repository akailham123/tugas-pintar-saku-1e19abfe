-- Create non-recursive RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Subjects policies
CREATE POLICY "Everyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage subjects" 
ON public.subjects 
FOR ALL 
USING (public.is_admin());

-- Tasks policies
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tasks" 
ON public.tasks 
FOR ALL 
USING (public.is_admin());

-- User subjects policies
CREATE POLICY "Users can view their own subject follows" 
ON public.user_subjects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subject follows" 
ON public.user_subjects 
FOR ALL 
USING (auth.uid() = user_id);