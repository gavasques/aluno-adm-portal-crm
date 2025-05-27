import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EnrollmentForm = ({ onSuccess, onCancel }: EnrollmentFormProps) => {
  const { catalogs, createEnrollment, loading } = useSupabaseMentoring();
  const { students, loading: studentsLoading } = useStudentsForEnrollment();
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    studentId: '',
    mentoringId: '',
    status: 'ativa',
    enrollmentDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    responsibleMentor: '',
    paymentStatus: 'pendente',
    observations: '',
    selectedExtensions: [] as string[]
  });

  const selectedMentoring = catalogs.find(c => c.id === formData.mentoringId);

  const calculateEndDate = (startDate: string, mentoringId: string, extensions: string[] = []) => {
    if (!startDate || !mentoringId) return '';
    
    const mentoring = catalogs.find(c => c.id === mentoringId);
    if (!mentoring) return '';
    
    const start = new Date(startDate);
    const end = new Date(start);
    
    // Duração base da mentoria
    let totalMonths = mentoring.durationMonths;
    
    // Adicionar meses das extensões selecionadas
    if (mentoring.extensions && extensions.length > 0) {
      extensions.forEach(extId => {
        const extension = mentoring.extensions?.find(ext => ext.id === extId);
        if (extension) {
          totalMonths += extension.months;
        }
      });
    }
    
    end.setMonth(end.getMonth() + totalMonths);
    return end.toISOString().split('T')[0];
  };

  const calculateTotalSessions = (mentoringId: string, extensions: string[] = []) => {
    const mentoring = catalogs.find(c => c.id === mentoringId);
    if (!mentoring) return 0;
    
    let totalSessions = mentoring.numberOfSessions;
    
    if (mentoring.extensions && extensions.length > 0) {
      extensions.forEach(extId => {
        const extension = mentoring.extensions?.find(ext => ext.id === extId);
        if (extension) {
          totalSessions += extension.totalSessions || 0;
        }
      });
    }
    
    return totalSessions;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate end date when start date, mentoring or extensions change
      if (field === 'startDate' || field === 'mentoringId' || field === 'selectedExtensions') {
        const endDate = calculateEndDate(
          field === 'startDate' ? value as string : updated.startDate,
          field === 'mentoringId' ? value as string : updated.mentoringId,
          field === 'selectedExtensions' ? value as string[] : updated.selectedExtensions
        );
        updated.endDate = endDate;
      }
      
      // Reset extensions when mentoring changes
      if (field === 'mentoringId') {
        updated.selectedExtensions = [];
      }
      
      return updated;
    });
  };

  const handleExtensionToggle = (extensionId: string, checked: boolean) => {
    const newExtensions = checked 
      ? [...formData.selectedExtensions, extensionId]
      : formData.selectedExtensions.filter(id => id !== extensionId);
    
    handleInputChange('selectedExtensions', newExtensions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando submissão do formulário...');
    console.log('📊 Dados do formulário:', formData);
    
    // Validação básica
    if (!formData.studentId || !formData.mentoringId || !formData.startDate || !formData.responsibleMentor) {
      console.log('❌ Validação falhou - campos obrigatórios faltando');
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedMentoring = catalogs.find(c => c.id === formData.mentoringId);
      if (!selectedMentoring) {
        console.log('❌ Mentoria não encontrada no catálogo');
        toast({
          title: "Erro",
          description: "Mentoria selecionada não encontrada",
          variant: "destructive",
        });
        return;
      }

      const totalSessions = calculateTotalSessions(formData.mentoringId, formData.selectedExtensions);
      
      console.log('📈 Sessões calculadas:', totalSessions);
      console.log('📅 Data de término calculada:', formData.endDate);

      const enrollmentPayload = {
        studentId: formData.studentId,
        mentoringId: formData.mentoringId,
        status: formData.status,
        enrollmentDate: formData.enrollmentDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalSessions: totalSessions,
        responsibleMentor: formData.responsibleMentor,
        paymentStatus: formData.paymentStatus,
        observations: formData.observations || undefined
      };

      console.log('📦 Payload final:', enrollmentPayload);

      const newEnrollment = await createEnrollment(enrollmentPayload);
      
      console.log('✅ Inscrição criada com sucesso:', newEnrollment);

      // Reset form
      setFormData({
        studentId: '',
        mentoringId: '',
        status: 'ativa',
        enrollmentDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        responsibleMentor: '',
        paymentStatus: 'pendente',
        observations: '',
        selectedExtensions: []
      });

      console.log('🎉 Chamando onSuccess callback...');
      onSuccess?.();
      
    } catch (error) {
      console.error('💥 Erro na submissão do formulário:', error);
      // O erro já é tratado no hook useSupabaseMentoring
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Inscrição Individual</CardTitle>
        <CardDescription>
          Crie uma nova inscrição para mentoria individual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">Aluno *</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => handleInputChange('studentId', value)}
                disabled={studentsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={studentsLoading ? "Carregando alunos..." : "Selecione um aluno"} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mentoringId">Mentoria *</Label>
              <Select
                value={formData.mentoringId}
                onValueChange={(value) => handleInputChange('mentoringId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma mentoria" />
                </SelectTrigger>
                <SelectContent>
                  {catalogs.map((mentoring) => (
                    <SelectItem key={mentoring.id} value={mentoring.id}>
                      {mentoring.name} ({mentoring.numberOfSessions} sessões - {mentoring.durationMonths} meses)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Extensões disponíveis */}
          {selectedMentoring?.extensions && selectedMentoring.extensions.length > 0 && (
            <div className="space-y-3">
              <Label>Extensões Disponíveis</Label>
              <div className="grid grid-cols-1 gap-3 p-4 border rounded-lg bg-gray-50">
                {selectedMentoring.extensions.map((extension) => (
                  <div key={extension.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`extension-${extension.id}`}
                      checked={formData.selectedExtensions.includes(extension.id)}
                      onCheckedChange={(checked) => 
                        handleExtensionToggle(extension.id, checked as boolean)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={`extension-${extension.id}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        +{extension.months} meses (+{extension.totalSessions || 0} sessões)
                      </label>
                      {extension.description && (
                        <p className="text-xs text-gray-600 mt-1">{extension.description}</p>
                      )}
                      <p className="text-sm font-medium text-green-600 mt-1">
                        R$ {extension.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {formData.selectedExtensions.length > 0 && (
                <div className="text-sm text-blue-600 font-medium">
                  Total de sessões: {calculateTotalSessions(formData.mentoringId, formData.selectedExtensions)}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">Status do Pagamento</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="enrollmentDate">Data de Inscrição</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="responsibleMentor">Mentor Responsável *</Label>
            <Select
              value={formData.responsibleMentor}
              onValueChange={(value) => handleInputChange('responsibleMentor', value)}
              disabled={mentorsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.name}>
                    {mentor.name} ({mentor.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Observações sobre a inscrição..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Inscrição'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
