
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Mentor {
  id: string;
  name: string;
  email: string;
  is_mentor: boolean;
}

export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, is_mentor')
        .eq('is_mentor', true)
        .eq('status', 'Ativo')
        .order('name');

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Erro ao buscar mentores:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de mentores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMentorStatus = async (userId: string, isMentor: boolean) => {
    try {
      console.log(`[useMentors] Tentando atualizar mentor status:`, {
        userId,
        isMentor,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase
        .from('profiles')
        .update({ is_mentor: isMentor })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('[useMentors] Erro na atualização:', error);
        throw error;
      }

      console.log('[useMentors] Resultado da atualização:', data);

      // Verificar se a atualização foi bem-sucedida
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('id, name, email, is_mentor')
        .eq('id', userId)
        .single();

      if (!verifyError) {
        console.log('[useMentors] Verificação pós-atualização:', verifyData);
      }

      toast({
        title: "Sucesso",
        description: `Status de mentor ${isMentor ? 'ativado' : 'desativado'} com sucesso`,
      });

      // Atualizar lista local
      await fetchMentors();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status de mentor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status de mentor",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return {
    mentors,
    loading,
    fetchMentors,
    updateMentorStatus
  };
};
