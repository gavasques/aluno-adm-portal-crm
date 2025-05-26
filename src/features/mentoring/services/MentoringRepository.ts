
import { IMentoringRepository } from '../types/contracts.types';
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

export class MentoringRepository implements IMentoringRepository {
  private catalogs: MentoringCatalog[] = [];
  private enrollments: StudentMentoringEnrollment[] = [];
  private sessions: MentoringSession[] = [];
  private materials: MentoringMaterial[] = [];

  // Catalog operations
  async getCatalogs(): Promise<MentoringCatalog[]> {
    return [...this.catalogs];
  }

  async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    return this.catalogs.find(c => c.id === id) || null;
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
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

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs[index] = {
      ...this.catalogs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  async deleteCatalog(id: string): Promise<boolean> {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs.splice(index, 1);
    return true;
  }

  // Enrollment operations
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    return [...this.enrollments];
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    return this.enrollments.filter(e => e.studentId === studentId);
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
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
  async getSessions(): Promise<MentoringSession[]> {
    return [...this.sessions];
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    return this.sessions.filter(s => s.enrollmentId === enrollmentId);
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
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
  async getMaterials(): Promise<MentoringMaterial[]> {
    return [...this.materials];
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    return this.materials.filter(m => m.enrollmentId === enrollmentId);
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    return this.materials.filter(m => m.sessionId === sessionId);
  }
}
