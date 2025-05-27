
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarDays, 
  Clock, 
  Save, 
  X, 
  Plus,
  Calculator,
  FileText
} from 'lucide-react';
import { StudentSearchField } from './StudentSearchField';
import { MentoringSelectionField } from './MentoringSelectionField';
import { MentorSelectionField } from './MentorSelectionField';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';
import { MentoringCatalog } from '@/types/mentoring.types';

interface ModernEnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ModernEnrollmentForm = ({ onSuccess, onCancel }: ModernEnrollmentFormProps) => {
  const { createEnrollment, loading } = useSupabaseMentoring();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedMentoring || !startDate || !selectedMentor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
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

      await createEnrollment(enrollmentData);
      onSuccess?.();
      
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Nova Inscrição Individual
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Crie uma nova inscrição para mentoria individual
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              1. Seleção do Aluno
            </h3>
            <StudentSearchField
              selectedStudent={selectedStudent}
              onStudentSelect={setSelectedStudent}
            />
          </div>

          <Separator />

          {/* Mentoring Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              2. Seleção da Mentoria
            </h3>
            <MentoringSelectionField
              selectedMentoring={selectedMentoring}
              selectedExtensions={selectedExtensions}
              onMentoringSelect={setSelectedMentoring}
              onExtensionToggle={handleExtensionToggle}
            />
          </div>

          <Separator />

          {/* Mentor Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              3. Mentor Responsável
            </h3>
            <MentorSelectionField
              selectedMentor={selectedMentor}
              onMentorSelect={setSelectedMentor}
            />
          </div>

          <Separator />

          {/* Dates and Sessions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              4. Configurações da Inscrição
            </h3>
            
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
                <p className="text-xs text-gray-500">
                  Calculado automaticamente baseado na duração da mentoria e extensões
                </p>
              </div>
            </div>

            {/* Sessions Summary */}
            {selectedMentoring && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Sessões Contratadas:</span>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {calculateTotalSessions()} sessões
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>{selectedMentoring.numberOfSessions} sessões base</span>
                    {selectedExtensions.length > 0 && (
                      <span> + {calculateTotalSessions() - selectedMentoring.numberOfSessions} sessões de extensão</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Observations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              5. Observações (Opcional)
            </h3>
            <div className="space-y-2">
              <Label htmlFor="observations" className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2" />
                Observações Gerais
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
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              type="submit"
              disabled={loading || !selectedStudent || !selectedMentoring || !startDate || !selectedMentor}
              className="px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Criando...' : 'Criar Inscrição'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
