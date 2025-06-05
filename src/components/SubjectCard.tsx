import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
  taskCount: number;
  completedTasks: number;
}

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

export const SubjectCard = ({ subject, onClick }: SubjectCardProps) => {
  const completionPercentage = subject.taskCount > 0 
    ? Math.round((subject.completedTasks / subject.taskCount) * 100) 
    : 0;

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
      onClick={() => onClick(subject)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{subject.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{subject.code}</p>
          </div>
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">
            {subject.semester}
          </Badge>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress Tugas</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {subject.completedTasks} dari {subject.taskCount} tugas selesai
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};