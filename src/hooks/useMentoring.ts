
import { useState, useCallback } from 'react';
import { 
  MentoringCatalog, 
  CreateMentoringCatalogData,
  StudentMentoringEnrollment,
  MentoringSession,
  MentoringMaterial,
  CreateSessionData,
  CreateExtensionData,
  UpdateSessionData
} from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';
import { useToast } from '@/hooks/use-toast';

const dataService = new MentoringDataService();

export const useMentoring = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>(dataService.getCatalogs());
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>(dataService.getEnrollments());
  const [sessions, setSessions] = useState<MentoringSession[]>(dataService.getSessions());
  const [materials, setMaterials] = useState<MentoringMaterial[]>(dataService.getMaterials());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshData = useCallback(() => {
    setCatalogs(dataService.getCatalogs());
    setEnrollments(dataService.getEnrollments());
    setSessions(dataService.getSessions());
    setMaterials(dataService.getMaterials());
  }, []);

  // Catalog methods
  const createCatalog = useCallback(async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    setLoading(true);
    try {
      console.log('🏗️ Criando catálogo com dados:', data);
      console.log('📋 Extensões a serem salvas:', data.extensions);
      
      const newCatalog = dataService.createCatalog(data);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Mentoria criada com sucesso!",
      });
      return newCatalog;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar mentoria. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  const createMentoringCatalog = createCatalog; // Alias for compatibility

  const updateMentoringCatalog = useCallback(async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.updateCatalog(id, data);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  const deleteMentoringCatalog = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.deleteCatalog(id);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  // Enrollment methods
  const getMyEnrollments = useCallback((studentId: string) => {
    return dataService.getStudentEnrollments(studentId);
  }, []);

  const addExtension = useCallback(async (data: CreateExtensionData): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.addExtension(data);
      if (success) {
        refreshData();
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
  }, [refreshData, toast]);

  const getEnrollmentProgress = useCallback((enrollment: StudentMentoringEnrollment) => {
    return dataService.getEnrollmentProgress(enrollment);
  }, []);

  // Session methods
  const getEnrollmentSessions = useCallback((enrollmentId: string) => {
    return dataService.getEnrollmentSessions(enrollmentId);
  }, []);

  const getSessionDetails = useCallback((sessionId: string) => {
    return dataService.getSessionDetails(sessionId);
  }, []);

  const getMyUpcomingSessions = useCallback((studentId: string) => {
    return dataService.getUpcomingSessions(studentId);
  }, []);

  const createSession = useCallback(async (data: CreateSessionData): Promise<MentoringSession> => {
    setLoading(true);
    try {
      const newSession = dataService.createSession(data);
      refreshData();
      toast({
        title: "Sucesso",
        description: "Sessão criada com sucesso!",
      });
      return newSession;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar sessão. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  const updateSession = useCallback(async (sessionId: string, data: UpdateSessionData): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.updateSession(sessionId, data);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Sessão atualizada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  const scheduleSession = useCallback(async (sessionId: string, scheduledDate: string, meetingLink?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.scheduleSession(sessionId, scheduledDate, meetingLink);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Sessão agendada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  // Material methods
  const getEnrollmentMaterials = useCallback((enrollmentId: string) => {
    return dataService.getEnrollmentMaterials(enrollmentId);
  }, []);

  const getSessionMaterials = useCallback((sessionId: string) => {
    return dataService.getSessionMaterials(sessionId);
  }, []);

  return {
    // Data
    catalogs,
    enrollments,
    sessions,
    materials,
    loading,
    
    // Catalog methods
    createCatalog,
    createMentoringCatalog, // Alias for compatibility
    updateMentoringCatalog,
    deleteMentoringCatalog,
    
    // Enrollment methods
    getMyEnrollments,
    addExtension,
    getEnrollmentProgress,
    
    // Session methods
    getEnrollmentSessions,
    getSessionDetails,
    getMyUpcomingSessions,
    createSession,
    updateSession,
    scheduleSession,
    
    // Material methods
    getEnrollmentMaterials,
    getSessionMaterials,
    
    // Utility
    refreshData
  };
};
