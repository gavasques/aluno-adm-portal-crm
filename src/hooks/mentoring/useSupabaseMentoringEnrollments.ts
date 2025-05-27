
import { useState, useCallback } from 'react';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { useToast } from '@/hooks/use-toast';

const repository = new SupabaseMentoringRepository();

export const useSupabaseMentoringEnrollments = () => {
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repository.getEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error('Error refreshing enrollments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEnrollment = useCallback(async (enrollmentData: any): Promise<StudentMentoringEnrollment> => {
    setLoading(true);
    try {
      const newEnrollment = await repository.createEnrollment(enrollmentData);
      await refreshEnrollments();
      return newEnrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshEnrollments]);

  const deleteEnrollment = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await repository.deleteEnrollment(id);
      if (success) {
        await refreshEnrollments();
      }
      return success;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshEnrollments]);

  const getStudentEnrollments = useCallback(async (studentId: string): Promise<StudentMentoringEnrollment[]> => {
    try {
      return await repository.getStudentEnrollments(studentId);
    } catch (error) {
      console.error('Error getting student enrollments:', error);
      return [];
    }
  }, []);

  const addExtension = useCallback(async (data: CreateExtensionData): Promise<boolean> => {
    setLoading(true);
    try {
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

  const removeExtension = useCallback(async (extensionId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await repository.removeExtension(extensionId);
      if (success) {
        await refreshEnrollments();
        toast({
          title: "Sucesso",
          description: "Extensão removida com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover extensão. Tente novamente.",
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
    deleteEnrollment,
    getStudentEnrollments,
    addExtension,
    removeExtension,
    refreshEnrollments,
    repository
  };
};
