
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Mentor {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, status')
        .eq('is_mentor', true)
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('Erro ao buscar mentores:', error);
        return;
      }

      setMentors(data || []);
    } catch (error) {
      console.error('Erro ao buscar mentores:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMentorStatus = async (userId: string, isMentor: boolean) => {
    try {
      console.log(`Atualizando status de mentor para usuário ${userId}:`, { isMentor });
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_mentor: isMentor })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar status de mentor:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status de mentor",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar a lista local de mentores
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
    updateMentorStatus
  };
};
