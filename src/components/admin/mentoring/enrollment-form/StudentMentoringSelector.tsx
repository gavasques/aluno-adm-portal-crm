import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

interface StudentMentoringSelectorProps {
  selectedStudentId: string | null;
  onStudentSelect: (studentId: string) => void;
}

const StudentMentoringSelector: React.FC<StudentMentoringSelectorProps> = ({ selectedStudentId, onStudentSelect }) => {
  const { students, loading } = useActiveStudentsForMentoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(students);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <div>
      <Label htmlFor="student">Selecione o Aluno</Label>
      <Select onValueChange={onStudentSelect} defaultValue={selectedStudentId || ""}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="" disabled>Carregando...</SelectItem>
          ) : (
            filteredStudents.map((student) => (
              <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentMentoringSelector;
