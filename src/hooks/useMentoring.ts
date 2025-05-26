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
  const createEnrollment = useCallback(async (enrollmentData: any): Promise<boolean> => {
    setLoading(true);
    try {
      // Criar a inscrição
      const newEnrollment = dataService.createEnrollment(enrollmentData);
      
      // Criar sessões automaticamente - TODAS AGUARDANDO AGENDAMENTO
      const mentoring = dataService.getCatalogById(enrollmentData.mentoringId);
      if (mentoring && newEnrollment) {
        for (let i = 1; i <= mentoring.numberOfSessions; i++) {
          const sessionData: CreateSessionData = {
            enrollmentId: newEnrollment.id,
            type: 'individual',
            title: `Sessão ${i} - ${mentoring.name}`,
            durationMinutes: 60,
            status: 'aguardando_agendamento' // SEMPRE aguardando agendamento inicialmente
          };
          dataService.createSession(sessionData);
        }
      }
      
      refreshData();
      toast({
        title: "Sucesso",
        description: `Inscrição criada com ${mentoring?.numberOfSessions || 0} sessões aguardando agendamento!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar inscrição. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

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
      // Determinar status baseado na presença de data/hora
      const hasScheduledDateTime = data.scheduledDate && data.scheduledDate !== '';
      const sessionData = {
        ...data,
        status: hasScheduledDateTime ? 'agendada' : 'aguardando_agendamento'
      };
      
      const newSession = dataService.createSession(sessionData);
      refreshData();
      
      toast({
        title: "Sucesso",
        description: hasScheduledDateTime ? "Sessão criada e agendada!" : "Sessão criada aguardando agendamento!",
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

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.deleteSession(sessionId);
      if (success) {
        refreshData();
        toast({
          title: "Sucesso",
          description: "Sessão removida com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshData, toast]);

  const scheduleSession = useCallback(async (sessionId: string, scheduledDate: string, meetingLink?: string, notes?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const updateData: UpdateSessionData = {
        scheduledDate,
        meetingLink,
        status: 'agendada',
        observations: notes
      };
      
      const success = dataService.updateSession(sessionId, updateData);
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
    createMentoringCatalog: createCatalog, // Alias for compatibility
    updateMentoringCatalog,
    deleteMentoringCatalog,
    
    // Enrollment methods
    createEnrollment,
    getMyEnrollments,
    addExtension,
    getEnrollmentProgress,
    
    // Session methods
    getEnrollmentSessions,
    getSessionDetails,
    getMyUpcomingSessions,
    createSession,
    updateSession,
    deleteSession,
    scheduleSession,
    
    // Material methods
    getEnrollmentMaterials,
    getSessionMaterials,
    
    // Utility
    refreshData
  };
};
