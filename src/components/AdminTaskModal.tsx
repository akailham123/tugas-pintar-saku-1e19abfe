import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  type: string;
  subject_id: string;
  subjects?: Subject;
  completed: boolean;
}

interface AdminTaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onDeleteTask: (taskId: string) => void;
  subjects: Subject[];
}

const taskTypes = [
  "Project",
  "Quiz",
  "UTS",
  "UAS", 
  "Tugas",
  "Praktikum",
  "Presentasi"
];

export const AdminTaskModal = ({ 
  task, 
  open, 
  onClose, 
  onUpdateTask, 
  onDeleteTask, 
  subjects 
}: AdminTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [type, setType] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(new Date(task.deadline));
      setType(task.type);
      setSubjectId(task.subject_id);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    if (!deadline) return;

    onUpdateTask(task.id, {
      title,
      description,
      deadline: deadline.toISOString(),
      type,
      subject_id: subjectId
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Yakin ingin menghapus tugas ini?")) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Tugas (Admin)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul tugas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi tugas"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jenis Tugas</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis tugas" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((taskType) => (
                    <SelectItem key={taskType} value={taskType}>
                      {taskType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mata Kuliah</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata kuliah" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
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
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
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