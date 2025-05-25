
import { useMemo } from 'react';
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
  const { user } = useAuth();
  
  const currentUserId = user?.id || null;

  // Função segura para buscar inscrições do usuário
  const getMySecureEnrollments = useMemo((): StudentMentoringEnrollment[] => {
    if (!currentUserId) return [];
    return getStudentEnrollments(currentUserId);
  }, [currentUserId]);

  // Função segura para verificar se uma inscrição pertence ao usuário
  const verifyEnrollmentOwnership = (enrollmentId: string): boolean => {
    if (!currentUserId) return false;
    const userEnrollments = getStudentEnrollments(currentUserId);
    return userEnrollments.some(enrollment => enrollment.id === enrollmentId);
  };

  // Função segura para buscar sessões com verificação de ownership
  const getSecureEnrollmentSessions = (enrollmentId: string): MentoringSession[] => {
    if (!verifyEnrollmentOwnership(enrollmentId)) {
      console.warn('Acesso negado: usuário não possui acesso a esta inscrição');
      return [];
    }
    return getSessionsByEnrollment(enrollmentId);
  };

  // Função segura para buscar materiais com verificação de ownership
  const getSecureEnrollmentMaterials = (enrollmentId: string): MentoringMaterial[] => {
    if (!verifyEnrollmentOwnership(enrollmentId)) {
      console.warn('Acesso negado: usuário não possui acesso a esta inscrição');
      return [];
    }
    return getMaterialsByEnrollment(enrollmentId);
  };

  // Função segura para buscar próximas sessões
  const getMySecureUpcomingSessions = useMemo((): MentoringSession[] => {
    if (!currentUserId) return [];
    return getUpcomingSessions(currentUserId);
  }, [currentUserId]);

  // Função para buscar detalhes de inscrição com verificação de segurança
  const getSecureEnrollmentDetails = (enrollmentId: string): StudentMentoringEnrollment | null => {
    if (!currentUserId) return null;
    
    const userEnrollments = getStudentEnrollments(currentUserId);
    const enrollment = userEnrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
      console.warn('Inscrição não encontrada ou acesso negado');
      return null;
    }
    
    return enrollment;
  };

  return {
    currentUserId,
    isAuthenticated: !!currentUserId,
    getMySecureEnrollments,
    verifyEnrollmentOwnership,
    getSecureEnrollmentSessions,
    getSecureEnrollmentMaterials,
    getMySecureUpcomingSessions,
    getSecureEnrollmentDetails
  };
};
