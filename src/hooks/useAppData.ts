import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Task, Subject } from "@/types";

export const useAppData = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [followedSubjects, setFollowedSubjects] = useState<string[]>([]);

  const loadData = async () => {
    try {
      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .order('semester', { ascending: true });

      if (subjectsError) throw subjectsError;
      setAllSubjects(subjectsData || []);

      // Load user's followed subjects
      const { data: userSubjectsData, error: userSubjectsError } = await supabase
        .from('user_subjects')
        .select('subject_id')
        .eq('user_id', profile?.user_id);

      if (userSubjectsError) throw userSubjectsError;
      setFollowedSubjects(userSubjectsData?.map(us => us.subject_id) || []);

      // Load tasks - RLS policies will automatically filter based on user permissions
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            code,
            semester
          )
        `)
        .order('deadline', { ascending: true });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user && profile) {
      loadData();
    }
  }, [user, profile]);

  return {
    tasks,
    setTasks,
    allSubjects,
    setAllSubjects,
    followedSubjects,
    setFollowedSubjects,
    loadData
  };
};