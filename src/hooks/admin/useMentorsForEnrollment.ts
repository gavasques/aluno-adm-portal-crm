
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Mentor {
  id: string;
  name: string;
  email: string;
}

export const useMentorsForEnrollment = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
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

  useEffect(() => {
    fetchMentors();
  }, []);

  return {
    mentors,
    loading
  };
};
