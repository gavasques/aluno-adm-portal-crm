
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const useStudentsForEnrollment = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return {
    students: filteredStudents,
    loading,
    searchTerm,
    setSearchTerm
  };
};
