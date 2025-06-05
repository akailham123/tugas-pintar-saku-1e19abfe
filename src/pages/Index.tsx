import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, BarChart3, List } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { SubjectCard } from "@/components/SubjectCard";
import { AddSubjectModal } from "@/components/AddSubjectModal";
import { AnalyticsCard } from "@/components/AnalyticsCard";

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
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Sample data
  useEffect(() => {
    setSubjects([
      {
        id: "1",
        name: "Pemrograman Web",
        code: "TIF-301",
        semester: "Semester 5",
        taskCount: 3,
        completedTasks: 1
      },
      {
        id: "2", 
        name: "Basis Data",
        code: "TIF-302",
        semester: "Semester 5",
        taskCount: 2,
        completedTasks: 2
      }
    ]);

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

  const handleAddSubject = (subjectData: { name: string; code: string; semester: string }) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      ...subjectData,
      taskCount: 0,
      completedTasks: 0
    };
    setSubjects([...subjects, newSubject]);
  };

  const filteredTasks = selectedSubject 
    ? tasks.filter(task => task.subject === selectedSubject.name)
    : tasks;

  const analyticsData = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    totalSubjects: subjects.length,
    overdueTasks: tasks.filter(task => new Date() > task.deadline && !task.completed).length,
    subjectAnalysis: subjects.map(subject => ({
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
              {selectedSubject && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedSubject(null)}
                >
                  Lihat Semua Tugas
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={handleTaskClick}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>

            {filteredTasks.length === 0 && (
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mata Kuliah Terdaftar</h2>
              <Button onClick={() => setIsAddSubjectModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Daftarkan Mata Kuliah
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={handleSubjectClick}
                />
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Belum ada mata kuliah yang terdaftar
                </p>
                <Button onClick={() => setIsAddSubjectModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Daftarkan Mata Kuliah Pertama
                </Button>
              </div>
            )}
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

        <AddSubjectModal
          open={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          onAdd={handleAddSubject}
        />
      </div>
    </div>
  );
};

export default Index;
