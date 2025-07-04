export interface Task {
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

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
  description?: string;
  taskCount?: number;
  completedTasks?: number;
}

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  totalSubjects: number;
  overdueTasks: number;
  subjectAnalysis: {
    subject: string;
    completion: number;
    total: number;
  }[];
}