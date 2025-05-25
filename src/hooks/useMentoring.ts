
import { useState, useMemo } from 'react';
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  UpdateSessionData,
  CreateExtensionData,
  MentoringExtension
} from '@/types/mentoring.types';
import { 
  mockMentoringCatalog, 
  mockStudentEnrollments, 
  mockMentoringSessions, 
  mockMentoringMaterials,
  getStudentEnrollments,
  getSessionsByEnrollment,
  getMaterialsByEnrollment,
  getUpcomingSessions
} from '@/data/mentoringData';

export const useMentoring = () => {
  const [catalogs] = useState<MentoringCatalog[]>(mockMentoringCatalog);
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>(mockStudentEnrollments);
  const [sessions] = useState<MentoringSession[]>(mockMentoringSessions);
  const [materials] = useState<MentoringMaterial[]>(mockMentoringMaterials);

  // Admin functions
  const createMentoringCatalog = async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      ...data,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating mentoring catalog:', newCatalog);
    return newCatalog;
  };

  const updateMentoringCatalog = async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<MentoringCatalog | null> => {
    const catalog = catalogs.find(c => c.id === id);
    if (!catalog) return null;
    
    const updated = {
      ...catalog,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating mentoring catalog:', updated);
    return updated;
  };

  const createSession = async (data: CreateSessionData): Promise<MentoringSession> => {
    const newSession: MentoringSession = {
      id: `session-${Date.now()}`,
      ...data,
      status: 'agendada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating session:', newSession);
    return newSession;
  };

  const updateSession = async (id: string, data: UpdateSessionData): Promise<MentoringSession | null> => {
    const session = sessions.find(s => s.id === id);
    if (!session) return null;
    
    const updated = {
      ...session,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating session:', updated);
    return updated;
  };

  const addExtension = async (data: CreateExtensionData): Promise<boolean> => {
    try {
      const enrollment = enrollments.find(e => e.id === data.enrollmentId);
      if (!enrollment) return false;

      const extension: MentoringExtension = {
        id: `ext-${Date.now()}`,
        enrollmentId: data.enrollmentId,
        extensionMonths: data.extensionMonths,
        appliedDate: new Date().toISOString(),
        notes: data.notes,
        adminId: 'current-admin-id', // In real app, get from auth context
        createdAt: new Date().toISOString()
      };

      // Calculate new end date
      const currentEndDate = new Date(enrollment.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + data.extensionMonths);

      // Update enrollment
      const updatedEnrollment: StudentMentoringEnrollment = {
        ...enrollment,
        endDate: newEndDate.toISOString(),
        originalEndDate: enrollment.originalEndDate || enrollment.endDate,
        extensions: [...(enrollment.extensions || []), extension],
        hasExtension: true,
        updatedAt: new Date().toISOString()
      };

      // Update state
      setEnrollments(prev => 
        prev.map(e => e.id === data.enrollmentId ? updatedEnrollment : e)
      );

      console.log('Extension added successfully:', extension);
      return true;
    } catch (error) {
      console.error('Error adding extension:', error);
      return false;
    }
  };

  // Student functions
  const getMyEnrollments = (studentId: string): StudentMentoringEnrollment[] => {
    return getStudentEnrollments(studentId);
  };

  const getEnrollmentSessions = (enrollmentId: string): MentoringSession[] => {
    return getSessionsByEnrollment(enrollmentId);
  };

  const getEnrollmentMaterials = (enrollmentId: string): MentoringMaterial[] => {
    return getMaterialsByEnrollment(enrollmentId);
  };

  const getMyUpcomingSessions = (studentId: string): MentoringSession[] => {
    return getUpcomingSessions(studentId);
  };

  const getSessionDetails = (sessionId: string): MentoringSession | undefined => {
    return sessions.find(s => s.id === sessionId);
  };

  // Statistics
  const getEnrollmentProgress = (enrollment: StudentMentoringEnrollment) => {
    const percentage = (enrollment.sessionsUsed / enrollment.totalSessions) * 100;
    const remaining = enrollment.totalSessions - enrollment.sessionsUsed;
    const daysRemaining = Math.ceil((new Date(enrollment.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      percentage: Math.min(percentage, 100),
      sessionsRemaining: Math.max(remaining, 0),
      daysRemaining: Math.max(daysRemaining, 0),
      isExpired: daysRemaining < 0,
      isCompleted: enrollment.sessionsUsed >= enrollment.totalSessions
    };
  };

  return {
    // Data
    catalogs,
    enrollments,
    sessions,
    materials,
    
    // Admin functions
    createMentoringCatalog,
    updateMentoringCatalog,
    createSession,
    updateSession,
    addExtension,
    
    // Student functions
    getMyEnrollments,
    getEnrollmentSessions,
    getEnrollmentMaterials,
    getMyUpcomingSessions,
    getSessionDetails,
    getEnrollmentProgress
  };
};
