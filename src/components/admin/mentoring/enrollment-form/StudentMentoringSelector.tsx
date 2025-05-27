
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';

interface StudentMentoringSelectorProps {
  studentId: string;
  mentoringId: string;
  onStudentChange: (value: string) => void;
  onMentoringChange: (value: string) => void;
}

export const StudentMentoringSelector = ({
  studentId,
  mentoringId,
  onStudentChange,
  onMentoringChange
}: StudentMentoringSelectorProps) => {
  const { students, loading: studentsLoading } = useStudentsForEnrollment();
  const { catalogs } = useSupabaseMentoring();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="studentId">Aluno *</Label>
        <Select
          value={studentId}
          onValueChange={onStudentChange}
          disabled={studentsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={studentsLoading ? "Carregando alunos..." : "Selecione um aluno"} />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="mentoringId">Mentoria *</Label>
        <Select
          value={mentoringId}
          onValueChange={onMentoringChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma mentoria" />
          </SelectTrigger>
          <SelectContent>
            {catalogs.map((mentoring) => (
              <SelectItem key={mentoring.id} value={mentoring.id}>
                {mentoring.name} ({mentoring.numberOfSessions} sessões - {mentoring.durationMonths} meses)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
