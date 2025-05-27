
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  CalendarDays, 
  Clock, 
  DollarSign, 
  User, 
  BookOpen, 
  Edit, 
  Save,
  Plus,
  Calculator
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentInfoTabProps {
  enrollment: StudentMentoringEnrollment;
  onSave: (data: any) => void;
}

type StatusType = 'ativa' | 'concluida' | 'cancelada' | 'pausada';

export const EnrollmentInfoTab: React.FC<EnrollmentInfoTabProps> = ({
  enrollment,
  onSave
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    responsibleMentor: enrollment.responsibleMentor,
    status: enrollment.status as StatusType,
    startDate: enrollment.startDate,
    observations: enrollment.observations || ''
  });

  console.log('EnrollmentInfoTab - enrollment status:', enrollment.status, 'editData status:', editData.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
    toast({
      title: "Sucesso",
      description: "Informações da inscrição atualizadas com sucesso!",
    });
  };

  const handleAddExtension = () => {
    // Calcular sessões baseado na frequência
    let additionalSessions = 0;
    const frequency = enrollment.mentoring.frequency;
    
    switch (frequency) {
      case 'Semanal':
        additionalSessions = 4; // 4 sessões por mês
        break;
      case 'Quinzenal':
        additionalSessions = 2; // 2 sessões por mês
        break;
      case 'Mensal':
        additionalSessions = 1; // 1 sessão por mês
        break;
    }

    const extensionData = {
      enrollmentId: enrollment.id,
      extensionMonths: 1,
      additionalSessions,
      notes: 'Extensão manual adicionada'
    };

    console.log('Adicionando extensão:', extensionData);
    toast({
      title: "Extensão Adicionada",
      description: `+1 mês e +${additionalSessions} sessões adicionadas com sucesso!`,
    });
  };

  // Função para obter o nome do aluno
  const getStudentName = (studentId: string) => {
    return `Aluno ${studentId.slice(-8)}`;
  };

  const handleStatusChange = (value: string) => {
    console.log('Status change:', value);
    setEditData(prev => ({ ...prev, status: value as StatusType }));
  };

  // Garantir que status nunca seja vazio
  const safeStatusValue = editData.status || "ativa";

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Informações Gerais</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddExtension}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar +1 Mês
          </Button>
          {isEditing ? (
            <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Aluno */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Aluno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nome:</span>
              <span className="font-medium">{getStudentName(enrollment.studentId)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">ID:</span>
              <span className="text-sm text-gray-500 font-mono">{enrollment.studentId.slice(-12)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Mentoria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nome:</span>
              <span className="font-medium">{enrollment.mentoring.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Tipo:</span>
              <Badge variant="outline">{enrollment.mentoring.type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Frequência:</span>
              <span className="text-sm">{enrollment.mentoring.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Duração:</span>
              <span className="text-sm">{enrollment.mentoring.durationMonths} meses</span>
            </div>
          </CardContent>
        </Card>

        {/* Status e Mentor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Mentor e Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mentor">Mentor Responsável</Label>
                  <Input
                    id="mentor"
                    value={editData.responsibleMentor}
                    onChange={(e) => setEditData(prev => ({ ...prev, responsibleMentor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={safeStatusValue} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Mentor:</span>
                  <span className="font-medium">{enrollment.responsibleMentor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge className={getStatusColor(enrollment.status)}>
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                  </Badge>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Pagamento:</span>
              <Badge variant="outline">{enrollment.paymentStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Datas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Inscrição:</span>
              <span className="text-sm">{format(new Date(enrollment.enrollmentDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            {isEditing ? (
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Início:</span>
                <span className="text-sm">{format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Término:</span>
              <span className="text-sm">{format(new Date(enrollment.endDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso das Sessões */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Progresso das Sessões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Sessões Utilizadas</div>
              <div className="text-2xl font-bold text-blue-600">{enrollment.sessionsUsed}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CalendarDays className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total de Sessões</div>
              <div className="text-2xl font-bold text-green-600">{enrollment.totalSessions}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calculator className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Sessões Restantes</div>
              <div className="text-2xl font-bold text-orange-600">
                {enrollment.totalSessions - enrollment.sessionsUsed}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span>{Math.round((enrollment.sessionsUsed / enrollment.totalSessions) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              placeholder="Digite observações sobre esta inscrição..."
              value={editData.observations}
              onChange={(e) => setEditData(prev => ({ ...prev, observations: e.target.value }))}
              rows={4}
            />
          ) : (
            <div className="text-sm text-gray-700">
              {enrollment.observations || 'Nenhuma observação registrada.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
