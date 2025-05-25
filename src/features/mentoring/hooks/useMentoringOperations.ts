
import { useCallback } from 'react';
import { useMentoringContext } from '../contexts/MentoringContext';
import { MentoringRepository } from '../services/MentoringRepository';
import { MentoringService } from '../services/MentoringService';
import { CreateMentoringCatalogData, CreateSessionData, CreateExtensionData } from '@/types/mentoring.types';
import { MentoringOperationResult } from '../types/contracts.types';
import { useToast } from '@/hooks/use-toast';

const repository = new MentoringRepository();
const service = new MentoringService(repository);

export const useMentoringOperations = () => {
  const { state, dispatch } = useMentoringContext();
  const { toast } = useToast();

  const createCatalog = useCallback(async (
    data: CreateMentoringCatalogData
  ): Promise<MentoringOperationResult<any>> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const validation = await service.validateCatalogData(data);
      
      if (!validation.isValid) {
        toast({
          title: "Erro de validação",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return { success: false, error: validation.errors.join(', ') };
      }

      const newCatalog = await repository.createCatalog(data);
      dispatch({ type: 'ADD_CATALOG', payload: newCatalog });
      
      toast({
        title: "Sucesso",
        description: "Mentoria criada com sucesso!",
      });

      return { success: true, data: newCatalog };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      toast({
        title: "Erro",
        description: "Erro ao criar mentoria. Tente novamente.",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  const updateCatalog = useCallback(async (
    id: string, 
    data: Partial<CreateMentoringCatalogData>
  ): Promise<MentoringOperationResult<boolean>> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const success = await repository.updateCatalog(id, data);
      
      if (success) {
        dispatch({ type: 'UPDATE_CATALOG', payload: { id, data } });
        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      }

      return { success, data: success };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: "Erro ao atualizar mentoria. Tente novamente.",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  const deleteCatalog = useCallback(async (id: string): Promise<MentoringOperationResult<boolean>> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const success = await repository.deleteCatalog(id);
      
      if (success) {
        dispatch({ type: 'DELETE_CATALOG', payload: id });
        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      }

      return { success, data: success };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: "Erro ao excluir mentoria. Tente novamente.",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  const createSession = useCallback(async (
    data: CreateSessionData
  ): Promise<MentoringOperationResult<any>> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const newSession = await repository.createSession(data);
      
      toast({
        title: "Sucesso",
        description: "Sessão criada com sucesso!",
      });

      return { success: true, data: newSession };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: "Erro ao criar sessão. Tente novamente.",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  const addExtension = useCallback(async (
    data: CreateExtensionData
  ): Promise<MentoringOperationResult<boolean>> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const success = await repository.addExtension(data);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Extensão aplicada com sucesso!",
        });
      }

      return { success, data: success };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro",
        description: "Erro ao aplicar extensão. Tente novamente.",
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  return {
    createCatalog,
    updateCatalog,
    deleteCatalog,
    createSession,
    addExtension,
    loading: state.loading,
    error: state.error
  };
};
