
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';

interface MentorObservationsFieldsProps {
  responsibleMentor: string;
  observations: string;
  onMentorChange: (value: string) => void;
  onObservationsChange: (value: string) => void;
}

export const MentorObservationsFields = ({
  responsibleMentor,
  observations,
  onMentorChange,
  onObservationsChange
}: MentorObservationsFieldsProps) => {
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();

  return (
    <>
      <div>
        <Label htmlFor="responsibleMentor">Mentor Responsável *</Label>
        <Select
          value={responsibleMentor}
          onValueChange={onMentorChange}
          disabled={mentorsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
          </SelectTrigger>
          <SelectContent>
            {mentors.map((mentor) => (
              <SelectItem key={mentor.id} value={mentor.name}>
                {mentor.name} ({mentor.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Observações sobre a inscrição..."
          rows={3}
        />
      </div>
    </>
  );
};
