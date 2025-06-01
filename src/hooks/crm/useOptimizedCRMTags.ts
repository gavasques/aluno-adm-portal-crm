
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';

interface CRMTagsCache {
  tags: CRMTag[];
  timestamp: number;
  loading: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let globalCache: CRMTagsCache | null = null;
const subscribers = new Set<() => void>();

export const useOptimizedCRMTags = () => {
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notifySubscribers = useCallback(() => {
    subscribers.forEach(callback => callback());
  }, []);

  const updateLocalState = useCallback(() => {
    if (globalCache) {
      setTags(globalCache.tags);
      setLoading(globalCache.loading);
    }
  }, []);

  useEffect(() => {
    subscribers.add(updateLocalState);
    return () => {
      subscribers.delete(updateLocalState);
    };
  }, [updateLocalState]);

  const fetchTags = useCallback(async (forceRefresh = false) => {
    try {
      // Verificar cache válido
      const now = Date.now();
      if (!forceRefresh && globalCache && (now - globalCache.timestamp) < CACHE_DURATION && !globalCache.loading) {
        setTags(globalCache.tags);
        setLoading(false);
        return globalCache.tags;
      }

      // Evitar múltiplas chamadas simultâneas
      if (globalCache?.loading) {
        return globalCache.tags;
      }

      console.log('🏷️ Fetching CRM tags from database...');
      
      globalCache = { tags: globalCache?.tags || [], timestamp: now, loading: true };
      setLoading(true);
      setError(null);
      notifySubscribers();

      const { data, error: queryError } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (queryError) {
        console.error('❌ Error fetching CRM tags:', queryError);
        throw new Error(`Erro ao carregar tags: ${queryError.message}`);
      }

      const tagsList = data || [];
      console.log(`✅ Loaded ${tagsList.length} CRM tags successfully`);

      globalCache = {
        tags: tagsList,
        timestamp: now,
        loading: false
      };

      setTags(tagsList);
      setLoading(false);
      notifySubscribers();

      return tagsList;
    } catch (err) {
      console.error('❌ CRM Tags fetch error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido ao carregar tags';
      
      setError(errorMsg);
      setLoading(false);
      
      globalCache = {
        tags: globalCache?.tags || [],
        timestamp: globalCache?.timestamp || 0,
        loading: false
      };
      
      notifySubscribers();
      toast.error(errorMsg);
      return [];
    }
  }, [notifySubscribers]);

  const createTag = useCallback(async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert({ name: name.trim(), color })
        .select()
        .single();

      if (error) throw error;

      // Atualizar cache local
      if (globalCache) {
        const updatedTags = [...globalCache.tags, data].sort((a, b) => a.name.localeCompare(b.name));
        globalCache = {
          ...globalCache,
          tags: updatedTags,
          timestamp: Date.now()
        };
        
        setTags(updatedTags);
        notifySubscribers();
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  }, [notifySubscribers]);

  const updateLeadTags = useCallback(async (leadId: string, tagIds: string[]) => {
    try {
      // Remover todas as tags do lead
      const { error: deleteError } = await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('lead_id', leadId);

      if (deleteError) throw deleteError;

      // Adicionar novas tags
      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('crm_lead_tags')
          .insert(tagIds.map(tagId => ({ lead_id: leadId, tag_id: tagId })));

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Erro ao atualizar tags do lead:', error);
      throw error;
    }
  }, []);

  // Inicializar cache na primeira execução
  useEffect(() => {
    if (!globalCache) {
      fetchTags();
    } else {
      updateLocalState();
    }
  }, [fetchTags, updateLocalState]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateLeadTags,
    refetch: () => fetchTags(true)
  };
};
