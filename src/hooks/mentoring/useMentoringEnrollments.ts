
import { useState, useCallback } from 'react';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';
import { useToast } from '@/hooks/use-toast';

const dataService = new MentoringDataService();

export const useMentoringEnrollments = () => {
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshEnrollments = useCallback(() => {
    setEnrollments([...dataService.getEnrollments()]);
  }, []);

  const getStudentEnrollments = useCallback((studentId: string): StudentMentoringEnrollment[] => {
    return dataService.getStudentEnrollments(studentId);
  }, []);

  const addExtension = useCallback(async (data: CreateExtensionData): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.addExtension(data);
      if (success) {
        refreshEnrollments();
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

  const getEnrollmentProgress = useCallback((enrollment: StudentMentoringEnrollment) => {
    return dataService.getEnrollmentProgress(enrollment);
  }, []);

  return {
    enrollments,
    loading,
    getStudentEnrollments,
    addExtension,
    getEnrollmentProgress,
    refreshEnrollments
  };
};
