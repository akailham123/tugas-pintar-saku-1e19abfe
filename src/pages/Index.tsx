import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart3, List, Plus, UserPlus } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { SubjectCard } from "@/components/SubjectCard";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { AddTaskModal } from "@/components/AddTaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  type: string;
  subject: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
  taskCount: number;
  completedTasks: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [followedSubjects, setFollowedSubjects] = useState<string[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedSubjectForTask, setSelectedSubjectForTask] = useState<string>("");
  const [showAvailableSubjects, setShowAvailableSubjects] = useState(false);

  // Sample data - mata kuliah yang tersedia di universitas
  useEffect(() => {
    setAvailableSubjects([
      {
        id: "1",
        name: "Pemrograman Web",
        code: "TIF-301",
        semester: "Semester 5",
        taskCount: 0,
        completedTasks: 0
      },
      {
        id: "2", 
        name: "Basis Data",
        code: "TIF-302",
        semester: "Semester 5",
        taskCount: 0,
        completedTasks: 0
      },
      {
        id: "3",
        name: "Algoritma dan Struktur Data",
        code: "TIF-201",
        semester: "Semester 3",
        taskCount: 0,
        completedTasks: 0
      },
      {
        id: "4",
        name: "Sistem Operasi",
        code: "TIF-401",
        semester: "Semester 7",
        taskCount: 0,
        completedTasks: 0
      },
      {
        id: "5",
        name: "Jaringan Komputer",
        code: "TIF-402",
        semester: "Semester 7",
        taskCount: 0,
        completedTasks: 0
      }
    ]);

    // User sudah follow beberapa mata kuliah
    setFollowedSubjects(["1", "2"]);

    setTasks([
      {
        id: "1",
        title: "Project Website E-Commerce",
        description: "Membuat website e-commerce menggunakan React dan Node.js",
        deadline: new Date(2024, 5, 15),
        type: "Project",
        subject: "Pemrograman Web",
        completed: false
      },
      {
        id: "2",
        title: "Quiz Database Design",
        description: "Quiz tentang normalisasi database",
        deadline: new Date(2024, 5, 10),
        type: "Quiz",
        subject: "Basis Data",
        completed: true
      },
      {
        id: "3",
        title: "UTS Pemrograman Web",
        description: "Ujian Tengah Semester",
        deadline: new Date(2024, 5, 20),
        type: "UTS",
        subject: "Pemrograman Web",
        completed: false
      }
    ]);
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveTab("tasks");
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleUpdateDeadline = (taskId: string, newDeadline: Date) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, deadline: newDeadline } : task
    ));
  };

  const handleToggleFollow = (subjectId: string) => {
    setFollowedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAddTask = (taskData: {
    title: string;
    description: string;
    deadline: Date;
    type: string;
    subject: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleOpenAddTaskModal = (subjectName?: string) => {
    setSelectedSubjectForTask(subjectName || "");
    setIsAddTaskModalOpen(true);
  };

  // Mata kuliah yang diikuti user
  const mySubjects = availableSubjects.filter(subject => 
    followedSubjects.includes(subject.id)
  ).map(subject => {
    const subjectTasks = tasks.filter(task => task.subject === subject.name);
    return {
      ...subject,
      taskCount: subjectTasks.length,
      completedTasks: subjectTasks.filter(task => task.completed).length
    };
  });

  // Filter tugas hanya dari mata kuliah yang diikuti
  const mySubjectNames = mySubjects.map(subject => subject.name);
  const filteredTasks = selectedSubject 
    ? tasks.filter(task => task.subject === selectedSubject.name)
    : tasks.filter(task => mySubjectNames.includes(task.subject) && !task.completed);

  // Urutkan berdasarkan deadline
  const sortedTasks = filteredTasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  // Data analitik menggunakan semua tugas dari mata kuliah yang diikuti
  const allMyTasks = tasks.filter(task => mySubjectNames.includes(task.subject));
  
  const analyticsData = {
    totalTasks: allMyTasks.length,
    completedTasks: allMyTasks.filter(task => task.completed).length,
    totalSubjects: mySubjects.length,
    overdueTasks: allMyTasks.filter(task => new Date() > task.deadline && !task.completed).length,
    subjectAnalysis: mySubjects.map(subject => ({
      subject: subject.name,
      completion: tasks.filter(task => task.subject === subject.name && task.completed).length,
      total: tasks.filter(task => task.subject === subject.name).length
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Tugas Kuliah
          </h1>
          <p className="text-gray-600">
            Kelola tugas dan mata kuliah Anda dengan mudah
          </p>
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
                <Button onClick={() => handleOpenAddTaskModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tugas
                </Button>
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
                  task={task}
                  onClick={handleTaskClick}
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
                        onAddTask={handleOpenAddTaskModal}
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

              {/* Tombol Daftar Mata Kuliah */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mata Kuliah Tersedia</h2>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAvailableSubjects(!showAvailableSubjects)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {showAvailableSubjects ? "Sembunyikan" : "Daftar Mata Kuliah"}
                  </Button>
                </div>
                
                {showAvailableSubjects && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableSubjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        onClick={() => {}} // Disable click for available subjects
                        isFollowed={followedSubjects.includes(subject.id)}
                        onToggleFollow={handleToggleFollow}
                      />
                    ))}
                  </div>
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
          task={selectedTask}
          open={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdateDeadline={handleUpdateDeadline}
        />

        <AddTaskModal
          open={isAddTaskModalOpen}
          onClose={() => {
            setIsAddTaskModalOpen(false);
            setSelectedSubjectForTask("");
          }}
          onAddTask={handleAddTask}
          followedSubjects={mySubjects}
          preSelectedSubject={selectedSubjectForTask}
        />

      </div>
    </div>
  );
};

export default Index;
