
import { useState, useCallback } from 'react';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseMentoringEnrollments = () => {
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const repository = new SupabaseMentoringRepository();

  const refreshEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando refresh das inscrições...');
      const data = await repository.getEnrollments();
      console.log('📊 Inscrições carregadas:', data.length, data);
      setEnrollments(data);
    } catch (error) {
      console.error('❌ Error refreshing enrollments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar inscrições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createEnrollment = useCallback(async (enrollmentData: {
    studentId: string;
    mentoringId: string;
    status: string;
    enrollmentDate: string;
    startDate: string;
    endDate: string;
    totalSessions: number;
    responsibleMentor: string;
    paymentStatus: string;
    observations?: string;
  }): Promise<StudentMentoringEnrollment> => {
    try {
      setLoading(true);
      
      console.log('🏗️ Iniciando criação de inscrição no useSupabaseMentoring...');
      console.log('📝 Dados da inscrição:', enrollmentData);
      
      // Validar dados obrigatórios
      if (!enrollmentData.studentId || !enrollmentData.mentoringId || !enrollmentData.startDate || !enrollmentData.responsibleMentor) {
        const missingFields = [];
        if (!enrollmentData.studentId) missingFields.push('studentId');
        if (!enrollmentData.mentoringId) missingFields.push('mentoringId');
        if (!enrollmentData.startDate) missingFields.push('startDate');
        if (!enrollmentData.responsibleMentor) missingFields.push('responsibleMentor');
        
        console.error('❌ Dados obrigatórios não fornecidos:', missingFields);
        throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
      }
      
      console.log('✅ Validação passou, enviando para o repository...');
      const newEnrollment = await repository.createEnrollment(enrollmentData);
      console.log('✅ Inscrição criada no repositório:', newEnrollment);
      
      // Refresh das inscrições para atualizar a lista
      await refreshEnrollments();
      console.log('🔄 Lista de inscrições atualizada após criação');
      
      toast({
        title: "Sucesso",
        description: "Inscrição criada com sucesso!",
      });
      
      return newEnrollment;
    } catch (error) {
      console.error('❌ Erro ao criar inscrição:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar inscrição. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshEnrollments, toast]);

  const getStudentEnrollments = useCallback(async (studentId: string): Promise<StudentMentoringEnrollment[]> => {
    try {
      return await repository.getStudentEnrollments(studentId);
    } catch (error) {
      console.error('Error getting student enrollments:', error);
      return [];
    }
  }, []);

  const addExtension = useCallback(async (data: CreateExtensionData): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.addExtension(data);
      if (success) {
        await refreshEnrollments();
        toast({
          title: "Sucesso",
          description: "Extensão aplicada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aplicar extensão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshEnrollments, toast]);

  return {
    enrollments,
    loading,
    createEnrollment,
    getStudentEnrollments,
    addExtension,
    refreshEnrollments,
    repository
  };
};
