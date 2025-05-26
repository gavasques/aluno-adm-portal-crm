
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useMentoring } from '@/hooks/useMentoring';

interface StandaloneSessionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const StandaloneSessionForm = ({ onSubmit, onCancel, initialData }: StandaloneSessionFormProps) => {
  const { enrollments } = useMentoring();
  const [formData, setFormData] = useState({
    enrollmentId: initialData?.enrollmentId || '',
    type: initialData?.type || 'individual',
    title: initialData?.title || '',
    scheduledDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate) : undefined,
    scheduledTime: initialData?.scheduledTime || '',
    durationMinutes: initialData?.durationMinutes || 60,
    meetingLink: initialData?.meetingLink || '',
    groupId: initialData?.groupId || undefined
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (formData.enrollmentId && !initialData) {
      const enrollment = enrollments.find(e => e.id === formData.enrollmentId);
      if (enrollment) {
        const sessionCount = enrollments.filter(e => e.id === formData.enrollmentId).length;
        setFormData(prev => ({
          ...prev,
          title: `Sessão ${sessionCount + 1} - ${enrollment.mentoring.name}`
        }));
      }
    }
  }, [formData.enrollmentId, enrollments, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasScheduledDateTime = formData.scheduledDate && formData.scheduledTime;
    
    const submitData = {
      ...formData,
      scheduledDate: hasScheduledDateTime 
        ? `${format(formData.scheduledDate!, 'yyyy-MM-dd')}T${formData.scheduledTime}:00`
        : undefined,
      status: hasScheduledDateTime ? 'agendada' : 'aguardando_agendamento'
    };
    
    onSubmit(submitData);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, scheduledDate: date }));
    setShowDatePicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="enrollmentId">Inscrição</Label>
        <Select
          value={formData.enrollmentId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, enrollmentId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma inscrição" />
          </SelectTrigger>
          <SelectContent>
            {enrollments.map((enrollment) => (
              <SelectItem key={enrollment.id} value={enrollment.id}>
                {enrollment.mentoring.name} - {enrollment.studentId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Data da Sessão (opcional)</Label>
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.scheduledDate ? (
                  format(formData.scheduledDate, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  <span>Selecionar data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.scheduledDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="scheduledTime">Horário (opcional)</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="scheduledTime"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="durationMinutes">Duração (minutos)</Label>
        <Input
          id="durationMinutes"
          type="number"
          value={formData.durationMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
          min="15"
          max="240"
          step="15"
        />
      </div>

      <div>
        <Label htmlFor="meetingLink">Link da Reunião (opcional)</Label>
        <Input
          id="meetingLink"
          type="url"
          value={formData.meetingLink}
          onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
          placeholder="https://meet.google.com/..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar Sessão' : 'Criar Sessão'}
        </Button>
      </div>
    </form>
  );
};

export default StandaloneSessionForm;
