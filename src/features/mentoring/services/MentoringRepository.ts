
import { IMentoringRepository } from '../types/contracts.types';
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  CreateExtensionData,
  MentoringExtension,
  UpdateSessionData
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
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      durationMonths: data.durationMonths,
      frequency: data.frequency || 'Semanal',
      numberOfSessions: data.numberOfSessions || 0,
      totalSessions: data.numberOfSessions || 0,
      price: data.price,
      description: data.description,
      tags: [],
      active: data.active ?? true,
      status: data.status ?? 'Ativa',
      extensions: data.extensions || [],
      checkoutLinks: data.checkoutLinks,
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

  async createEnrollment(data: any): Promise<StudentMentoringEnrollment> {
    const newEnrollment: StudentMentoringEnrollment = {
      id: `enrollment-${Date.now()}`,
      studentId: data.studentId || 'student-001',
      mentoringId: data.mentoringId,
      mentoring: {
        id: data.mentoringId,
        name: 'Sample Mentoring',
        type: 'Individual' as const,
        frequency: 'Semanal',
        durationMonths: 6,
        extensions: [],
        description: 'Sample description'
      },
      status: 'ativa' as const,
      enrollmentDate: new Date().toISOString(),
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      sessionsUsed: 0,
      totalSessions: 12,
      responsibleMentor: data.responsibleMentor || 'mentor@example.com',
      paymentStatus: 'pago',
      observations: data.observations,
      hasExtension: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const index = this.enrollments.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.enrollments.splice(index, 1);
    return true;
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    const enrollment = this.enrollments.find(e => e.id === data.enrollmentId);
    if (!enrollment) return false;

    const extension: MentoringExtension = {
      id: `ext-${Date.now()}`,
      enrollment_id: data.enrollmentId,
      enrollmentId: data.enrollmentId,
      extension_months: data.extensionMonths,
      extensionMonths: data.extensionMonths,
      applied_date: new Date().toISOString(),
      appliedDate: new Date().toISOString(),
      notes: data.notes,
      admin_id: 'current-admin-id',
      adminId: 'current-admin-id',
      created_at: new Date().toISOString(),
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

  async removeExtension(extensionId: string): Promise<boolean> {
    // Find and remove extension from enrollments
    for (const enrollment of this.enrollments) {
      if (enrollment.extensions) {
        const extensionIndex = enrollment.extensions.findIndex(ext => ext.id === extensionId);
        if (extensionIndex !== -1) {
          enrollment.extensions.splice(extensionIndex, 1);
          enrollment.hasExtension = enrollment.extensions.length > 0;
          enrollment.updatedAt = new Date().toISOString();
          return true;
        }
      }
    }
    return false;
  }

  // Session operations
  async getSessions(): Promise<MentoringSession[]> {
    return [...this.sessions];
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    return this.sessions.filter(s => s.enrollmentId === enrollmentId);
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    const sessionNumber = data.sessionNumber || this.sessions.filter(s => s.enrollmentId === data.enrollmentId).length + 1;
    
    const newSession: MentoringSession = {
      id: `session-${Date.now()}`,
      enrollment_id: data.enrollmentId,
      enrollmentId: data.enrollmentId,
      type: data.type,
      title: data.title,
      scheduled_date: data.scheduledDate,
      scheduledDate: data.scheduledDate,
      scheduled_time: data.scheduledTime,
      duration_minutes: data.durationMinutes,
      durationMinutes: data.durationMinutes,
      meeting_link: data.meetingLink,
      meetingLink: data.meetingLink,
      observations: data.observations,
      session_number: sessionNumber,
      sessionNumber: sessionNumber,
      status: data.status || 'agendada',
      group_id: data.groupId,
      groupId: data.groupId,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.sessions.push(newSession);
    return newSession;
  }

  async updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean> {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return false;

    this.sessions[index] = {
      ...this.sessions[index],
      ...data,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return false;

    this.sessions.splice(index, 1);
    return true;
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

  async uploadMaterial(file: File, enrollmentId?: string, sessionId?: string): Promise<MentoringMaterial> {
    const material: MentoringMaterial = {
      id: `material-${Date.now()}`,
      enrollment_id: enrollmentId,
      enrollmentId: enrollmentId,
      session_id: sessionId,
      sessionId: sessionId,
      file_name: file.name,
      fileName: file.name,
      file_url: `fake-url/${file.name}`,
      fileUrl: `fake-url/${file.name}`,
      file_type: file.type,
      fileType: file.type,
      size_mb: file.size / (1024 * 1024),
      sizeMb: file.size / (1024 * 1024),
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.materials.push(material);
    return material;
  }
}
