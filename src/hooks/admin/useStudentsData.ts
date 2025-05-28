
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  permission_group_id?: string | null;
  storage_used_mb?: number;
  storage_limit_mb?: number;
  is_mentor?: boolean;
}

interface StudentStatistics {
  total: number;
  withMentorships: number;
  active: number;
  newThisMonth: number;
}

export const useStudentsData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<StudentStatistics>({
    total: 0,
    withMentorships: 0,
    active: 0,
    newThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'Admin')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar estudantes:', profilesError);
        throw profilesError;
      }

      console.log('Estudantes encontrados:', profilesData?.length || 0);

      if (profilesData) {
        const mappedStudents: Student[] = profilesData.map(profile => ({
          id: profile.id,
          name: profile.name || 'Sem nome',
          email: profile.email,
          role: profile.role || 'Student',
          status: profile.status || 'Ativo',
          created_at: profile.created_at,
          permission_group_id: profile.permission_group_id,
          storage_used_mb: profile.storage_used_mb,
          storage_limit_mb: profile.storage_limit_mb,
          is_mentor: profile.is_mentor
        }));

        setStudents(mappedStudents);

        const { data: enrollmentsData } = await supabase
          .from('mentoring_enrollments')
          .select('student_id, status');

        const total = mappedStudents.length;
        const active = mappedStudents.filter(s => s.status === 'Ativo').length;
        
        const activeEnrollments = enrollmentsData?.filter(e => e.status === 'ativa') || [];
        const studentsWithMentorships = new Set(activeEnrollments.map(e => e.student_id)).size;

        const thisMonth = new Date();
        thisMonth.setDate(1);
        const newThisMonth = mappedStudents.filter(s => 
          new Date(s.created_at) >= thisMonth
        ).length;

        setStatistics({
          total,
          withMentorships: studentsWithMentorships,
          active,
          newThisMonth
        });
      }

    } catch (error) {
      console.error('Erro ao carregar estudantes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos estudantes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateStudent = useCallback(async (studentId: string, updates: Partial<Student>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno atualizado com sucesso",
      });

      await fetchStudents();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluno",
        variant: "destructive",
      });
      return false;
    }
  }, [fetchStudents, toast]);

  const deleteStudent = useCallback(async (studentId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(studentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso",
      });

      await fetchStudents();
      return true;
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir aluno",
        variant: "destructive",
      });
      return false;
    }
  }, [fetchStudents, toast]);

  const toggleStudentStatus = useCallback(async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    return await updateStudent(studentId, { status: newStatus });
  }, [updateStudent]);

  const toggleMentorStatus = useCallback(async (studentId: string, currentMentorStatus: boolean) => {
    return await updateStudent(studentId, { is_mentor: !currentMentorStatus });
  }, [updateStudent]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      student.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students: filteredStudents,
    statistics,
    isLoading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    refreshStudents: fetchStudents,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    toggleMentorStatus
  };
};
