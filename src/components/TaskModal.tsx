import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  type: string;
  subject: string;
  completed: boolean;
}

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdateDeadline: (taskId: string, newDeadline: Date) => void;
}

export const TaskModal = ({ task, open, onClose, onUpdateDeadline }: TaskModalProps) => {
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(task?.deadline);

  if (!task) return null;

  const handleSave = () => {
    if (newDeadline) {
      onUpdateDeadline(task.id, newDeadline);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Jenis Tugas</Label>
              <p className="text-lg">{task.type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Mata Kuliah</Label>
              <p className="text-lg">{task.subject}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Deskripsi</Label>
            <p className="text-gray-700 mt-1">{task.description}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Deadline Saat Ini</Label>
            <p className="text-lg font-semibold text-blue-600">
              {format(task.deadline, "dd MMMM yyyy", { locale: id })}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Perpanjang Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDeadline ? format(newDeadline, "dd MMM yyyy", { locale: id }) : "Pilih tanggal baru"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDeadline}
                  onSelect={setNewDeadline}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};