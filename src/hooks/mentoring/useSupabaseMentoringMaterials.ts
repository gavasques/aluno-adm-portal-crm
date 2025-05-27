
import { useState, useCallback } from 'react';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { MentoringMaterial } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseMentoringMaterials = () => {
  const [materials, setMaterials] = useState<MentoringMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const repository = new SupabaseMentoringRepository();

  const refreshMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error refreshing materials:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar materiais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getEnrollmentMaterials = useCallback(async (enrollmentId: string): Promise<MentoringMaterial[]> => {
    try {
      return await repository.getEnrollmentMaterials(enrollmentId);
    } catch (error) {
      console.error('Error getting enrollment materials:', error);
      return [];
    }
  }, []);

  const getSessionMaterials = useCallback(async (sessionId: string): Promise<MentoringMaterial[]> => {
    try {
      return await repository.getSessionMaterials(sessionId);
    } catch (error) {
      console.error('Error getting session materials:', error);
      return [];
    }
  }, []);

  return {
    materials,
    loading,
    getEnrollmentMaterials,
    getSessionMaterials,
    refreshMaterials,
    repository
  };
};
