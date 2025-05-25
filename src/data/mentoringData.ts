
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial 
} from '@/types/mentoring.types';
import {
  expandedMentoringCatalog,
  expandedStudentEnrollments,
  expandedMentoringSessions,
  expandedMentoringMaterials
} from './expandedMentoringData';

// Mock Mentoring Stats
export const mockMentoringStats = {
  totalEnrollments: 245,
  activeEnrollments: 189,
  completedSessions: 1247,
  upcomingSessions: 23,
  totalMaterials: 567,
  averageRating: 4.7
};

// Usar dados expandidos
export const mockMentoringCatalog: MentoringCatalog[] = expandedMentoringCatalog;
export const mockStudentEnrollments: StudentMentoringEnrollment[] = expandedStudentEnrollments;
export const mockMentoringSessions: MentoringSession[] = expandedMentoringSessions;
export const mockMentoringMaterials: MentoringMaterial[] = expandedMentoringMaterials;

// Helper functions to get data with security checks
export const getStudentEnrollments = (studentId: string): StudentMentoringEnrollment[] => {
  if (!studentId) {
    console.warn('ID do estudante não fornecido');
    return [];
  }
  return mockStudentEnrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getSessionsByEnrollment = (enrollmentId: string): MentoringSession[] => {
  if (!enrollmentId) {
    console.warn('ID da inscrição não fornecido');
    return [];
  }
  return mockMentoringSessions.filter(session => session.enrollmentId === enrollmentId);
};

export const getMaterialsByEnrollment = (enrollmentId: string): MentoringMaterial[] => {
  if (!enrollmentId) {
    console.warn('ID da inscrição não fornecido');
    return [];
  }
  return mockMentoringMaterials.filter(material => material.enrollmentId === enrollmentId);
};

export const getUpcomingSessions = (studentId: string): MentoringSession[] => {
  if (!studentId) {
    console.warn('ID do estudante não fornecido');
    return [];
  }
  
  const studentEnrollments = getStudentEnrollments(studentId);
  const enrollmentIds = studentEnrollments.map(e => e.id);
  
  return mockMentoringSessions.filter(session => 
    enrollmentIds.includes(session.enrollmentId) && 
    session.status === 'agendada' &&
    new Date(session.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
};

// Função para verificar se um estudante tem acesso a uma inscrição específica
export const verifyStudentEnrollmentAccess = (studentId: string, enrollmentId: string): boolean => {
  if (!studentId || !enrollmentId) return false;
  
  const studentEnrollments = getStudentEnrollments(studentId);
  return studentEnrollments.some(enrollment => enrollment.id === enrollmentId);
};

// Função para buscar detalhes seguros de uma inscrição
export const getSecureEnrollmentDetails = (studentId: string, enrollmentId: string): StudentMentoringEnrollment | null => {
  if (!verifyStudentEnrollmentAccess(studentId, enrollmentId)) {
    console.warn('Acesso negado: estudante não possui acesso a esta inscrição');
    return null;
  }
  
  return mockStudentEnrollments.find(enrollment => 
    enrollment.id === enrollmentId && enrollment.studentId === studentId
  ) || null;
};
