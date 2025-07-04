import { Task, Subject, AnalyticsData } from "@/types";

export const processSubjectData = (
  allSubjects: Subject[],
  followedSubjects: string[],
  tasks: Task[]
): Subject[] => {
  return allSubjects.filter(subject => 
    followedSubjects.includes(subject.id)
  ).map(subject => {
    const subjectTasks = tasks.filter(task => task.subjects?.name === subject.name);
    return {
      ...subject,
      taskCount: subjectTasks.length,
      completedTasks: subjectTasks.filter(task => task.completed).length
    };
  });
};

export const filterSubjects = (
  allSubjects: Subject[],
  searchQuery: string,
  semesterFilter: string
): Subject[] => {
  return allSubjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === "all" || subject.semester === semesterFilter;
    return matchesSearch && matchesSemester;
  });
};

export const filterTasks = (
  tasks: Task[],
  selectedSubject: Subject | null
): Task[] => {
  const filteredTasks = selectedSubject 
    ? tasks.filter(task => task.subject_id === selectedSubject.id)
    : tasks.filter(task => !task.completed);

  return filteredTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};

export const generateAnalyticsData = (
  tasks: Task[],
  mySubjects: Subject[],
  mySubjectIds: string[]
): AnalyticsData => {
  const allMyTasks = tasks.filter(task => mySubjectIds.includes(task.subject_id));
  
  return {
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
};