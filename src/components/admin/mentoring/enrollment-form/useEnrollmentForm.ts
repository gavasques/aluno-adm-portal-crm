
import { useState } from 'react';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentFormData {
  studentId: string;
  mentoringId: string;
  status: string;
  enrollmentDate: string;
  startDate: string;
  endDate: string;
  responsibleMentor: string;
  paymentStatus: string;
  observations: string;
  selectedExtensions: string[];
}

const initialFormData: EnrollmentFormData = {
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
};

export const useEnrollmentForm = (onSuccess?: () => void) => {
  const { catalogs, createEnrollment, loading } = useSupabaseMentoring();
  const { toast } = useToast();
  const [formData, setFormData] = useState<EnrollmentFormData>(initialFormData);

  const selectedMentoring = catalogs.find(c => c.id === formData.mentoringId);

  const calculateEndDate = (startDate: string, mentoringId: string, extensions: string[] = []) => {
    if (!startDate || !mentoringId) return '';
    
    const mentoring = catalogs.find(c => c.id === mentoringId);
    if (!mentoring) return '';
    
    const start = new Date(startDate);
    const end = new Date(start);
    
    let totalMonths = mentoring.durationMonths;
    
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

  const handleInputChange = (field: keyof EnrollmentFormData, value: string | string[]) => {
    console.log(`🔄 Campo alterado: ${field} =`, value);
    
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'startDate' || field === 'mentoringId' || field === 'selectedExtensions') {
        const endDate = calculateEndDate(
          field === 'startDate' ? value as string : updated.startDate,
          field === 'mentoringId' ? value as string : updated.mentoringId,
          field === 'selectedExtensions' ? value as string[] : updated.selectedExtensions
        );
        updated.endDate = endDate;
        console.log(`📅 Data final calculada: ${endDate}`);
      }
      
      if (field === 'mentoringId') {
        updated.selectedExtensions = [];
        console.log(`🔄 Extensões resetadas para nova mentoria`);
      }
      
      return updated;
    });
  };

  const handleExtensionToggle = (extensionId: string, checked: boolean) => {
    console.log(`✅ Extensão ${extensionId} ${checked ? 'selecionada' : 'desmarcada'}`);
    
    const newExtensions = checked 
      ? [...formData.selectedExtensions, extensionId]
      : formData.selectedExtensions.filter(id => id !== extensionId);
    
    handleInputChange('selectedExtensions', newExtensions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando submissão do formulário de inscrição...');
    console.log('📊 Dados do formulário:', formData);
    
    if (!formData.studentId || !formData.mentoringId || !formData.startDate || !formData.responsibleMentor) {
      console.log('❌ Validação falhou - campos obrigatórios faltando');
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Aluno, Mentoria, Data de Início e Mentor Responsável)",
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

      console.log('📦 Payload final da inscrição:', enrollmentPayload);

      await createEnrollment(enrollmentPayload);
      
      // Reset form
      setFormData(initialFormData);
      console.log('🎉 Formulário resetado e callback de sucesso chamado');
      onSuccess?.();
      
    } catch (error) {
      console.error('💥 Erro na submissão do formulário:', error);
    }
  };

  return {
    formData,
    selectedMentoring,
    loading,
    handleInputChange,
    handleExtensionToggle,
    handleSubmit,
    calculateTotalSessions
  };
};
