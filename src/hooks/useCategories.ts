
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export const useCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('🔍 Buscando categorias...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Erro ao buscar categorias:', error);
        throw error;
      }

      console.log('✅ Categorias carregadas:', data.length);
      return data as Category[];
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (newCategory: CreateCategoryData) => {
      console.log('➕ Criando categoria:', newCategory);
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar categoria:', error);
        throw error;
      }

      console.log('✅ Categoria criada:', data);
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro na mutação de criação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deletando categoria:', id);
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar categoria:', error);
        throw error;
      }

      console.log('✅ Categoria deletada');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro na mutação de exclusão:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const createCategory = useCallback((data: CreateCategoryData) => {
    createCategoryMutation.mutate(data);
  }, [createCategoryMutation]);

  const deleteCategory = useCallback((id: string) => {
    deleteCategoryMutation.mutate(id);
  }, [deleteCategoryMutation]);

  return {
    categories,
    isLoading,
    error,
    createCategory,
    deleteCategory,
    isCreating: createCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending
  };
};
