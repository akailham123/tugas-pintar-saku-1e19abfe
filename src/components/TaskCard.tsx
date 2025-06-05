import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  type: string;
  subject: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export const TaskCard = ({ task, onClick, onToggleComplete }: TaskCardProps) => {
  const isOverdue = new Date() > task.deadline && !task.completed;
  const deadlineColor = isOverdue ? "text-red-600" : task.completed ? "text-green-600" : "text-blue-600";

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        task.completed ? "border-green-200 bg-green-50" : isOverdue ? "border-red-200 bg-red-50" : ""
      }`}
      onClick={() => onClick(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </CardTitle>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className="ml-2 hover:scale-110 transition-transform"
          >
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${deadlineColor}`} />
            <span className={`text-sm font-medium ${deadlineColor}`}>
              {format(task.deadline, "dd MMM yyyy", { locale: id })}
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {task.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {task.subject}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};