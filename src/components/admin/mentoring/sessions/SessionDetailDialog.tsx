
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Video, 
  Save,
  FileText,
  MessageSquare,
  Mic,
  Link
} from 'lucide-react';
import { MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionDetailDialogProps {
  session: MentoringSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (sessionId: string, data: any) => void;
}

export const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  session,
  open,
  onOpenChange,
  onUpdate
}) => {
  const [mentorNotes, setMentorNotes] = useState(session?.mentorNotes || '');
  const [observations, setObservations] = useState(session?.observations || '');
  const [transcription, setTranscription] = useState(session?.transcription || '');
  const [meetingLink, setMeetingLink] = useState(session?.meeting_link || session?.meetingLink || '');
  const [recordingLink, setRecordingLink] = useState(session?.recordingLink || '');

  if (!session) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'no_show_aluno': return 'bg-red-100 text-red-800';
      case 'aguardando_agendamento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      case 'no_show_aluno': return 'No-Show';
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      default: return status;
    }
  };

  const handleSave = () => {
    onUpdate(session.id, {
      mentorNotes,
      observations,
      transcription,
      meetingLink,
      recordingLink
    });
    onOpenChange(false);
  };

  const formatSafeDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data não definida';
    }
  };

  const sessionDate = session.scheduled_date || session.scheduledDate;
  const sessionNumber = session.session_number || session.sessionNumber;
  const durationMinutes = session.duration_minutes || session.durationMinutes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {session.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informações da Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Status</Label>
                  <Badge className={`${getStatusColor(session.status)} mt-1`}>
                    {getStatusLabel(session.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Número da Sessão</Label>
                  <p className="font-medium">{sessionNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Duração</Label>
                  <p className="font-medium">{durationMinutes} minutos</p>
                </div>
              </div>
              
              {sessionDate && (
                <div>
                  <Label className="text-xs text-gray-600">Data e Hora Agendada</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatSafeDate(sessionDate)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Abas de Informações */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="transcription" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Transcrição
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Links
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Observações do Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Adicione observações sobre esta sessão..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="min-h-32"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Comentários do Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Adicione comentários sobre o desempenho, tópicos discutidos, etc..."
                    value={mentorNotes}
                    onChange={(e) => setMentorNotes(e.target.value)}
                    className="min-h-32"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Transcrição da Sessão</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Cole aqui a transcrição da sessão ou pontos importantes discutidos..."
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    className="min-h-40"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Link da Reunião</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Link da Gravação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://drive.google.com/file/d/xxx/view"
                      value={recordingLink}
                      onChange={(e) => setRecordingLink(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
