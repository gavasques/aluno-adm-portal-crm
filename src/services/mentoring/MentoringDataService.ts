
import { 
  MentoringCatalog, 
  CreateMentoringCatalogData, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateSessionData,
  CreateExtensionData,
  MentoringExtension,
  UpdateSessionData,
  EnrollmentProgress
} from '@/types/mentoring.types';

import { expandedMentoringCatalog, expandedStudentEnrollments, expandedMentoringSessions, expandedMentoringMaterials } from '@/data/expandedMentoringData';

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [...expandedMentoringCatalog];
  private enrollments: StudentMentoringEnrollment[] = [...expandedStudentEnrollments];
  private sessions: MentoringSession[] = [...expandedMentoringSessions];
  private materials: MentoringMaterial[] = [...expandedMentoringMaterials];

  // Catalog methods
  getCatalogs(): MentoringCatalog[] {
    return [...this.catalogs];
  }

  getCatalogById(id: string): MentoringCatalog | null {
    return this.catalogs.find(c => c.id === id) || null;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      ...data,
      totalSessions: data.numberOfSessions,
      tags: [],
      active: data.active ?? true,
      status: data.status ?? 'Ativa',
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
      status: data.status ?? this.catalogs[index].status,
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

  // Enrollment methods
  getEnrollments(): StudentMentoringEnrollment[] {
    return [...this.enrollments];
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

  getEnrollmentProgress(enrollment: StudentMentoringEnrollment): EnrollmentProgress {
    const sessions = this.getEnrollmentSessions(enrollment.id);
    const completedSessions = sessions.filter(s => s.status === 'realizada').length;
    const scheduledSessions = sessions.filter(s => s.status === 'agendada').length;
    const pendingSessions = enrollment.totalSessions - completedSessions - scheduledSessions;
    
    const endDate = new Date(enrollment.endDate);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      completedSessions,
      totalSessions: enrollment.totalSessions,
      pendingSessions: Math.max(0, pendingSessions),
      scheduledSessions,
      percentage: Math.round((completedSessions / enrollment.totalSessions) * 100),
      daysRemaining
    };
  }

  // Session methods
  getSessions(): MentoringSession[] {
    return [...this.sessions];
  }

  getEnrollmentSessions(enrollmentId: string): MentoringSession[] {
    return this.sessions.filter(s => s.enrollmentId === enrollmentId);
  }

  getSessionById(sessionId: string): MentoringSession | undefined {
    return this.sessions.find(s => s.id === sessionId);
  }

  getUpcomingSessions(studentId: string): MentoringSession[] {
    const studentEnrollments = this.getStudentEnrollments(studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    return this.sessions.filter(s => 
      enrollmentIds.includes(s.enrollmentId) && 
      s.status === 'agendada' &&
      s.scheduledDate &&
      new Date(s.scheduledDate) > new Date()
    );
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

  updateSession(sessionId: string, data: UpdateSessionData): boolean {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return false;

    this.sessions[index] = {
      ...this.sessions[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  scheduleSession(sessionId: string, scheduledDate: string, meetingLink?: string): boolean {
    return this.updateSession(sessionId, {
      scheduledDate,
      meetingLink,
      status: 'agendada'
    });
  }

  // Material methods
  getMaterials(): MentoringMaterial[] {
    return [...this.materials];
  }

  getEnrollmentMaterials(enrollmentId: string): MentoringMaterial[] {
    return this.materials.filter(m => m.enrollmentId === enrollmentId);
  }

  getSessionMaterials(sessionId: string): MentoringMaterial[] {
    return this.materials.filter(m => m.sessionId === sessionId);
  }

  getSessionDetails(sessionId: string): MentoringSession | undefined {
    return this.getSessionById(sessionId);
  }
}
