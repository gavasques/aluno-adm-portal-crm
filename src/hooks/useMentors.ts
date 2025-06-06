
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Mentor {
  id: string;
  name: string;
  email: string;
}

export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      // Buscar usuários que têm is_mentor = true
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, is_mentor')
        .eq('is_mentor', true)
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('Erro ao buscar mentores:', error);
        setMentors([]);
        return;
      }

      // Mapear dados para o formato esperado
      const mentorsData = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name || profile.email, // Usar email se name estiver vazio
        email: profile.email
      }));

      setMentors(mentorsData);
    } catch (error) {
      console.error('Erro ao buscar mentores:', error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const updateMentorStatus = async (mentorId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_mentor: isActive })
        .eq('id', mentorId);

      if (error) {
        console.error('Erro ao atualizar status do mentor:', error);
        return false;
      }

      // Recarregar a lista de mentores após a atualização
      await fetchMentors();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do mentor:', error);
      return false;
    }
  };

  return { mentors, loading, updateMentorStatus, refreshMentors: fetchMentors };
};
