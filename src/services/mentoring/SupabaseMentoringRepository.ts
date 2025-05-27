
import { supabase } from '@/integrations/supabase/client';
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  CreateExtensionData,
  UpdateSessionData
} from '@/types/mentoring.types';

export class SupabaseMentoringRepository {
  // Helper method to map database catalog to TypeScript interface
  private mapCatalogFromDB(dbCatalog: any): MentoringCatalog {
    return {
      id: dbCatalog.id,
      name: dbCatalog.name,
      type: dbCatalog.type,
      instructor: dbCatalog.instructor,
      durationMonths: dbCatalog.duration_months,
      frequency: dbCatalog.frequency || 'Mensal',
      numberOfSessions: dbCatalog.number_of_sessions,
      totalSessions: dbCatalog.total_sessions,
      price: dbCatalog.price,
      description: dbCatalog.description,
      tags: dbCatalog.tags || [],
      imageUrl: dbCatalog.image_url,
      active: dbCatalog.active,
      status: dbCatalog.status,
      createdAt: dbCatalog.created_at,
      updatedAt: dbCatalog.updated_at
    };
  }

  // Helper method to map enrollment from database
  private mapEnrollmentFromDB(dbEnrollment: any): StudentMentoringEnrollment {
    return {
      id: dbEnrollment.id,
      studentId: dbEnrollment.student_id,
      mentoringId: dbEnrollment.mentoring_id,
      mentoring: dbEnrollment.mentoring ? this.mapCatalogFromDB(dbEnrollment.mentoring) : {} as MentoringCatalog,
      status: dbEnrollment.status,
      enrollmentDate: dbEnrollment.enrollment_date,
      startDate: dbEnrollment.start_date,
      endDate: dbEnrollment.end_date,
      originalEndDate: dbEnrollment.original_end_date,
      sessionsUsed: dbEnrollment.sessions_used,
      totalSessions: dbEnrollment.total_sessions,
      responsibleMentor: dbEnrollment.responsible_mentor,
      paymentStatus: dbEnrollment.payment_status,
      observations: dbEnrollment.observations,
      extensions: dbEnrollment.extensions || [],
      hasExtension: dbEnrollment.has_extension || false,
      createdAt: dbEnrollment.created_at,
      updatedAt: dbEnrollment.updated_at,
      groupId: dbEnrollment.group_id
    };
  }

  // Helper method to map session from database
  private mapSessionFromDB(dbSession: any): MentoringSession {
    return {
      id: dbSession.id,
      enrollmentId: dbSession.enrollment_id,
      enrollment: dbSession.enrollment ? this.mapEnrollmentFromDB(dbSession.enrollment) : undefined,
      sessionNumber: dbSession.session_number,
      type: dbSession.type,
      title: dbSession.title,
      scheduledDate: dbSession.scheduled_date,
      durationMinutes: dbSession.duration_minutes,
      status: dbSession.status,
      calendlyLink: dbSession.calendly_link,
      meetingLink: dbSession.meeting_link,
      recordingLink: dbSession.recording_link,
      mentorNotes: dbSession.mentor_notes,
      studentNotes: dbSession.student_notes,
      observations: dbSession.observations,
      transcription: dbSession.transcription,
      createdAt: dbSession.created_at,
      updatedAt: dbSession.updated_at,
      groupId: dbSession.group_id
    };
  }

  // Helper method to map material from database
  private mapMaterialFromDB(dbMaterial: any): MentoringMaterial {
    return {
      id: dbMaterial.id,
      sessionId: dbMaterial.session_id,
      enrollmentId: dbMaterial.enrollment_id,
      session: dbMaterial.session ? this.mapSessionFromDB(dbMaterial.session) : undefined,
      enrollment: dbMaterial.enrollment ? this.mapEnrollmentFromDB(dbMaterial.enrollment) : undefined,
      fileName: dbMaterial.file_name,
      fileUrl: dbMaterial.file_url,
      type: dbMaterial.file_type,
      description: dbMaterial.description,
      storagePath: dbMaterial.storage_path,
      fileType: dbMaterial.file_type,
      sizeMB: dbMaterial.size_mb,
      uploaderId: dbMaterial.uploader_id,
      uploaderType: dbMaterial.uploader_type,
      tags: dbMaterial.tags || [],
      createdAt: dbMaterial.created_at,
      updatedAt: dbMaterial.updated_at
    };
  }

