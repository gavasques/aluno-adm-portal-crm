
import { useEffect } from 'react';
import { useSupabaseMentoringCatalog } from './useSupabaseMentoringCatalog';
import { useSupabaseMentoringEnrollments } from './useSupabaseMentoringEnrollments';
import { useSupabaseMentoringSessions } from './useSupabaseMentoringSessions';
import { useSupabaseMentoringMaterials } from './useSupabaseMentoringMaterials';

export const useSupabaseMentoring = () => {
  // Use individual hooks
  const catalogHook = useSupabaseMentoringCatalog();
  const enrollmentHook = useSupabaseMentoringEnrollments();
  const sessionHook = useSupabaseMentoringSessions();
  const materialHook = useSupabaseMentoringMaterials();

  // Load initial data
  useEffect(() => {
    console.log('🔄 Carregando dados iniciais...');
    catalogHook.refreshCatalogs();
    enrollmentHook.refreshEnrollments();
    sessionHook.refreshSessions();
    materialHook.refreshMaterials();
  }, []);

  // Combine loading states
  const loading = catalogHook.loading || enrollmentHook.loading || sessionHook.loading || materialHook.loading;

  return {
    // Data
    catalogs: catalogHook.catalogs,
    enrollments: enrollmentHook.enrollments,
    sessions: sessionHook.sessions,
    materials: materialHook.materials,
    loading,
    
    // Catalog methods
    createCatalog: catalogHook.createCatalog,
    updateCatalog: catalogHook.updateCatalog,
    deleteCatalog: catalogHook.deleteCatalog,
    refreshCatalogs: catalogHook.refreshCatalogs,
    
    // Enrollment methods
    createEnrollment: enrollmentHook.createEnrollment,
    getStudentEnrollments: enrollmentHook.getStudentEnrollments,
    addExtension: enrollmentHook.addExtension,
    deleteEnrollment: enrollmentHook.deleteEnrollment,
    refreshEnrollments: enrollmentHook.refreshEnrollments,
    
    // Session methods
    getEnrollmentSessions: sessionHook.getEnrollmentSessions,
    createSession: sessionHook.createSession,
    updateSession: sessionHook.updateSession,
    getSessionsByEnrollment: sessionHook.getSessionsByEnrollment,
    refreshSessions: sessionHook.refreshSessions,
    
    // Material methods
    getEnrollmentMaterials: materialHook.getEnrollmentMaterials,
    getSessionMaterials: materialHook.getSessionMaterials,
    refreshMaterials: materialHook.refreshMaterials,
    
    // Repository access (using catalog repository as they're all the same instance)
    repository: catalogHook.repository
  };
};
