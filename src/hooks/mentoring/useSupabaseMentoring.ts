import { useState, useEffect, useCallback } from 'react';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  CreateExtensionData,
  UpdateSessionData
} from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

const repository = new SupabaseMentoringRepository();

export const useSupabaseMentoring = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>([]);
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [materials, setMaterials] = useState<MentoringMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshCatalogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error('Error refreshing catalogs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogo de mentorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error('Error refreshing enrollments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar inscrições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error refreshing sessions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar sessões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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

  // Load initial data
  useEffect(() => {
    refreshCatalogs();
    refreshEnrollments();
    refreshSessions();
    refreshMaterials();
  }, [refreshCatalogs, refreshEnrollments, refreshSessions, refreshMaterials]);

  // Catalog methods
  const createCatalog = useCallback(async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    try {
      setLoading(true);
      const newCatalog = await repository.createCatalog(data);
      await refreshCatalogs();
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
  }, [refreshCatalogs, toast]);

  const updateCatalog = useCallback(async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.updateCatalog(id, data);
      if (success) {
        await refreshCatalogs();
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
  }, [refreshCatalogs, toast]);

  const deleteCatalog = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.deleteCatalog(id);
      if (success) {
        await refreshCatalogs();
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
  }, [refreshCatalogs, toast]);

  // Enrollment methods
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

  // Session methods
  const getEnrollmentSessions = useCallback(async (enrollmentId: string): Promise<MentoringSession[]> => {
    try {
      return await repository.getEnrollmentSessions(enrollmentId);
    } catch (error) {
      console.error('Error getting enrollment sessions:', error);
      return [];
    }
  }, []);

  const createSession = useCallback(async (data: CreateSessionData): Promise<MentoringSession> => {
    try {
      setLoading(true);
      const newSession = await repository.createSession(data);
      await refreshSessions();
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
  }, [refreshSessions, toast]);

  const updateSession = useCallback(async (sessionId: string, data: UpdateSessionData): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.updateSession(sessionId, data);
      if (success) {
        await refreshSessions();
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
  }, [refreshSessions, toast]);

  const getSessionsByEnrollment = useCallback((enrollmentId: string): MentoringSession[] => {
    return sessions.filter(session => session.enrollmentId === enrollmentId);
  }, [sessions]);

  // Material methods
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
    // Data
    catalogs,
    enrollments,
    sessions,
    materials,
    loading,
    
    // Catalog methods
    createCatalog: repository.createCatalog.bind(repository),
    updateCatalog: repository.updateCatalog.bind(repository),
    deleteCatalog: repository.deleteCatalog.bind(repository),
    refreshCatalogs,
    
    // Enrollment methods
    getStudentEnrollments: repository.getStudentEnrollments.bind(repository),
    addExtension: repository.addExtension.bind(repository),
    refreshEnrollments,
    
    // Session methods
    getEnrollmentSessions: repository.getEnrollmentSessions.bind(repository),
    createSession: repository.createSession.bind(repository),
    updateSession,
    getSessionsByEnrollment,
    refreshSessions,
    
    // Material methods
    getEnrollmentMaterials: repository.getEnrollmentMaterials.bind(repository),
    getSessionMaterials: repository.getSessionMaterials.bind(repository),
    refreshMaterials,
    
    // Repository access
    repository
  };
};