  // Catalog methods
  async getCatalogs(): Promise<MentoringCatalog[]> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(catalog => this.mapCatalogFromDB(catalog));
  }

  async createCatalog(catalogData: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    // Calculate total sessions based on duration and frequency
    const totalSessions = this.calculateTotalSessions(
      catalogData.durationMonths, 
      catalogData.frequency
    );

    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .insert({
        name: catalogData.name,
        type: catalogData.type,
        instructor: catalogData.instructor,
        duration_months: catalogData.durationMonths,
        frequency: catalogData.frequency,
        number_of_sessions: totalSessions,
        total_sessions: totalSessions,
        price: catalogData.price,
        description: catalogData.description,
        active: catalogData.active ?? true,
        status: catalogData.status ?? 'Ativa'
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapCatalogFromDB(data);
  }

  async updateCatalog(id: string, catalogData: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const updateData: any = {};
    
    // Map camelCase to snake_case
    if (catalogData.name) updateData.name = catalogData.name;
    if (catalogData.type) updateData.type = catalogData.type;
    if (catalogData.instructor) updateData.instructor = catalogData.instructor;
    if (catalogData.durationMonths) updateData.duration_months = catalogData.durationMonths;
    if (catalogData.frequency) updateData.frequency = catalogData.frequency;
    if (catalogData.price) updateData.price = catalogData.price;
    if (catalogData.description) updateData.description = catalogData.description;
    if (catalogData.active !== undefined) updateData.active = catalogData.active;
    if (catalogData.status) updateData.status = catalogData.status;
    
    // Recalculate total sessions if duration or frequency changed
    if (catalogData.durationMonths || catalogData.frequency) {
      const current = await this.getCatalogById(id);
      if (current) {
        const duration = catalogData.durationMonths ?? current.durationMonths;
        const frequency = catalogData.frequency ?? current.frequency;
        const totalSessions = this.calculateTotalSessions(duration, frequency);
        updateData.number_of_sessions = totalSessions;
        updateData.total_sessions = totalSessions;
      }
    }

    const { error } = await supabase
      .from('mentoring_catalogs')
      .update(updateData)
      .eq('id', id);

    return !error;
  }

  async deleteCatalog(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_catalogs')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapCatalogFromDB(data);
  }

  private calculateTotalSessions(durationMonths: number, frequency: string): number {
    const sessionsPerMonth = {
      'Semanal': 4,
      'Quinzenal': 2,
      'Mensal': 1
    };
    return durationMonths * (sessionsPerMonth[frequency as keyof typeof sessionsPerMonth] || 1);
  }

  // Enrollment methods
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    const { data, error } = await supabase
      .from('mentoring_enrollments')
      .select(`
        *,
        mentoring:mentoring_catalogs(*),
        extensions:mentoring_enrollment_extensions(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(enrollment => ({
      ...this.mapEnrollmentFromDB(enrollment),
      extensions: enrollment.extensions || [],
      hasExtension: (enrollment.extensions?.length || 0) > 0
    }));
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    const { data, error } = await supabase
      .from('mentoring_enrollments')
      .select(`
        *,
        mentoring:mentoring_catalogs(*),
        extensions:mentoring_enrollment_extensions(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(enrollment => ({
      ...this.mapEnrollmentFromDB(enrollment),
      extensions: enrollment.extensions || [],
      hasExtension: (enrollment.extensions?.length || 0) > 0
    }));
  }

  async addExtension(extensionData: CreateExtensionData): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_enrollment_extensions')
      .insert({
        enrollment_id: extensionData.enrollmentId,
        extension_months: extensionData.extensionMonths,
        notes: extensionData.notes
      });

    if (!error) {
      // Update enrollment end date
      const { data: enrollment } = await supabase
        .from('mentoring_enrollments')
        .select('end_date')
        .eq('id', extensionData.enrollmentId)
        .single();

      if (enrollment) {
        const currentEndDate = new Date(enrollment.end_date);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setMonth(newEndDate.getMonth() + extensionData.extensionMonths);

        await supabase
          .from('mentoring_enrollments')
          .update({ 
            end_date: newEndDate.toISOString().split('T')[0],
            has_extension: true
          })
          .eq('id', extensionData.enrollmentId);
      }
    }

    return !error;
  }

  // Session methods
  async getSessions(): Promise<MentoringSession[]> {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .select(`
        *,
        enrollment:mentoring_enrollments(
          *,
          mentoring:mentoring_catalogs(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(session => this.mapSessionFromDB(session));
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('session_number', { ascending: true });

    if (error) throw error;
    return (data || []).map(session => this.mapSessionFromDB(session));
  }

  async createSession(sessionData: CreateSessionData): Promise<MentoringSession> {
    // Get current session count for this enrollment
    const { data: existingSessions } = await supabase
      .from('mentoring_sessions')
      .select('session_number')
      .eq('enrollment_id', sessionData.enrollmentId)
      .order('session_number', { ascending: false })
      .limit(1);

    const nextSessionNumber = existingSessions && existingSessions.length > 0 
      ? existingSessions[0].session_number + 1 
      : 1;

    const { data, error } = await supabase
      .from('mentoring_sessions')
      .insert({
        enrollment_id: sessionData.enrollmentId,
        session_number: nextSessionNumber,
        type: sessionData.type,
        title: sessionData.title,
        scheduled_date: sessionData.scheduledDate,
        duration_minutes: sessionData.durationMinutes,
        meeting_link: sessionData.meetingLink,
        group_id: sessionData.groupId,
        status: sessionData.status || 'aguardando_agendamento',
        observations: sessionData.observations
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapSessionFromDB(data);
  }

  async updateSession(sessionId: string, sessionData: UpdateSessionData): Promise<boolean> {
    const updateData: any = {};
    
    // Map camelCase to snake_case
    if (sessionData.title) updateData.title = sessionData.title;
    if (sessionData.scheduledDate) updateData.scheduled_date = sessionData.scheduledDate;
    if (sessionData.durationMinutes) updateData.duration_minutes = sessionData.durationMinutes;
    if (sessionData.status) updateData.status = sessionData.status;
    if (sessionData.meetingLink) updateData.meeting_link = sessionData.meetingLink;
    if (sessionData.calendlyLink) updateData.calendly_link = sessionData.calendlyLink;
    if (sessionData.recordingLink) updateData.recording_link = sessionData.recordingLink;
    if (sessionData.mentorNotes) updateData.mentor_notes = sessionData.mentorNotes;
    if (sessionData.studentNotes) updateData.student_notes = sessionData.studentNotes;
    if (sessionData.observations) updateData.observations = sessionData.observations;
    if (sessionData.transcription) updateData.transcription = sessionData.transcription;

    const { error } = await supabase
      .from('mentoring_sessions')
      .update(updateData)
      .eq('id', sessionId);

    return !error;
  }

  // Material methods
  async getMaterials(): Promise<MentoringMaterial[]> {
    const { data, error } = await supabase
      .from('mentoring_materials')
      .select(`
        *,
        session:mentoring_sessions(*),
        enrollment:mentoring_enrollments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(material => this.mapMaterialFromDB(material));
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await supabase
      .from('mentoring_materials')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(material => this.mapMaterialFromDB(material));
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await supabase
      .from('mentoring_materials')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(material => this.mapMaterialFromDB(material));
  }
}
