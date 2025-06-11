import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, BarChart3, List, Plus, UserPlus, LogOut, Search, Settings } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { SubjectCard } from "@/components/SubjectCard";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { AdminTaskModal } from "@/components/AdminTaskModal";
import { AddSubjectModal } from "@/components/AddSubjectModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  type: string;
  subject_id: string;
  subjects?: Subject;
  completed: boolean;
  user_id: string;
  created_by: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
  description?: string;
  taskCount?: number;
  completedTasks?: number;
}

const Index = () => {
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAdminTaskModalOpen, setIsAdminTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [followedSubjects, setFollowedSubjects] = useState<string[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [selectedSubjectForTask, setSelectedSubjectForTask] = useState<string>("");
  const [showAvailableSubjects, setShowAvailableSubjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load data from Supabase
  useEffect(() => {
    if (user && profile) {
      loadData();
    }
  }, [user, profile]);

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
        .eq('user_id', profile?.id);

      if (userSubjectsError) throw userSubjectsError;
      setFollowedSubjects(userSubjectsData?.map(us => us.subject_id) || []);

      // Load tasks (admin sees all, users see tasks from subjects they follow)
      let tasksQuery = supabase
        .from('tasks')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            code,
            semester
          )
        `);

      if (!isAdmin) {
        // Users can see tasks from subjects they follow 
        const subjectIds = userSubjectsData?.map(us => us.subject_id) || [];
        if (subjectIds.length > 0) {
          tasksQuery = tasksQuery.in('subject_id', subjectIds);
        } else {
          // If user doesn't follow any subjects, return empty array
          setTasks([]);
          return;
        }
      }

      const { data: tasksData, error: tasksError } = await tasksQuery
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    if (isAdmin) {
      setIsAdminTaskModalOpen(true);
    } else {
      setIsTaskModalOpen(true);
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveTab("tasks");
  };

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

  const handleToggleFollow = async (subjectId: string) => {
    try {
      if (followedSubjects.includes(subjectId)) {
        // Unfollow
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', profile?.id)
          .eq('subject_id', subjectId);

        if (error) throw error;
        
        setFollowedSubjects(prev => prev.filter(id => id !== subjectId));
        toast({
          title: "Berhasil",
          description: "Berhenti mengikuti mata kuliah",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('user_subjects')
          .insert({
            user_id: profile?.id,
            subject_id: subjectId
          });

        if (error) throw error;
        
        setFollowedSubjects(prev => [...prev, subjectId]);
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
          created_by: profile?.id
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

  const handleOpenAddTaskModal = (subjectName?: string) => {
    setSelectedSubjectForTask(subjectName || "");
    setIsAddTaskModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Loading states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Mata kuliah yang diikuti user
  const mySubjects = allSubjects.filter(subject => 
    followedSubjects.includes(subject.id)
  ).map(subject => {
    const subjectTasks = tasks.filter(task => task.subjects?.name === subject.name);
    return {
      ...subject,
      taskCount: subjectTasks.length,
      completedTasks: subjectTasks.filter(task => task.completed).length
    };
  });

  // Filter subjects based on search and semester
  const filteredSubjects = allSubjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === "all" || subject.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  // Get available semesters for filter
  const availableSemesters = [...new Set(allSubjects.map(s => s.semester))].sort();

  // Filter tugas hanya dari mata kuliah yang diikuti
  const mySubjectIds = mySubjects.map(subject => subject.id);
  const filteredTasks = selectedSubject 
    ? tasks.filter(task => task.subject_id === selectedSubject.id)
    : tasks.filter(task => mySubjectIds.includes(task.subject_id) && !task.completed);

  // Urutkan berdasarkan deadline
  const sortedTasks = filteredTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  // Data analitik menggunakan semua tugas dari mata kuliah yang diikuti
  const allMyTasks = tasks.filter(task => mySubjectIds.includes(task.subject_id));
  
  const analyticsData = {
    totalTasks: allMyTasks.length,
    completedTasks: allMyTasks.filter(task => task.completed).length,
    totalSubjects: mySubjects.length,
    overdueTasks: allMyTasks.filter(task => new Date() > new Date(task.deadline) && !task.completed).length,
    subjectAnalysis: mySubjects.map(subject => ({
      subject: subject.name,
      completion: tasks.filter(task => task.subjects?.name === subject.name && task.completed).length,
      total: tasks.filter(task => task.subjects?.name === subject.name).length
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info and logout */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Senjati - Manajemen Tugas Kuliah
            </h1>
            <p className="text-gray-600">
              Selamat datang, {profile.full_name || 'User'} 
              {isAdmin && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Semua Tugas
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Mata Kuliah
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedSubject ? `Tugas ${selectedSubject.name}` : "Semua Tugas"}
              </h2>
              <div className="flex gap-2">
                {isAdmin && (
                  <Button onClick={() => handleOpenAddTaskModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tugas
                  </Button>
                )}
                {selectedSubject && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSubject(null)}
                  >
                    Lihat Semua Tugas
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    deadline: new Date(task.deadline),
                    subject: task.subjects?.name || 'Unknown'
                  }}
                  onClick={(t) => handleTaskClick(task)}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>

            {sortedTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {selectedSubject 
                    ? `Belum ada tugas untuk ${selectedSubject.name}`
                    : "Belum ada tugas yang tersedia"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="space-y-6">
              {/* Mata Kuliah yang Diikuti */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Mata Kuliah yang Diikuti</h2>
                {mySubjects.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                     {mySubjects.map((subject) => (
                       <SubjectCard
                         key={subject.id}
                         subject={subject}
                         onClick={handleSubjectClick}
                         isFollowed={true}
                         onToggleFollow={handleToggleFollow}
                         onAddTask={isAdmin ? handleOpenAddTaskModal : undefined}
                         onDeleteSubject={isAdmin ? handleDeleteSubject : undefined}
                       />
                     ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                      Belum ada mata kuliah yang diikuti. Pilih mata kuliah di bawah ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Mata Kuliah Tersedia */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mata Kuliah Tersedia</h2>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <Button onClick={() => setIsAddSubjectModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Mata Kuliah
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => setShowAvailableSubjects(!showAvailableSubjects)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {showAvailableSubjects ? "Sembunyikan" : "Daftar Mata Kuliah"}
                    </Button>
                  </div>
                </div>
                
                {showAvailableSubjects && (
                  <>
                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Cari mata kuliah..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Semester</SelectItem>
                          {availableSemesters.map((semester) => (
                            <SelectItem key={semester} value={semester}>
                              {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredSubjects.map((subject) => (
                        <SubjectCard
                          key={subject.id}
                          subject={{
                            ...subject,
                            taskCount: 0,
                            completedTasks: 0
                          }}
                          onClick={() => {}} // Disable click for available subjects
                          isFollowed={followedSubjects.includes(subject.id)}
                          onToggleFollow={handleToggleFollow}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Analisis Akademik</h2>
            <AnalyticsCard data={analyticsData} />
          </TabsContent>
        </Tabs>

        <TaskModal
          task={selectedTask ? {
            ...selectedTask,
            deadline: new Date(selectedTask.deadline),
            subject: selectedTask.subjects?.name || 'Unknown'
          } : null}
          open={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdateDeadline={handleUpdateDeadline}
        />

        <AdminTaskModal
          task={selectedTask}
          open={isAdminTaskModalOpen}
          onClose={() => {
            setIsAdminTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          subjects={allSubjects}
        />

        <AddTaskModal
          open={isAddTaskModalOpen}
          onClose={() => {
            setIsAddTaskModalOpen(false);
            setSelectedSubjectForTask("");
          }}
          onAddTask={handleAddTask}
          followedSubjects={isAdmin ? allSubjects : mySubjects}
          preSelectedSubject={selectedSubjectForTask}
        />

        <AddSubjectModal
          open={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          onAddSubject={handleAddSubject}
        />

      </div>
    </div>
  );
};

export default Index;
