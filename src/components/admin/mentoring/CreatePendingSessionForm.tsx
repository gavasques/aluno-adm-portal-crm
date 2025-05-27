
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface CreatePendingSessionFormProps {
  enrollment: StudentMentoringEnrollment;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  sessionNumber: number;
}

const CreatePendingSessionForm = ({ 
  enrollment, 
  onSubmit, 
  onCancel, 
  isLoading,
  sessionNumber 
}: CreatePendingSessionFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: `Sessão ${sessionNumber} - ${enrollment.mentoring.name}`,
      durationMinutes: 60,
      observations: ''
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      enrollmentId: enrollment.id,
      type: 'individual',
      status: 'aguardando_agendamento',
      sessionNumber
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título da Sessão</Label>
        <Input
          id="title"
          {...register('title', { required: 'Título é obrigatório' })}
          placeholder="Ex: Sessão 1 - Mentoria Titan"
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="durationMinutes">Duração (minutos)</Label>
        <Input
          id="durationMinutes"
          type="number"
          {...register('durationMinutes', { 
            required: 'Duração é obrigatória',
            min: { value: 15, message: 'Duração mínima de 15 minutos' },
            max: { value: 180, message: 'Duração máxima de 180 minutos' }
          })}
          placeholder="60"
        />
        {errors.durationMinutes && (
          <p className="text-sm text-red-600 mt-1">{errors.durationMinutes.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="observations">Observações (opcional)</Label>
        <Textarea
          id="observations"
          {...register('observations')}
          placeholder="Informações adicionais sobre a sessão..."
          rows={3}
        />
      </div>

      <div className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p><strong>Sessão:</strong> {sessionNumber} de {enrollment.totalSessions}</p>
        <p><strong>Aluno:</strong> {enrollment.studentId}</p>
        <p><strong>Mentor:</strong> {enrollment.responsibleMentor}</p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Criando...' : 'Criar Sessão'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePendingSessionForm;
