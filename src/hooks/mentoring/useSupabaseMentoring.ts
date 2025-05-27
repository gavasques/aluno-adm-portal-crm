
import { useState, useCallback, useEffect } from 'react';
import { MentoringCatalog, StudentMentoringEnrollment, MentoringSession, MentoringMaterial, CreateExtensionData } from '@/types/mentoring.types';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { useToast } from '@/hooks/use-toast';

const repository = new SupabaseMentoringRepository();

export const useSupabaseMentoring = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>([]);
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [materials, setMaterials] = useState<MentoringMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar dados automaticamente na inicialização
  useEffect(() => {
    console.log('🚀 useSupabaseMentoring - Inicializando e carregando dados...');
    refreshEnrollments();
    refreshCatalogs();
  }, []);

  const refreshCatalogs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando catálogos...');
      const data = await repository.getCatalogs();
      console.log('✅ Catálogos carregados:', data.length);
      setCatalogs(data);
    } catch (error) {
      console.error('❌ Erro ao buscar catálogos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando inscrições...');
      const data = await repository.getEnrollments();
      console.log('✅ Inscrições carregadas:', data.length);
      setEnrollments(data);
    } catch (error) {
      console.error('❌ Erro ao buscar inscrições:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error refreshing materials:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCatalog = useCallback(async (catalogData: any) => {
    setLoading(true);
    try {
      const newCatalog = await repository.createCatalog(catalogData);
      await refreshCatalogs();
      return newCatalog;
    } catch (error) {
      console.error('Error creating catalog:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs]);

  const updateCatalog = useCallback(async (id: string, catalogData: any) => {
    setLoading(true);
    try {
      const success = await repository.updateCatalog(id, catalogData);
      if (success) {
        await refreshCatalogs();
      }
      return success;
    } catch (error) {
      console.error('Error updating catalog:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs]);

  const deleteCatalog = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await repository.deleteCatalog(id);
      if (success) {
        await refreshCatalogs();
      }
      return success;
    } catch (error) {
      console.error('Error deleting catalog:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs]);

  const createEnrollment = useCallback(async (enrollmentData: any) => {
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

  const deleteEnrollment = useCallback(async (id: string) => {
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

  const createSession = useCallback(async (sessionData: any) => {
    setLoading(true);
    try {
      const newSession = await repository.createSession(sessionData);
      await refreshSessions();
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions]);

  const updateSession = useCallback(async (sessionId: string, sessionData: any) => {
    setLoading(true);
    try {
      const success = await repository.updateSession(sessionId, sessionData);
      if (success) {
        await refreshSessions();
      }
      return success;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions]);

  const deleteSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    try {
      const success = await repository.deleteSession(sessionId);
      if (success) {
        await refreshSessions();
      }
      return success;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions]);

  return {
    catalogs,
    enrollments,
    sessions,
    materials,
    loading,
    refreshCatalogs,
    refreshEnrollments,
    refreshSessions,
    refreshMaterials,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    createEnrollment,
    deleteEnrollment,
    addExtension,
    removeExtension,
    createSession,
    updateSession,
    deleteSession,
    repository
  };
};
