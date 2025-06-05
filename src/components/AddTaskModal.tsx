import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    deadline: Date;
    type: string;
    subject: string;
  }) => void;
  followedSubjects: Subject[];
  preSelectedSubject?: string; // nama mata kuliah yang sudah dipilih
}

export const AddTaskModal = ({ 
  open, 
  onClose, 
  onAddTask, 
  followedSubjects, 
  preSelectedSubject 
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState(preSelectedSubject || "");

  const handleSave = () => {
    if (title && description && deadline && type && subject) {
      onAddTask({
        title,
        description,
        deadline,
        type,
        subject
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setDeadline(undefined);
      setType("");
      setSubject(preSelectedSubject || "");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Tugas Baru</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Judul Tugas</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul tugas"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi tugas"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Jenis Tugas</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis tugas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tugas">Tugas</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                  <SelectItem value="UTS">UTS</SelectItem>
                  <SelectItem value="UAS">UAS</SelectItem>
                  <SelectItem value="Presentasi">Presentasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Mata Kuliah</Label>
              {preSelectedSubject ? (
                <Input 
                  value={preSelectedSubject} 
                  disabled 
                  className="bg-gray-100"
                />
              ) : (
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata kuliah" />
                  </SelectTrigger>
                  <SelectContent>
                    {followedSubjects.map((subj) => (
                      <SelectItem key={subj.id} value={subj.name}>
                        {subj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Deadline</Label>
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
                  {deadline ? format(deadline, "dd MMM yyyy", { locale: id }) : "Pilih tanggal deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Simpan Tugas
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