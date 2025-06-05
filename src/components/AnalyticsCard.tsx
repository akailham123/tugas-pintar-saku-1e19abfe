import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Calendar, TrendingUp } from "lucide-react";

interface AnalyticsData {
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

interface AnalyticsCardProps {
  data: AnalyticsData;
}

export const AnalyticsCard = ({ data }: AnalyticsCardProps) => {
  const completionPercentage = data.totalTasks > 0 
    ? Math.round((data.completedTasks / data.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionPercentage}% dari total tugas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Mata kuliah terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tugas melewati deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Penyelesaian Tugas</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
          <p className="text-sm text-gray-600">
            {data.completedTasks} dari {data.totalTasks} tugas telah diselesaikan
          </p>
        </CardContent>
      </Card>

      {/* Subject Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analisis Per Mata Kuliah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.subjectAnalysis.map((subject) => {
              const subjectPercentage = subject.total > 0 
                ? Math.round((subject.completion / subject.total) * 100) 
                : 0;
              
              return (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.subject}</span>
                    <span>{subjectPercentage}%</span>
                  </div>
                  <Progress value={subjectPercentage} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {subject.completion} dari {subject.total} tugas selesai
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};