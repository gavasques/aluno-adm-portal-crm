
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface CreatePendingSessionFormProps {
  enrollment: StudentMentoringEnrollment;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CreatePendingSessionForm = ({ enrollment, onSubmit, onCancel, isLoading }: CreatePendingSessionFormProps) => {
  const [formData, setFormData] = useState({
    title: `Sessão ${enrollment.sessionsUsed + 1} - ${enrollment.mentoring.name}`,
    durationMinutes: 60,
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      enrollmentId: enrollment.id,
      type: 'individual' as const,
      title: formData.title,
      durationMinutes: formData.durationMinutes,
      observations: formData.observations,
      status: 'aguardando_agendamento'
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="enrollment">Inscrição</Label>
        <Input
          value={`${enrollment.mentoring.name} - ${enrollment.studentId}`}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div>
        <Label htmlFor="title">Título da Sessão</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Digite o título da sessão"
          required
        />
      </div>

      <div>
        <Label htmlFor="durationMinutes">Duração (minutos)</Label>
        <Select
          value={formData.durationMinutes.toString()}
          onValueChange={(value) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutos</SelectItem>
            <SelectItem value="45">45 minutos</SelectItem>
            <SelectItem value="60">60 minutos</SelectItem>
            <SelectItem value="90">90 minutos</SelectItem>
            <SelectItem value="120">120 minutos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="observations">Observações (opcional)</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
          placeholder="Observações sobre a sessão..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Sessão Pendente'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePendingSessionForm;
