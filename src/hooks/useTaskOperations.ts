import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Task, Subject } from "@/types";

export const useTaskOperations = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  allSubjects: Subject[],
  mySubjects: Subject[],
  loadData: () => Promise<void>
) => {
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      toast({
        title: "Berhasil",
        description: task.completed ? "Tugas dibatalkan" : "Tugas diselesaikan",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate tugas",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDeadline = async (taskId: string, newDeadline: Date) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ deadline: newDeadline.toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, deadline: newDeadline.toISOString() } : task
      ));

      toast({
        title: "Berhasil",
        description: "Deadline berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating deadline:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate deadline",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    deadline: Date;
    type: string;
    subject: string;
  }) => {
    try {
      // For admin, search in all subjects. For user, search in followed subjects
      const subject = isAdmin 
        ? allSubjects.find(s => s.name === taskData.subject)
        : mySubjects.find(s => s.name === taskData.subject);
      
      if (!subject) return;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline.toISOString(),
          type: taskData.type,
          subject_id: subject.id,
          user_id: profile?.id, // For now, assign to creator
          created_by: profile?.id
        })
        .select('*, subjects:subject_id(*)')
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data]);
      toast({
        title: "Berhasil",
        description: "Tugas berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan tugas",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      await loadData();
      toast({
        title: "Berhasil",
        description: "Tugas berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui tugas",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({
        title: "Berhasil",
        description: "Tugas berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus tugas",
        variant: "destructive",
      });
    }
  };

  return {
    handleToggleComplete,
    handleUpdateDeadline,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};