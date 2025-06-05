import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, UserPlus, UserMinus, Plus } from "lucide-react";

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
  isFollowed?: boolean;
  onToggleFollow?: (subjectId: string) => void;
  onAddTask?: (subjectName: string) => void;
}

export const SubjectCard = ({ subject, onClick, isFollowed, onToggleFollow, onAddTask }: SubjectCardProps) => {
  const completionPercentage = subject.taskCount > 0 
    ? Math.round((subject.completedTasks / subject.taskCount) * 100) 
    : 0;

  const handleCardClick = () => {
    if (isFollowed && onClick) {
      onClick(subject);
    }
  };

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(subject.id);
    }
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddTask) {
      onAddTask(subject.name);
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        isFollowed ? "cursor-pointer hover:scale-[1.02]" : ""
      } ${isFollowed ? "border-blue-200 bg-blue-50" : ""}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{subject.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{subject.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {onToggleFollow && (
              <Button
                variant={isFollowed ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleFollow}
                className="ml-2"
              >
                {isFollowed ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-1" />
                    Batal
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Ikuti
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">
            {subject.semester}
          </Badge>
          
          {isFollowed && (
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
              
              {onAddTask && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddTask}
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Tugas
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};