import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Users,
  AlertCircle,
  Timer,
  Target,
  BookOpen,
  DollarSign,
  FileText,
  Video
} from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SessionsTab } from './sessions/SessionsTab';

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
  if (!enrollment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const progressPercentage = (enrollment.sessionsUsed / enrollment.totalSessions) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Inscrição Individual
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status e Informações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Status da Inscrição
                  </span>
                  <Badge className={`${getStatusColor(enrollment.status)} text-sm`}>
                    {enrollment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Início</p>
                      <p className="font-medium">{formatDate(enrollment.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Fim</p>
                      <p className="font-medium">{formatDate(enrollment.endDate)}</p>
                    </div>
                  </div>
                  {enrollment.hasExtension && enrollment.originalEndDate && (
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Data Original</p>
                        <p className="font-medium">{formatDate(enrollment.originalEndDate)}</p>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs mt-1">
                          Extensão Aplicada
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informações do Aluno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    B
                  </div>
                  <div>
                    <h3 className="font-semibold">Bianca Mentora</h3>
                    <p className="text-sm text-gray-600">bianca.c.arantes@gmail.com</p>
                    <p className="text-xs text-gray-500">ID: {enrollment.studentId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Mentoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Informações da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{enrollment.mentoring.name}</h3>
                  <p className="text-gray-600">{enrollment.mentoring.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <Badge variant="outline">{enrollment.mentoring.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Duração</p>
                      <p className="font-medium">{enrollment.mentoring.durationMonths} {enrollment.mentoring.durationMonths === 1 ? 'mês' : 'meses'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sessões</p>
                      <p className="font-medium">{enrollment.mentoring.numberOfSessions} sessões</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Valor</p>
                      <p className="font-medium">R$ {enrollment.mentoring.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Responsável */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mentor Responsável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {enrollment.responsibleMentor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{enrollment.responsibleMentor}</h3>
                    <p className="text-sm text-gray-600">Mentor responsável pela mentoria</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progresso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progresso da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessões Utilizadas</span>
                  <span className="font-medium">{enrollment.sessionsUsed}/{enrollment.totalSessions}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                  <p className="text-sm text-gray-600">Concluído</p>
                </div>
              </CardContent>
            </Card>

            {/* Extensões */}
            {enrollment.hasExtension && enrollment.extensions && enrollment.extensions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Extensões Aplicadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrollment.extensions.map((extension, index) => (
                      <div key={extension.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Extensão #{index + 1}</p>
                            <p className="text-sm text-gray-600">
                              +{extension.extensionMonths} meses
                            </p>
                            <p className="text-xs text-gray-500">
                              Aplicada em: {formatDate(extension.appliedDate)}
                            </p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            {extension.extensionMonths} meses
                          </Badge>
                        </div>
                        {extension.notes && (
                          <div className="mt-2 pt-2 border-t border-orange-200">
                            <p className="text-sm text-gray-700">{extension.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            {enrollment.observations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{enrollment.observations}</p>
                </CardContent>
              </Card>
            )}

            {/* Informações de Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Criado em:</p>
                    <p className="font-medium">{formatDate(enrollment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Última atualização:</p>
                    <p className="font-medium">{formatDate(enrollment.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ID da Inscrição:</p>
                    <p className="font-mono text-xs">{enrollment.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ID da Mentoria:</p>
                    <p className="font-mono text-xs">{enrollment.mentoringId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsTab 
              enrollment={enrollment}
              sessions={[]}
              onCreateSession={(data) => console.log('Criar sessão:', data)}
              onUpdateSession={(id, data) => console.log('Atualizar sessão:', id, data)}
            />
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Materiais da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum material disponível
                  </h3>
                  <p className="text-gray-500">
                    Os materiais das sessões aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDetailDialog;
