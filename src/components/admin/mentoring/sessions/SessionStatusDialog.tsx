
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { MentoringSession } from '@/types/mentoring.types';

const statusSchema = z.object({
  status: z.enum([
    'aguardando_agendamento',
    'agendada', 
    'concluida',
    'cancelada',
    'reagendada',
    'no_show_aluno',
    'no_show_mentor'
  ]),
  mentorNotes: z.string().optional(),
  recordingLink: z.string().url('Link deve ser uma URL válida').optional().or(z.literal(''))
});

type StatusFormData = z.infer<typeof statusSchema>;

interface SessionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: MentoringSession;
  onUpdate: (sessionId: string, data: any) => void;
}

export const SessionStatusDialog: React.FC<SessionStatusDialogProps> = ({
  open,
  onOpenChange,
  session,
  onUpdate
}) => {
  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: session?.status || 'aguardando_agendamento',
      mentorNotes: session?.mentorNotes || '',
      recordingLink: session?.recordingLink || ''
    }
  });

  const handleSubmit = (data: StatusFormData) => {
    if (!session) return;

    onUpdate(session.id, {
      status: data.status,
      mentorNotes: data.mentorNotes || undefined,
      recordingLink: data.recordingLink || undefined,
      updatedAt: new Date().toISOString()
    });
    
    onOpenChange(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          label: 'Aguardando Agendamento',
          description: 'Sessão aguardando data para ser agendada'
        };
      case 'agendada':
        return {
          icon: CheckCircle,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          label: 'Agendada',
          description: 'Sessão agendada e confirmada'
        };
      case 'concluida':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          label: 'Concluída',
          description: 'Sessão foi realizada com sucesso'
        };
      case 'cancelada':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          label: 'Cancelada',
          description: 'Sessão foi cancelada'
        };
      case 'reagendada':
        return {
          icon: RotateCcw,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          label: 'Reagendada',
          description: 'Sessão foi reagendada para nova data'
        };
      case 'no_show_aluno':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          label: 'No-show Aluno',
          description: 'Aluno não compareceu à sessão'
        };
      case 'no_show_mentor':
        return {
          icon: AlertCircle,
          color: 'text-purple-600',
          bg: 'bg-purple-100',
          label: 'No-show Mentor',
          description: 'Mentor não compareceu à sessão'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          label: status,
          description: ''
        };
    }
  };

  const statusOptions = [
    'aguardando_agendamento',
    'agendada',
    'concluida',
    'cancelada',
    'reagendada',
    'no_show_aluno',
    'no_show_mentor'
  ];

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Atualizar Status da Sessão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Sessão */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{session.title}</h4>
            <div className="text-sm text-gray-600">
              Sessão {session.sessionNumber} - {session.durationMinutes} minutos
            </div>
          </div>

          {/* Formulário */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da Sessão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => {
                          const info = getStatusInfo(status);
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <info.icon className={`h-4 w-4 ${info.color}`} />
                                <span>{info.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview do Status Selecionado */}
              {form.watch('status') && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  {(() => {
                    const info = getStatusInfo(form.watch('status'));
                    return (
                      <div className="flex items-start gap-2">
                        <info.icon className={`h-5 w-5 ${info.color} mt-0.5`} />
                        <div>
                          <div className="font-medium text-blue-900">{info.label}</div>
                          <div className="text-sm text-blue-700">{info.description}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <FormField
                control={form.control}
                name="mentorNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas do Mentor</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre a sessão, feedback, próximos passos..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('status') === 'concluida' && (
                <FormField
                  control={form.control}
                  name="recordingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link da Gravação (Opcional)</FormLabel>
                      <FormControl>
                        <input 
                          type="url"
                          placeholder="https://drive.google.com/..."
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Atualizar Status
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
