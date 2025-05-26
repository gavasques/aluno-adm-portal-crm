
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Mentor {
  id: string;
  name: string;
  email: string;
}

export const useMentorsForEnrollment = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      console.log('🔍 Buscando mentores...');
      
      // Buscar usuários que têm is_mentor = true
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, is_mentor')
        .eq('is_mentor', true)
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('❌ Erro ao buscar mentores:', error);
        setMentors([]);
        return;
      }

      console.log('📊 Dados brutos dos mentores:', data);

      // Mapear dados para o formato esperado, garantindo que sempre temos um nome
      const mentorsData = (data || []).map(profile => {
        const mentorName = profile.name || profile.email || 'Mentor sem nome';
        console.log(`👤 Mentor processado: ID=${profile.id}, Nome="${mentorName}"`);
        
        return {
          id: profile.id,
          name: mentorName,
          email: profile.email
        };
      });

      console.log('✅ Mentores formatados:', mentorsData);
      setMentors(mentorsData);
    } catch (error) {
      console.error('💥 Erro ao buscar mentores:', error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return {
    mentors,
    loading,
    refetch: fetchMentors
  };
};
