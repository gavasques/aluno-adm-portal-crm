import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface StudentSearchFieldProps {
  selectedStudent: Student | null;
  onStudentSelect: (student: Student) => void;
  onClear: () => void;
}

const StudentSearchField: React.FC<StudentSearchFieldProps> = ({ selectedStudent, onStudentSelect, onClear }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { students, loading } = useActiveStudentsForMentoring();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(value.toLowerCase()) ||
    student.email.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (!open) {
      setValue("")
    }
  }, [open])

  return (
    <div className="grid gap-2">
      <Label htmlFor="student">Aluno</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            id="student"
            placeholder={selectedStudent ? selectedStudent.name : "Selecione um aluno..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="peer h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&:has([data-state=open])]:ring-offset-0"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Buscar aluno..."
              className="h-9"
            />
            <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {filteredStudents.map((student) => (
                  <CommandItem
                    key={student.id}
                    value={student.name}
                    onSelect={() => {
                      onStudentSelect(student);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className="mr-2 h-4 w-4"
                      style={{
                        opacity: selectedStudent?.id === student.id ? 1 : 0,
                      }}
                    />
                    {student.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StudentSearchField;
