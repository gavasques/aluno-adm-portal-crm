
import { useState, useCallback } from 'react';
import { MentoringMaterial } from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';

const dataService = new MentoringDataService();

export const useMentoringMaterials = () => {
  const [materials, setMaterials] = useState<MentoringMaterial[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshMaterials = useCallback(() => {
    setMaterials([...dataService.getMaterials()]);
  }, []);

  const getEnrollmentMaterials = useCallback((enrollmentId: string): MentoringMaterial[] => {
    return dataService.getEnrollmentMaterials(enrollmentId);
  }, []);

  const getSessionMaterials = useCallback((sessionId: string): MentoringMaterial[] => {
    return dataService.getSessionMaterials(sessionId);
  }, []);

  return {
    materials,
    loading,
    getEnrollmentMaterials,
    getSessionMaterials,
    refreshMaterials
  };
};
