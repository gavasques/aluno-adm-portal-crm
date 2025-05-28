
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const useActiveStudentsForMentoring = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, status')
        .eq('role', 'Student')
        .eq('status', 'Ativo')
        .order('name');

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        return;
      }

      const studentsData = data?.map(profile => ({
        id: profile.id,
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        status: profile.status
      })) || [];

      setStudents(studentsData);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    refetch: fetchStudents
  };
};
