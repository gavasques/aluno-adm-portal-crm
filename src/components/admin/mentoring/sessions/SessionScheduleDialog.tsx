
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Clock, Calendar as CalendarLucide, AlertTriangle, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendlyButton } from '@/components/calendly/CalendlyButton';
import { CalendlyEventPayload } from '@/types/calendly.types';
import { CalendlyIndicator } from '../CalendlyIndicator';

interface SessionScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  onSchedule: (data: { scheduledDate: string; meetingLink?: string; notes?: string }) => void;
}

export const SessionScheduleDialog = ({ open, onOpenChange, session, onSchedule }: SessionScheduleDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendlyError, setCalendlyError] = useState(false);

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return;

    const scheduledDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`;
    
    onSchedule({
      scheduledDate: scheduledDateTime,
      meetingLink: meetingLink || undefined,
      notes: notes || undefined
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setMeetingLink('');
    setNotes('');
    onOpenChange(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleCalendlyEventScheduled = (eventData: CalendlyEventPayload) => {
    // Quando um evento é agendado via Calendly, fechamos o dialog
    onOpenChange(false);
  };

  if (!session) return null;

  // Para fins de exemplo, usando um ID fixo de mentor
  // Em uma implementação real, isso viria da sessão ou do enrollment
  const mentorId = session.enrollment?.responsibleMentor || 'mentor-id-example';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Sessão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Sessão</h4>
            <p className="text-sm text-gray-900">{session.title}</p>
          </div>

          {/* Indicador do Calendly */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <CalendlyIndicator 
              mentorId={mentorId} 
              showConfigButton={false}
            />
          </div>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Agendamento Manual</TabsTrigger>
              <TabsTrigger value="calendly">Via Calendly</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div>
                <Label>Data da Sessão</Label>
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meetingLink">Link da Reunião (opcional)</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre esta sessão..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime}
                >
                  Agendar Sessão
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="calendly" className="space-y-4 mt-4">
              <div className="text-center space-y-4">
                <Alert className="text-left">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Para usar o Calendly, é necessário que o mentor tenha uma configuração ativa. 
                    Configure o Calendly em: <strong>Menu → Configurações Calendly</strong>
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <CalendarLucide className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 mb-1">Agendar via Calendly</h3>
                  <p className="text-sm text-gray-600">
                    Use o Calendly para ver horários disponíveis e agendar automaticamente.
                  </p>
                </div>

                <div className="space-y-2">
                  <CalendlyButton
                    mentorId={mentorId}
                    onEventScheduled={handleCalendlyEventScheduled}
                    className="w-full"
                  >
                    Abrir Calendly
                  </CalendlyButton>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/admin/calendly-config', '_blank')}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar Calendly
                  </Button>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
