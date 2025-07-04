import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Subject } from "@/types";

export const useSubjectOperations = (
  allSubjects: Subject[],
  setAllSubjects: React.Dispatch<React.SetStateAction<Subject[]>>,
  followedSubjects: string[],
  setFollowedSubjects: React.Dispatch<React.SetStateAction<string[]>>,
  loadData: () => Promise<void>
) => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleToggleFollow = async (subjectId: string) => {
    try {
      if (followedSubjects.includes(subjectId)) {
        // Unfollow
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', profile?.user_id)
          .eq('subject_id', subjectId);

        if (error) throw error;
        
        setFollowedSubjects(prev => prev.filter(id => id !== subjectId));
        await loadData(); // Reload tasks to reflect changes
        toast({
          title: "Berhasil",
          description: "Berhenti mengikuti mata kuliah",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('user_subjects')
          .insert({
            user_id: profile?.user_id,
            subject_id: subjectId
          });

        if (error) throw error;
        
        setFollowedSubjects(prev => [...prev, subjectId]);
        await loadData(); // Reload tasks to reflect changes
        toast({
          title: "Berhasil",
          description: "Mulai mengikuti mata kuliah",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate mata kuliah",
        variant: "destructive",
      });
    }
  };

  const handleAddSubject = async (subjectData: {
    name: string;
    code: string;
    semester: string;
    description: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          ...subjectData,
          created_by: profile?.user_id
        })
        .select()
        .single();

      if (error) throw error;

      setAllSubjects(prev => [...prev, data]);
      toast({
        title: "Berhasil",
        description: "Mata kuliah berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan mata kuliah",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      if (!window.confirm("Yakin ingin menghapus mata kuliah ini? Semua tugas terkait akan terhapus.")) {
        return;
      }

      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;

      setAllSubjects(prev => prev.filter(s => s.id !== subjectId));
      setFollowedSubjects(prev => prev.filter(id => id !== subjectId));
      toast({
        title: "Berhasil",
        description: "Mata kuliah berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus mata kuliah",
        variant: "destructive",
      });
    }
  };

  return {
    handleToggleFollow,
    handleAddSubject,
    handleDeleteSubject
  };
};