import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, BarChart3, List, Plus, UserPlus, LogOut, Search } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { SubjectCard } from "@/components/SubjectCard";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { AdminTaskModal } from "@/components/AdminTaskModal";
import { AddSubjectModal } from "@/components/AddSubjectModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, Subject } from "@/types";
import { useAppData } from "@/hooks/useAppData";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { useSubjectOperations } from "@/hooks/useSubjectOperations";
import { processSubjectData, filterSubjects, filterTasks, generateAnalyticsData } from "@/utils/dataProcessing";

const Index = () => {
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAdminTaskModalOpen, setIsAdminTaskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [selectedSubjectForTask, setSelectedSubjectForTask] = useState<string>("");
  const [showAvailableSubjects, setShowAvailableSubjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  const { tasks, setTasks, allSubjects, setAllSubjects, followedSubjects, setFollowedSubjects, loadData } = useAppData();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Process data for UI
  const mySubjects = processSubjectData(allSubjects, followedSubjects, tasks);
  const filteredSubjects = filterSubjects(allSubjects, searchQuery, semesterFilter);
  const sortedTasks = filterTasks(tasks, selectedSubject);
  const mySubjectIds = mySubjects.map(subject => subject.id);
  const analyticsData = generateAnalyticsData(tasks, mySubjects, mySubjectIds);
  const availableSemesters = [...new Set(allSubjects.map(s => s.semester))].sort();

  // Custom hooks for operations
  const taskOperations = useTaskOperations(tasks, setTasks, allSubjects, mySubjects, loadData);
  const subjectOperations = useSubjectOperations(allSubjects, setAllSubjects, followedSubjects, setFollowedSubjects, loadData);

  // Event handlers
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
                  onToggleComplete={taskOperations.handleToggleComplete}
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
                         onToggleFollow={subjectOperations.handleToggleFollow}
                         onAddTask={isAdmin ? handleOpenAddTaskModal : undefined}
                         onDeleteSubject={isAdmin ? subjectOperations.handleDeleteSubject : undefined}
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
                          onToggleFollow={subjectOperations.handleToggleFollow}
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
          onUpdateDeadline={taskOperations.handleUpdateDeadline}
        />

        <AdminTaskModal
          task={selectedTask}
          open={isAdminTaskModalOpen}
          onClose={() => {
            setIsAdminTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdateTask={taskOperations.handleUpdateTask}
          onDeleteTask={taskOperations.handleDeleteTask}
          subjects={allSubjects}
        />

        <AddTaskModal
          open={isAddTaskModalOpen}
          onClose={() => {
            setIsAddTaskModalOpen(false);
            setSelectedSubjectForTask("");
          }}
          onAddTask={taskOperations.handleAddTask}
          followedSubjects={isAdmin ? allSubjects : mySubjects}
          preSelectedSubject={selectedSubjectForTask}
        />

        <AddSubjectModal
          open={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          onAddSubject={subjectOperations.handleAddSubject}
        />

      </div>
    </div>
  );
};

export default Index;