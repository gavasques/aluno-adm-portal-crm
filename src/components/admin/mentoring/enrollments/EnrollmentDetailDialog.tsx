
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, DollarSign, User, BookOpen, Calendar, Video, Edit, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { SessionManagementTab } from '../sessions/SessionManagementTab';
import { useMentoring } from '@/hooks/useMentoring';

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
}

export const EnrollmentDetailDialog: React.FC<EnrollmentDetailDialogProps> = ({
  open,
  onOpenChange,
  enrollment
}) => {
  const { getEnrollmentSessions } = useMentoring();
  const [activeTab, setActiveTab] = useState('details');

  if (!enrollment) return null;

  const sessions = getEnrollmentSessions(enrollment.id);
  const progress = enrollment.getEnrollmentProgress ? enrollment.getEnrollmentProgress(enrollment) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateSession = (sessionId: string, data: any) => {
    console.log('Updating session:', sessionId, data);
    // Aqui você implementaria a lógica de atualização
  };

  const handleScheduleSession = (sessionId: string, data: any) => {
    console.log('Scheduling session:', sessionId, data);
    // Aqui você implementaria a lógica de agendamento
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {enrollment.mentoring.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sessões ({sessions.length})
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Materiais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Status e Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Status da Inscrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso:</span>
                    <span className="text-sm">{enrollment.sessionsUsed}/{enrollment.totalSessions} sessões</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informações do Mentor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{enrollment.responsibleMentor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Pagamento: {enrollment.paymentStatus}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Datas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cronograma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Data de Inscrição</div>
                    <div className="font-medium">
                      {format(new Date(enrollment.enrollmentDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Data de Início</div>
                    <div className="font-medium">
                      {format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Data de Término</div>
                    <div className="font-medium">
                      {format(new Date(enrollment.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            {enrollment.observations && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{enrollment.observations}</p>
                </CardContent>
              </Card>
            )}

            {/* Extensões */}
            {enrollment.extensions && enrollment.extensions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Extensões Aplicadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrollment.extensions.map((extension) => (
                      <div key={extension.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">+{extension.extensionMonths} meses</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(extension.appliedDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        {extension.notes && (
                          <p className="text-sm text-gray-600">{extension.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagementTab
              enrollment={enrollment}
              sessions={sessions}
              onUpdateSession={handleUpdateSession}
              onScheduleSession={handleScheduleSession}
            />
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Materiais da Mentoria</h3>
                <p className="text-gray-600">
                  Os materiais e recursos desta mentoria aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
