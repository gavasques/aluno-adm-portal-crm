
import { useState, useEffect, useCallback, useRef } from 'react';
import { CRMLead, CRMFilters } from '@/types/crm.types';
import { supabase } from '@/integrations/supabase/client';
import { useToastManager } from '@/hooks/useToastManager';
import { useMemo } from 'react';

export const useCRMDataOptimized = (filters: CRMFilters) => {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastManager();
  const movingLeads = useRef<Set<string>>(new Set());
  const isFetchingRef = useRef(false);

  const fetchLeads = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log('🚫 Already fetching leads, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      let query = supabase
        .from('crm_leads')
        .select(`
          *,
          tags:crm_lead_tags(
            tag:crm_tags(*)
          ),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      if (filters.column_id && filters.column_id !== 'all') {
        query = query.eq('column_id', filters.column_id);
      }
      if (filters.responsible_id && filters.responsible_id !== 'all') {
        query = query.eq('responsible_id', filters.responsible_id);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      // Processar dados para o formato correto
      const processedLeads: CRMLead[] = (data || []).map(lead => ({
        ...lead,
        tags: lead.tags?.map((tagRelation: any) => tagRelation.tag) || [],
        responsible: lead.responsible || undefined
      }));
      
      setLeads(processedLeads);
      console.log('✅ Leads fetched successfully:', processedLeads.length);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
      setLeads([]); // Set empty array on error
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Agrupar leads por coluna com memoização
  const leadsByColumn = useMemo(() => {
    const grouped: { [key: string]: CRMLead[] } = {};
    
    leads.forEach(lead => {
      const columnId = lead.column_id || 'unassigned';
      if (!grouped[columnId]) {
        grouped[columnId] = [];
      }
      grouped[columnId].push(lead);
    });
    
    return grouped;
  }, [leads]);

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    // Prevenir múltiplas movimentações simultâneas do mesmo lead
    if (movingLeads.current.has(leadId)) {
      console.log('🚫 Lead já sendo movido:', leadId);
      return;
    }

    try {
      movingLeads.current.add(leadId);
      
      // Atualização otimista
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, column_id: newColumnId }
            : lead
        )
      );

      const { error } = await supabase
        .from('crm_leads')
        .update({ column_id: newColumnId })
        .eq('id', leadId);

      if (error) throw error;

      console.log('✅ Lead movido com sucesso');
      
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
      
      // Reverter otimistic update
      await fetchLeads();
    } finally {
      // Remover do conjunto de leads sendo movidos após um delay
      setTimeout(() => {
        movingLeads.current.delete(leadId);
      }, 1000);
    }
  }, [toast, fetchLeads]);

  const refetch = useCallback(() => {
    return fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    leadsByColumn,
    loading,
    moveLeadToColumn,
    refetch
  };
};
