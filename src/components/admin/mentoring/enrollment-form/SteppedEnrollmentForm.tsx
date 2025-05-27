
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Clock, 
  Save, 
  X, 
  Plus,
  Calculator,
  FileText,
  User,
  GraduationCap,
  UserCheck,
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { StudentSearchField } from './StudentSearchField';
import { MentoringSelectionField } from './MentoringSelectionField';
import { MentorSelectionField } from './MentorSelectionField';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';
import { MentoringCatalog } from '@/types/mentoring.types';

interface SteppedEnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SteppedEnrollmentForm = ({ onSuccess, onCancel }: SteppedEnrollmentFormProps) => {
  const { createEnrollment, loading } = useSupabaseMentoring();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('student');

  // Form state
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedMentoring, setSelectedMentoring] = useState<MentoringCatalog | null>(null);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [observations, setObservations] = useState('');

  // Calculate end date and total sessions
  const calculateEndDate = () => {
    if (!startDate || !selectedMentoring) return '';
    
    const start = new Date(startDate);
    let totalMonths = selectedMentoring.durationMonths;
    
    // Add extension months
    if (selectedMentoring.extensions && selectedExtensions.length > 0) {
      selectedExtensions.forEach(extId => {
        const extension = selectedMentoring.extensions?.find(ext => ext.id === extId);
        if (extension) {
          totalMonths += extension.months;
        }
      });
    }
    
    const end = new Date(start);
    end.setMonth(end.getMonth() + totalMonths);
    
    return end.toISOString().split('T')[0];
  };

  const calculateTotalSessions = () => {
    if (!selectedMentoring) return 0;
    
    let totalSessions = selectedMentoring.numberOfSessions;
    
    // Add extension sessions
    if (selectedMentoring.extensions && selectedExtensions.length > 0) {
      selectedExtensions.forEach(extId => {
        const extension = selectedMentoring.extensions?.find(ext => ext.id === extId);
        if (extension) {
          totalSessions += extension.totalSessions || 0;
        }
      });
    }
    
    return totalSessions;
  };

  // Update end date when dependencies change
  useEffect(() => {
    const newEndDate = calculateEndDate();
    setEndDate(newEndDate);
  }, [startDate, selectedMentoring, selectedExtensions]);

  // Reset extensions when mentoring changes
  useEffect(() => {
    setSelectedExtensions([]);
  }, [selectedMentoring]);

  const handleExtensionToggle = (extensionId: string, checked: boolean) => {
    if (checked) {
      setSelectedExtensions(prev => [...prev, extensionId]);
    } else {
      setSelectedExtensions(prev => prev.filter(id => id !== extensionId));
    }
  };

  const handleNextStep = () => {
    if (activeTab === 'student' && selectedStudent) {
      setActiveTab('mentoring');
    } else if (activeTab === 'mentoring' && selectedMentoring) {
      setActiveTab('mentor');
    } else if (activeTab === 'mentor' && selectedMentor) {
      setActiveTab('config');
    } else if (activeTab === 'config' && startDate) {
      setActiveTab('review');
    }
  };

  const canProceedToNext = () => {
    switch (activeTab) {
      case 'student':
        return !!selectedStudent;
      case 'mentoring':
        return !!selectedMentoring;
      case 'mentor':
        return !!selectedMentor;
      case 'config':
        return !!startDate;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedMentoring || !startDate || !selectedMentor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚀 Iniciando criação de inscrição...');
      
      const enrollmentData = {
        studentId: selectedStudent.id,
        mentoringId: selectedMentoring.id,
        status: 'ativa',
        enrollmentDate,
        startDate,
        endDate,
        totalSessions: calculateTotalSessions(),
        responsibleMentor: selectedMentor.name,
        paymentStatus: 'pendente',
        observations: observations || undefined
      };

      console.log('📊 Dados da inscrição:', enrollmentData);
      
      await createEnrollment(enrollmentData);
      
      console.log('✅ Inscrição criada com sucesso, chamando callback...');
      
      // Chama o callback de sucesso para fechar o formulário e atualizar a lista
      if (onSuccess) {
        console.log('🔄 Executando callback onSuccess...');
        onSuccess();
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar inscrição:', error);
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'student':
        return selectedStudent ? <CheckCircle className="w-4 h-4 text-green-600" /> : <User className="w-4 h-4" />;
      case 'mentoring':
        return selectedMentoring ? <CheckCircle className="w-4 h-4 text-green-600" /> : <GraduationCap className="w-4 h-4" />;
      case 'mentor':
        return selectedMentor ? <CheckCircle className="w-4 h-4 text-green-600" /> : <UserCheck className="w-4 h-4" />;
      case 'config':
        return startDate ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Settings className="w-4 h-4" />;
      case 'review':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Nova Inscrição Individual
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Siga as etapas para criar uma nova inscrição de mentoria individual
        </p>
      </CardHeader>

      <CardContent className="p-6 overflow-visible">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="student" className="flex items-center gap-2">
              {getStepIcon('student')}
              <span className="hidden sm:inline">Aluno</span>
            </TabsTrigger>
            <TabsTrigger value="mentoring" className="flex items-center gap-2" disabled={!selectedStudent}>
              {getStepIcon('mentoring')}
              <span className="hidden sm:inline">Mentoria</span>
            </TabsTrigger>
            <TabsTrigger value="mentor" className="flex items-center gap-2" disabled={!selectedMentoring}>
              {getStepIcon('mentor')}
              <span className="hidden sm:inline">Mentor</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2" disabled={!selectedMentor}>
              {getStepIcon('config')}
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2" disabled={!startDate}>
              {getStepIcon('review')}
              <span className="hidden sm:inline">Revisão</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px] overflow-visible relative">
            <TabsContent value="student" className="space-y-6 mt-0">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Selecione o Aluno</h3>
                <p className="text-sm text-gray-600">Busque e selecione o aluno que será inscrito na mentoria</p>
              </div>
              <StudentSearchField
                selectedStudent={selectedStudent}
                onStudentSelect={setSelectedStudent}
              />
              {canProceedToNext() && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Próximo: Mentoria <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentoring" className="space-y-6 mt-0 overflow-visible">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Selecione a Mentoria</h3>
                <p className="text-sm text-gray-600">Escolha a mentoria e extensões se necessário</p>
              </div>
              <MentoringSelectionField
                selectedMentoring={selectedMentoring}
                selectedExtensions={selectedExtensions}
                onMentoringSelect={setSelectedMentoring}
                onExtensionToggle={handleExtensionToggle}
              />
              {canProceedToNext() && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Próximo: Mentor <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentor" className="space-y-6 mt-0 overflow-visible">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Selecione o Mentor</h3>
                <p className="text-sm text-gray-600">Escolha o mentor responsável por esta mentoria</p>
              </div>
              <MentorSelectionField
                selectedMentor={selectedMentor}
                onMentorSelect={setSelectedMentor}
              />
              {canProceedToNext() && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Próximo: Configurações <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-6 mt-0">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configurações da Inscrição</h3>
                <p className="text-sm text-gray-600">Defina as datas e observações</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate" className="flex items-center text-sm font-medium text-gray-700">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Data de Inscrição
                  </Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={enrollmentDate}
                    onChange={(e) => setEnrollmentDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Data de Início *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center text-sm font-medium text-gray-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Data de Término
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    readOnly
                    className="w-full bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations" className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Observações
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Digite observações ou comentários sobre esta inscrição..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              {canProceedToNext() && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Próximo: Revisão <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="review" className="space-y-6 mt-0">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revisão da Inscrição</h3>
                <p className="text-sm text-gray-600">Confira todos os dados antes de finalizar</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Aluno Selecionado</h4>
                    <p className="font-medium">{selectedStudent?.name}</p>
                    <p className="text-sm text-blue-700">{selectedStudent?.email}</p>
                  </CardContent>
                </Card>

                {/* Mentoring Info */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Mentoria</h4>
                    <p className="font-medium">{selectedMentoring?.name}</p>
                    <div className="flex items-center gap-4 text-sm text-green-700 mt-2">
                      <span>{selectedMentoring?.numberOfSessions} sessões</span>
                      <span>{selectedMentoring?.durationMonths} meses</span>
                      <span>R$ {selectedMentoring?.price}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Mentor Info */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Mentor Responsável</h4>
                    <p className="font-medium">{selectedMentor?.name}</p>
                    <p className="text-sm text-purple-700">{selectedMentor?.email}</p>
                  </CardContent>
                </Card>

                {/* Session Summary */}
                <Card className="border-gray-200 bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Resumo das Sessões</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total de Sessões:</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {calculateTotalSessions()} sessões
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span>{selectedMentoring?.numberOfSessions} sessões base</span>
                      {selectedExtensions.length > 0 && (
                        <span> + {calculateTotalSessions() - selectedMentoring!.numberOfSessions} de extensão</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="flex justify-between space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Criando...' : 'Criar Inscrição'}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
