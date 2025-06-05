import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (subject: { name: string; code: string; semester: string }) => void;
}

export const AddSubjectModal = ({ open, onClose, onAdd }: AddSubjectModalProps) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && code && semester) {
      onAdd({ name, code, semester });
      setName("");
      setCode("");
      setSemester("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Daftarkan Mata Kuliah Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Mata Kuliah</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Pemrograman Web"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Kode Mata Kuliah</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="contoh: TIF-101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select value={semester} onValueChange={setSemester} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Semester 3">Semester 3</SelectItem>
                <SelectItem value="Semester 4">Semester 4</SelectItem>
                <SelectItem value="Semester 5">Semester 5</SelectItem>
                <SelectItem value="Semester 6">Semester 6</SelectItem>
                <SelectItem value="Semester 7">Semester 7</SelectItem>
                <SelectItem value="Semester 8">Semester 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Daftarkan Mata Kuliah
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