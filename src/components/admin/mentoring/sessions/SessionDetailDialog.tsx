
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap, 
  Play,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionDetailDialogProps {
  session: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sessionData: any) => void;
  isAdmin: boolean;
}

export const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  session,
  open,
  onOpenChange,
  onSave,
  isAdmin
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: session?.title || '',
    scheduledDate: session?.scheduledDate ? format(new Date(session.scheduledDate), 'yyyy-MM-dd') : '',
    scheduledTime: session?.scheduledDate ? format(new Date(session.scheduledDate), 'HH:mm') : '',
    durationMinutes: session?.durationMinutes || 60,
    accessLink: session?.accessLink || '',
    status: session?.status || 'agendada',
    mentorNotes: session?.mentorNotes || '',
    studentNotes: session?.studentNotes || ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ausente_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ausente_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'ausente_aluno': return 'Ausente - Aluno';
      case 'ausente_mentor': return 'Ausente - Mentor';
      default: return status;
    }
  };

  const handleSave = () => {
    const updatedSession = {
      ...session,
      ...formData,
      scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}:00`
    };
    onSave(updatedSession);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: session?.title || '',
      scheduledDate: session?.scheduledDate ? format(new Date(session.scheduledDate), 'yyyy-MM-dd') : '',
      scheduledTime: session?.scheduledDate ? format(new Date(session.scheduledDate), 'HH:mm') : '',
      durationMinutes: session?.durationMinutes || 60,
      accessLink: session?.accessLink || '',
      status: session?.status || 'agendada',
      mentorNotes: session?.mentorNotes || '',
      studentNotes: session?.studentNotes || ''
    });
    setIsEditing(false);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Detalhes da Sessão
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Mentoria</Label>
                <div className="mt-1">
                  <div className="font-medium">{session.mentoringName}</div>
                  <div className="text-sm text-gray-500">
                    Sessão {session.sessionNumber}/{session.totalSessions} • {session.type}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Participantes</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium">Aluno:</span>
                      <span className="text-sm text-gray-600 ml-2">{session.studentName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium">Mentor:</span>
                      <span className="text-sm text-gray-600 ml-2">{session.mentorName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <div className="mt-1">
                  {isEditing ? (
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agendada">Agendada</SelectItem>
                        <SelectItem value="realizada">Realizada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                        <SelectItem value="reagendada">Reagendada</SelectItem>
                        <SelectItem value="ausente_aluno">Ausente - Aluno</SelectItem>
                        <SelectItem value="ausente_mentor">Ausente - Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {session.accessLink && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Link de Acesso</Label>
                  <div className="mt-1">
                    {session.status === 'agendada' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(session.accessLink, '_blank')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Entrar na Sessão
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(session.accessLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Link
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Agendamento */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Agendamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="scheduledDate">Data</Label>
                {isEditing ? (
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{format(new Date(session.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="scheduledTime">Horário</Label>
                {isEditing ? (
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{format(new Date(session.scheduledDate), 'HH:mm', { locale: ptBR })}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                {isEditing ? (
                  <Input
                    id="duration"
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
                  />
                ) : (
                  <div className="mt-1">
                    <span>{session.durationMinutes} minutos</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <>
              <Separator />
              <div>
                <Label htmlFor="accessLink">Link de Acesso</Label>
                <Input
                  id="accessLink"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.accessLink}
                  onChange={(e) => setFormData({...formData, accessLink: e.target.value})}
                />
              </div>
            </>
          )}

          <Separator />

          {/* Observações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mentorNotes">Observações do Mentor</Label>
              {isEditing ? (
                <Textarea
                  id="mentorNotes"
                  placeholder="Observações do mentor sobre a sessão..."
                  value={formData.mentorNotes}
                  onChange={(e) => setFormData({...formData, mentorNotes: e.target.value})}
                  rows={4}
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                  {session.mentorNotes || 'Nenhuma observação registrada'}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="studentNotes">Observações do Aluno</Label>
              {isEditing ? (
                <Textarea
                  id="studentNotes"
                  placeholder="Observações do aluno sobre a sessão..."
                  value={formData.studentNotes}
                  onChange={(e) => setFormData({...formData, studentNotes: e.target.value})}
                  rows={4}
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                  {session.studentNotes || 'Nenhuma observação registrada'}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
