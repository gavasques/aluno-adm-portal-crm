
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
  expandedMentoringCatalog, 
  expandedStudentEnrollments, 
  expandedMentoringSessions, 
  expandedMentoringMaterials
} from '@/data/expandedMentoringData';

export const useMentoring = () => {
  // Inicializar com dados mock
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>(() => {
    console.log('Initializing catalogs with mock data:', expandedMentoringCatalog.length);
    return expandedMentoringCatalog;
  });
  
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>(() => {
    console.log('Initializing enrollments with mock data:', expandedStudentEnrollments.length);
    return expandedStudentEnrollments;
  });
  
  const [sessions, setSessions] = useState<MentoringSession[]>(() => {
    console.log('Initializing sessions with mock data:', expandedMentoringSessions.length);
    return expandedMentoringSessions;
  });
  
  const [materials] = useState<MentoringMaterial[]>(() => {
    console.log('Initializing materials with mock data:', expandedMentoringMaterials.length);
    return expandedMentoringMaterials;
  });

  console.log('useMentoring hook - Current state:');
  console.log('- catalogs:', catalogs.length);
  console.log('- enrollments:', enrollments.length);
  console.log('- sessions:', sessions.length);
  console.log('- materials:', materials.length);

  // Admin functions
  const createMentoringCatalog = async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      ...data,
      totalSessions: data.numberOfSessions,
      tags: [],
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCatalogs(prev => {
      const updated = [...prev, newCatalog];
      console.log('Created new catalog, total catalogs:', updated.length);
      return updated;
    });
    return newCatalog;
  };

  const updateMentoringCatalog = async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> => {
    try {
      setCatalogs(prev => prev.map(catalog => {
        if (catalog.id === id) {
          return {
            ...catalog,
            ...data,
            updatedAt: new Date().toISOString()
          };
        }
        return catalog;
      }));
      
      console.log('Updated mentoring catalog:', id, data);
      return true;
    } catch (error) {
      console.error('Error updating catalog:', error);
      return false;
    }
  };

  const deleteMentoringCatalog = async (id: string): Promise<boolean> => {
    try {
      setCatalogs(prev => prev.filter(catalog => catalog.id !== id));
      console.log('Deleted mentoring catalog:', id);
      return true;
    } catch (error) {
      console.error('Error deleting catalog:', error);
      return false;
    }
  };

  const createSession = async (data: CreateSessionData): Promise<MentoringSession> => {
    const newSession: MentoringSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: 'agendada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSessions(prev => {
      const updated = [...prev, newSession];
      console.log('Created new session, total sessions:', updated.length);
      return updated;
    });
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
    
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
    console.log('Updated session:', updated);
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
        adminId: 'current-admin-id',
        createdAt: new Date().toISOString()
      };

      const currentEndDate = new Date(enrollment.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + data.extensionMonths);

      const updatedEnrollment: StudentMentoringEnrollment = {
        ...enrollment,
        endDate: newEndDate.toISOString(),
        originalEndDate: enrollment.originalEndDate || enrollment.endDate,
        extensions: [...(enrollment.extensions || []), extension],
        hasExtension: true,
        updatedAt: new Date().toISOString()
      };

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
    return enrollments.filter(e => e.studentId === studentId);
  };

  const getEnrollmentSessions = (enrollmentId: string): MentoringSession[] => {
    return sessions.filter(s => s.enrollmentId === enrollmentId);
  };

  const getEnrollmentMaterials = (enrollmentId: string): MentoringMaterial[] => {
    return materials.filter(m => m.enrollmentId === enrollmentId);
  };

  const getMyUpcomingSessions = (studentId: string): MentoringSession[] => {
    const studentEnrollments = getMyEnrollments(studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    return sessions
      .filter(s => 
        enrollmentIds.includes(s.enrollmentId) && 
        s.status === 'agendada' &&
        new Date(s.scheduledDate) > new Date()
      )
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
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
    deleteMentoringCatalog,
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
