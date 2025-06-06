import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onAddSubject: (subjectData: {
    name: string;
    code: string;
    semester: string;
    description: string;
  }) => void;
}

const semesters = [
  "Semester 1",
  "Semester 2", 
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Semester 9",
  "Semester 10"
];

export const AddSubjectModal = ({ open, onClose, onAddSubject }: AddSubjectModalProps) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSubject({
      name,
      code,
      semester,
      description
    });
    
    // Reset form
    setName("");
    setCode("");
    setSemester("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Mata Kuliah Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Mata Kuliah</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pemrograman Web"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Kode Mata Kuliah</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Contoh: TIF-301"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={semester} onValueChange={setSemester} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi mata kuliah"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Mata Kuliah
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};