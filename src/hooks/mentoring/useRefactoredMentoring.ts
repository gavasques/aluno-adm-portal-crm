
import { useMentoringCatalog } from './useMentoringCatalog';
import { useMentoringEnrollments } from './useMentoringEnrollments';
import { useMentoringSessions } from './useMentoringSessions';
import { useMentoringMaterials } from './useMentoringMaterials';

export const useRefactoredMentoring = () => {
  const catalogHook = useMentoringCatalog();
  const enrollmentsHook = useMentoringEnrollments();
  const sessionsHook = useMentoringSessions();
  const materialsHook = useMentoringMaterials();

  return {
    // Catalog
    catalogs: catalogHook.catalogs,
    createMentoringCatalog: catalogHook.createCatalog,
    updateMentoringCatalog: catalogHook.updateCatalog,
    deleteMentoringCatalog: catalogHook.deleteCatalog,
    
    // Enrollments
    enrollments: enrollmentsHook.enrollments,
    getMyEnrollments: enrollmentsHook.getStudentEnrollments,
    addExtension: enrollmentsHook.addExtension,
    getEnrollmentProgress: enrollmentsHook.getEnrollmentProgress,
    
    // Sessions
    sessions: sessionsHook.sessions,
    getEnrollmentSessions: sessionsHook.getEnrollmentSessions,
    getSessionDetails: sessionsHook.getSessionDetails,
    getMyUpcomingSessions: sessionsHook.getUpcomingSessions,
    createSession: sessionsHook.createSession,
    
    // Materials
    materials: materialsHook.materials,
    getEnrollmentMaterials: materialsHook.getEnrollmentMaterials,
    getSessionMaterials: materialsHook.getSessionMaterials,
    
    // Loading states
    loading: catalogHook.loading || enrollmentsHook.loading || sessionsHook.loading || materialsHook.loading
  };
};
