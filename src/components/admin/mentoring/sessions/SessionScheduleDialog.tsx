
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, Clock, Link2, Video, ExternalLink } from 'lucide-react';
import { MentoringSession } from '@/types/mentoring.types';

const scheduleSchema = z.object({
  scheduledDate: z.string().min(1, 'Data é obrigatória'),
  scheduledTime: z.string().min(1, 'Horário é obrigatório'),
  meetingLink: z.string().url('Link deve ser uma URL válida').optional().or(z.literal('')),
  calendlyLink: z.string().url('Link deve ser uma URL válida').optional().or(z.literal('')),
  mentorNotes: z.string().optional()
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface SessionScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: MentoringSession;
  onSchedule: (sessionId: string, data: any) => void;
}

export const SessionScheduleDialog: React.FC<SessionScheduleDialogProps> = ({
  open,
  onOpenChange,
  session,
  onSchedule
}) => {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduledDate: session?.scheduledDate ? new Date(session.scheduledDate).toISOString().split('T')[0] : '',
      scheduledTime: session?.scheduledDate ? new Date(session.scheduledDate).toISOString().split('T')[1].slice(0, 5) : '',
      meetingLink: session?.meetingLink || '',
      calendlyLink: session?.calendlyLink || '',
      mentorNotes: session?.mentorNotes || ''
    }
  });

  const handleSubmit = (data: ScheduleFormData) => {
    if (!session) return;

    const scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
    
    onSchedule(session.id, {
      scheduledDate: scheduledDateTime,
      meetingLink: data.meetingLink || undefined,
      calendlyLink: data.calendlyLink || undefined,
      mentorNotes: data.mentorNotes || undefined,
      status: 'agendada'
    });
    
    onOpenChange(false);
  };

  const openCalendly = () => {
    if (session?.calendlyLink) {
      window.open(session.calendlyLink, '_blank');
    }
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Sessão {session.sessionNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Sessão */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{session.title}</h4>
            <div className="flex items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{session.durationMinutes} minutos</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Sessão {session.sessionNumber}</span>
              </div>
            </div>
          </div>

          {/* Link do Calendly */}
          {session.calendlyLink && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-yellow-900">Agendamento via Calendly</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    O aluno pode agendar diretamente pelo Calendly e depois informar a data aqui.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openCalendly}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Calendly
                </Button>
              </div>
            </div>
          )}

          {/* Formulário */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Sessão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Reunião (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://meet.google.com/..." 
                        {...field}
                        className="pl-10"
                      />
                    </FormControl>
                    <div className="absolute left-3 top-9">
                      <Video className="h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calendlyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Calendly (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://calendly.com/..." 
                        {...field}
                        className="pl-10"
                      />
                    </FormControl>
                    <div className="absolute left-3 top-9">
                      <Link2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentorNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas do Mentor (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre a sessão..."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Agendar Sessão
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
