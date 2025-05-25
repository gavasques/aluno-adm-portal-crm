
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial 
} from '@/types/mentoring.types';
import { 
  getStudentEnrollments,
  getSessionsByEnrollment,
  getMaterialsByEnrollment,
  getUpcomingSessions
} from '@/data/mentoringData';

export const useSecureMentoring = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUserId = user?.id || null;

  // Set loading based on auth state
  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  // Função segura para buscar inscrições do usuário com loading
  const getMySecureEnrollments = useMemo((): StudentMentoringEnrollment[] => {
    if (!currentUserId || authLoading) return [];
    
    try {
      return getStudentEnrollments(currentUserId);
    } catch (err) {
      setError('Erro ao carregar inscrições');
      console.error('Erro ao buscar inscrições:', err);
      return [];
    }
  }, [currentUserId, authLoading]);

  // Função segura para verificar se uma inscrição pertence ao usuário
  const verifyEnrollmentOwnership = (enrollmentId: string): boolean => {
    if (!currentUserId || authLoading) return false;
    
    try {
      const userEnrollments = getStudentEnrollments(currentUserId);
      return userEnrollments.some(enrollment => enrollment.id === enrollmentId);
    } catch (err) {
      setError('Erro ao verificar permissões');
      console.error('Erro ao verificar ownership:', err);
      return false;
    }
  };

  // Função segura para buscar sessões com verificação de ownership
  const getSecureEnrollmentSessions = (enrollmentId: string): MentoringSession[] => {
    if (!verifyEnrollmentOwnership(enrollmentId)) {
      console.warn('Acesso negado: usuário não possui acesso a esta inscrição');
      setError('Acesso negado a esta mentoria');
      return [];
    }
    
    try {
      return getSessionsByEnrollment(enrollmentId);
    } catch (err) {
      setError('Erro ao carregar sessões');
      console.error('Erro ao buscar sessões:', err);
      return [];
    }
  };

  // Função segura para buscar materiais com verificação de ownership
  const getSecureEnrollmentMaterials = (enrollmentId: string): MentoringMaterial[] => {
    if (!verifyEnrollmentOwnership(enrollmentId)) {
      console.warn('Acesso negado: usuário não possui acesso a esta inscrição');
      setError('Acesso negado a esta mentoria');
      return [];
    }
    
    try {
      return getMaterialsByEnrollment(enrollmentId);
    } catch (err) {
      setError('Erro ao carregar materiais');
      console.error('Erro ao buscar materiais:', err);
      return [];
    }
  };

  // Função segura para buscar próximas sessões
  const getMySecureUpcomingSessions = useMemo((): MentoringSession[] => {
    if (!currentUserId || authLoading) return [];
    
    try {
      return getUpcomingSessions(currentUserId);
    } catch (err) {
      setError('Erro ao carregar sessões próximas');
      console.error('Erro ao buscar próximas sessões:', err);
      return [];
    }
  }, [currentUserId, authLoading]);

  // Função para buscar detalhes de inscrição com verificação de segurança
  const getSecureEnrollmentDetails = (enrollmentId: string): StudentMentoringEnrollment | null => {
    if (!currentUserId || authLoading) return null;
    
    try {
      const userEnrollments = getStudentEnrollments(currentUserId);
      const enrollment = userEnrollments.find(e => e.id === enrollmentId);
      
      if (!enrollment) {
        console.warn('Inscrição não encontrada ou acesso negado');
        setError('Mentoria não encontrada');
        return null;
      }
      
      return enrollment;
    } catch (err) {
      setError('Erro ao carregar detalhes da mentoria');
      console.error('Erro ao buscar detalhes:', err);
      return null;
    }
  };

  // Função para limpar erros
  const clearError = () => setError(null);

  return {
    currentUserId,
    isAuthenticated: !!currentUserId,
    loading: authLoading || loading,
    error,
    clearError,
    getMySecureEnrollments,
    verifyEnrollmentOwnership,
    getSecureEnrollmentSessions,
    getSecureEnrollmentMaterials,
    getMySecureUpcomingSessions,
    getSecureEnrollmentDetails
  };
};
