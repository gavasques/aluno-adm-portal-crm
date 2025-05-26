
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
  console.log('=== useMentoring HOOK INITIALIZATION ===');
  console.log('Available data from expandedMentoringData:');
  console.log('- expandedMentoringCatalog:', expandedMentoringCatalog?.length || 0);
  console.log('- expandedStudentEnrollments:', expandedStudentEnrollments?.length || 0);
  console.log('- expandedMentoringSessions:', expandedMentoringSessions?.length || 0);
  console.log('- expandedMentoringMaterials:', expandedMentoringMaterials?.length || 0);

  // Inicializar com dados mock garantindo que existem
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>(() => {
    const data = expandedMentoringCatalog || [];
    console.log('Initializing catalogs with:', data.length, 'items');
    return data;
  });
  
  const [enrollments, setEnrollments] = useState<StudentMentoringEnrollment[]>(() => {
    const data = expandedStudentEnrollments || [];
    console.log('Initializing enrollments with:', data.length, 'items');
    return data;
  });
  
  const [sessions, setSessions] = useState<MentoringSession[]>(() => {
    const data = expandedMentoringSessions || [];
    console.log('Initializing sessions with:', data.length, 'items');
    return data;
  });
  
  const [materials] = useState<MentoringMaterial[]>(() => {
    const data = expandedMentoringMaterials || [];
    console.log('Initializing materials with:', data.length, 'items');
    return data;
  });

  console.log('=== useMentoring CURRENT STATE ===');
  console.log('- catalogs count:', catalogs.length);
  console.log('- enrollments count:', enrollments.length);
  console.log('- sessions count:', sessions.length);
  console.log('- materials count:', materials.length);

  // Admin functions
  const createMentoringCatalog = async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    console.log('Creating mentoring catalog with data:', data);
    
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
      console.log('Created new catalog, total catalogs now:', updated.length);
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
    console.log('Creating session with data:', data);
    
    const newSession: MentoringSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: 'agendada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSessions(prev => {
      const updated = [...prev, newSession];
      console.log('Created new session, total sessions now:', updated.length);
      return updated;
    });
    return newSession;
  };

  const updateSession = async (id: string, data: UpdateSessionData): Promise<MentoringSession | null> => {
    const session = sessions.find(s => s.id === id);
    if (!session) {
      console.log('Session not found for update:', id);
      return null;
    }
    
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
      if (!enrollment) {
        console.log('Enrollment not found for extension:', data.enrollmentId);
        return false;
      }

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
    const result = enrollments.filter(e => e.studentId === studentId);
    console.log(`Getting enrollments for student ${studentId}:`, result.length);
    return result;
  };

  const getEnrollmentSessions = (enrollmentId: string): MentoringSession[] => {
    const result = sessions.filter(s => s.enrollmentId === enrollmentId);
    console.log(`Getting sessions for enrollment ${enrollmentId}:`, result.length);
    return result;
  };

  const getEnrollmentMaterials = (enrollmentId: string): MentoringMaterial[] => {
    const result = materials.filter(m => m.enrollmentId === enrollmentId);
    console.log(`Getting materials for enrollment ${enrollmentId}:`, result.length);
    return result;
  };

  const getMyUpcomingSessions = (studentId: string): MentoringSession[] => {
    const studentEnrollments = getMyEnrollments(studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    const result = sessions
      .filter(s => 
        enrollmentIds.includes(s.enrollmentId) && 
        s.status === 'agendada' &&
        new Date(s.scheduledDate) > new Date()
      )
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    
    console.log(`Getting upcoming sessions for student ${studentId}:`, result.length);
    return result;
  };

  const getSessionDetails = (sessionId: string): MentoringSession | undefined => {
    const result = sessions.find(s => s.id === sessionId);
    console.log(`Getting session details for ${sessionId}:`, result ? 'found' : 'not found');
    return result;
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

  console.log('=== useMentoring HOOK RETURNING DATA ===');
  console.log('Final counts - catalogs:', catalogs.length, 'enrollments:', enrollments.length, 'sessions:', sessions.length, 'materials:', materials.length);

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
