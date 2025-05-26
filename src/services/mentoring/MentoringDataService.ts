
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  CreateExtensionData,
  MentoringExtension
} from '@/types/mentoring.types';

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [];
  private enrollments: StudentMentoringEnrollment[] = [];
  private sessions: MentoringSession[] = [];
  private materials: MentoringMaterial[] = [];

  // Catalog operations
  getCatalogs(): MentoringCatalog[] {
    return this.catalogs;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      ...data,
      totalSessions: data.numberOfSessions,
      tags: [],
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.catalogs.push(newCatalog);
    return newCatalog;
  }

  updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): boolean {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs[index] = {
      ...this.catalogs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  deleteCatalog(id: string): boolean {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs.splice(index, 1);
    return true;
  }

  // Enrollment operations
  getEnrollments(): StudentMentoringEnrollment[] {
    return this.enrollments;
  }

  getStudentEnrollments(studentId: string): StudentMentoringEnrollment[] {
    return this.enrollments.filter(e => e.studentId === studentId);
  }

  addExtension(data: CreateExtensionData): boolean {
    const enrollment = this.enrollments.find(e => e.id === data.enrollmentId);
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

    enrollment.endDate = newEndDate.toISOString();
    enrollment.originalEndDate = enrollment.originalEndDate || enrollment.endDate;
    enrollment.extensions = [...(enrollment.extensions || []), extension];
    enrollment.hasExtension = true;
    enrollment.updatedAt = new Date().toISOString();

    return true;
  }

  // Session operations
  getSessions(): MentoringSession[] {
    return this.sessions;
  }

  getEnrollmentSessions(enrollmentId: string): MentoringSession[] {
    return this.sessions.filter(s => s.enrollmentId === enrollmentId);
  }

  getSessionById(sessionId: string): MentoringSession | undefined {
    return this.sessions.find(s => s.id === sessionId);
  }

  createSession(data: CreateSessionData): MentoringSession {
    const newSession: MentoringSession = {
      id: `session-${Date.now()}`,
      ...data,
      sessionNumber: this.sessions.filter(s => s.enrollmentId === data.enrollmentId).length + 1,
      status: 'agendada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.sessions.push(newSession);
    return newSession;
  }

  // Material operations
  getMaterials(): MentoringMaterial[] {
    return this.materials;
  }

  getEnrollmentMaterials(enrollmentId: string): MentoringMaterial[] {
    return this.materials.filter(m => m.enrollmentId === enrollmentId);
  }

  getSessionMaterials(sessionId: string): MentoringMaterial[] {
    return this.materials.filter(m => m.sessionId === sessionId);
  }

  // Statistics
  getEnrollmentProgress(enrollment: StudentMentoringEnrollment) {
    const percentage = (enrollment.sessionsUsed / enrollment.totalSessions) * 100;
    const daysRemaining = Math.ceil(
      (new Date(enrollment.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      percentage: Math.min(percentage, 100),
      sessionsUsed: enrollment.sessionsUsed,
      totalSessions: enrollment.totalSessions,
      daysRemaining: Math.max(daysRemaining, 0)
    };
  }

  getUpcomingSessions(studentId: string): MentoringSession[] {
    const studentEnrollments = this.getStudentEnrollments(studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    return this.sessions
      .filter(s => 
        enrollmentIds.includes(s.enrollmentId) && 
        s.status === 'agendada' &&
        new Date(s.scheduledDate) > new Date()
      )
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }
}
