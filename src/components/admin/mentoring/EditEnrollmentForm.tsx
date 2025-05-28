import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

interface EditEnrollmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onEditSubmit: (data: any) => void;
}

const EditEnrollmentForm: React.FC<EditEnrollmentFormProps> = ({ open, onOpenChange, enrollment, onEditSubmit }) => {
  const [status, setStatus] = useState(enrollment?.status || 'ativa');
  const [responsibleMentor, setResponsibleMentor] = useState(enrollment?.responsibleMentor || '');
  const [startDate, setStartDate] = useState<Date | undefined>(enrollment?.startDate ? new Date(enrollment.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(enrollment?.endDate ? new Date(enrollment.endDate) : undefined);
  const [observations, setObservations] = useState(enrollment?.observations || '');

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }

    const formattedStartDate = format(startDate, 'yyyy-MM-dd', { locale: ptBR });
    const formattedEndDate = format(endDate, 'yyyy-MM-dd', { locale: ptBR });

    const data = {
      ...enrollment,
      status: status,
      responsibleMentor: responsibleMentor,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      observations: observations,
    };

    onEditSubmit(data);
    onOpenChange(false);
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Inscrição</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="responsibleMentor">Mentor Responsável</Label>
              <Input
                id="responsibleMentor"
                value={responsibleMentor}
                onChange={(e) => setResponsibleMentor(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data de Início</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border pl-8 focus:shadow-none"
                />
              </div>
            </div>

            <div>
              <Label>Data de Fim</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border pl-8 focus:shadow-none"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentForm;
