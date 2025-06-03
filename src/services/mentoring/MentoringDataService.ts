import { MentoringCatalog, CreateMentoringCatalogData, MentoringExtensionOption, StudentMentoringEnrollment, MentoringSession, MentoringMaterial, CreateSessionData, UpdateSessionData, CreateExtensionData, MentoringExtension } from '@/types/mentoring.types';
import { expandedMentoringCatalog, expandedStudentEnrollments, expandedMentoringSessions, expandedMentoringMaterials } from '@/data/expandedMentoringData';
import { calculateSessionsFromFrequency } from '@/utils/mentoringCalculations';

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [...expandedMentoringCatalog];
  private enrollments: StudentMentoringEnrollment[] = [...expandedStudentEnrollments];
  private sessions: MentoringSession[] = [...expandedMentoringSessions];
  private materials: MentoringMaterial[] = [...expandedMentoringMaterials];

  // Catalog methods
  getCatalogs(): MentoringCatalog[] {
    return this.catalogs.map(catalog => ({
      ...catalog,
      extensions: catalog.extensions || [
        {
          id: `ext-1-${catalog.id}`,
          months: 3,
          price: catalog.price * 0.3,
          totalSessions: calculateSessionsFromFrequency(3, catalog.frequency || 'Semanal'),
          description: `Extensão de 3 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-3-months',
            hubla: 'https://hubla.com/checkout/ext-3-months',
            hotmart: 'https://hotmart.com/checkout/ext-3-months'
          }
        },
        {
          id: `ext-2-${catalog.id}`,
          months: 6,
          price: catalog.price * 0.5,
          totalSessions: calculateSessionsFromFrequency(6, catalog.frequency || 'Semanal'),
          description: `Extensão de 6 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-6-months',
            hubla: 'https://hubla.com/checkout/ext-6-months'
          }
        }
      ]
    }));
  }

  getCatalogById(id: string): MentoringCatalog | null {
    return this.catalogs.find(c => c.id === id) || null;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      durationMonths: data.durationMonths,
      frequency: data.frequency || 'Semanal',
      numberOfSessions: data.numberOfSessions || calculateSessionsFromFrequency(data.durationMonths, data.frequency || 'Semanal'),
      totalSessions: data.numberOfSessions || calculateSessionsFromFrequency(data.durationMonths, data.frequency || 'Semanal'),
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

  // Enrollment methods
  getEnrollments(): StudentMentoringEnrollment[] {
    return [...this.enrollments];
  }

  getStudentEnrollments(studentId: string): StudentMentoringEnrollment[] {
    return this.enrollments.filter(e => e.studentId === studentId);
  }

  createEnrollment(enrollmentData: any): StudentMentoringEnrollment {
    const mentoring = this.getCatalogById(enrollmentData.mentoringId);
    if (!mentoring) {
      throw new Error('Mentoria não encontrada');
    }

    const newEnrollment: StudentMentoringEnrollment = {
      id: `enrollment-${Date.now()}`,
      studentId: enrollmentData.studentId || 'student-001',
      mentoringId: enrollmentData.mentoringId,
      mentoring: mentoring,
      status: 'ativa',
      enrollmentDate: new Date().toISOString(),
      startDate: enrollmentData.startDate || new Date().toISOString(),
      endDate: enrollmentData.endDate || new Date(Date.now() + mentoring.durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
      sessionsUsed: 0,
      totalSessions: mentoring.numberOfSessions,
      responsibleMentor: enrollmentData.responsibleMentor || mentoring.instructor,
      paymentStatus: 'pago',
      observations: enrollmentData.observations,
      hasExtension: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  addExtension(data: CreateExtensionData): boolean {
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

  getEnrollmentProgress(enrollment: StudentMentoringEnrollment) {
    const completedSessions = this.sessions.filter(s => 
      s.enrollmentId === enrollment.id && s.status === 'concluida'
    ).length;
    
    const noShowSessions = this.sessions.filter(s => 
      s.enrollmentId === enrollment.id && s.status === 'no_show_aluno'
    ).length;
    
    const totalSessions = this.sessions.filter(s => 
      s.enrollmentId === enrollment.id
    ).length;
    
    const availableSessions = totalSessions - noShowSessions;
    const percentage = availableSessions > 0 ? (completedSessions / availableSessions) * 100 : 0;
    
    const daysRemaining = Math.ceil(
      (new Date(enrollment.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      percentage: Math.min(percentage, 100),
      completedSessions,
      sessionsUsed: completedSessions,
      totalSessions: availableSessions,
      pendingSessions: Math.max(0, availableSessions - completedSessions),
      scheduledSessions: this.sessions.filter(s => 
        s.enrollmentId === enrollment.id && s.status === 'agendada'
      ).length,
      daysRemaining: Math.max(daysRemaining, 0),
      isExpired: daysRemaining < 0,
      isCompleted: completedSessions >= availableSessions
    };
  }

  // Session methods
  getSessions(): MentoringSession[] {
    return [...this.sessions];
  }

  getEnrollmentSessions(enrollmentId: string): MentoringSession[] {
    return this.sessions.filter(s => s.enrollmentId === enrollmentId);
  }

  getSessionDetails(sessionId: string): MentoringSession | undefined {
    return this.sessions.find(s => s.id === sessionId);
  }

  getUpcomingSessions(studentId: string): MentoringSession[] {
    const studentEnrollments = this.getStudentEnrollments(studentId);
    const enrollmentIds = studentEnrollments.map(e => e.id);
    
    return this.sessions.filter(session => 
      enrollmentIds.includes(session.enrollmentId) && 
      session.status === 'agendada' &&
      session.scheduledDate &&
      new Date(session.scheduledDate) > new Date()
    ).sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
  }

  createSession(data: CreateSessionData): MentoringSession {
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
      status: data.status || 'aguardando_agendamento',
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

  updateSession(sessionId: string, data: UpdateSessionData): boolean {
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

  deleteSession(sessionId: string): boolean {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return false;

    this.sessions.splice(index, 1);
    return true;
  }

  scheduleSession(sessionId: string, scheduledDate: string, meetingLink?: string): boolean {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return false;

    this.sessions[index] = {
      ...this.sessions[index],
      scheduled_date: scheduledDate,
      scheduledDate,
      meeting_link: meetingLink,
      meetingLink,
      status: 'agendada',
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return true;
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
}
