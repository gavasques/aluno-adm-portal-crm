
import { supabase } from '@/integrations/supabase/client';
import { IMentoringRepository } from '@/features/mentoring/types/contracts.types';
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

export class SupabaseMentoringRepository implements IMentoringRepository {
  // Catalog operations
  async getCatalogs(): Promise<MentoringCatalog[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar catálogos:', error);
        throw error;
      }

      return (data || []).map(this.mapDatabaseToCatalog);
    } catch (error) {
      console.error('Erro na query de catálogos:', error);
      return [];
    }
  }

  async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    try {
      const { data, error } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar catálogo por ID:', error);
        return null;
      }

      return data ? this.mapDatabaseToCatalog(data) : null;
    } catch (error) {
      console.error('Erro na query de catálogo por ID:', error);
      return null;
    }
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    const { data: newCatalog, error } = await supabase
      .from('mentoring_catalogs')
      .insert({
        name: data.name,
        type: data.type,
        instructor: data.instructor,
        duration_months: data.durationMonths,
        number_of_sessions: data.numberOfSessions || 0,
        total_sessions: data.numberOfSessions || 0,
        price: data.price,
        description: data.description,
        active: data.active ?? true,
        status: data.status ?? 'Ativa'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar catálogo:', error);
      throw error;
    }

    return this.mapDatabaseToCatalog(newCatalog);
  }

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.type) updateData.type = data.type;
    if (data.instructor) updateData.instructor = data.instructor;
    if (data.durationMonths) updateData.duration_months = data.durationMonths;
    if (data.numberOfSessions) updateData.number_of_sessions = data.numberOfSessions;
    if (data.price) updateData.price = data.price;
    if (data.description) updateData.description = data.description;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.status) updateData.status = data.status;

    const { error } = await supabase
      .from('mentoring_catalogs')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar catálogo:', error);
      return false;
    }

    return true;
  }

  async deleteCatalog(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_catalogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar catálogo:', error);
      return false;
    }

    return true;
  }

  // Enrollment operations
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_enrollments')
        .select(`
          *,
          mentoring_catalogs:mentoring_id (
            id,
            name,
            type,
            duration_months,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar inscrições:', error);
        throw error;
      }

      return (data || []).map(this.mapDatabaseToEnrollment);
    } catch (error) {
      console.error('Erro na query de inscrições:', error);
      return [];
    }
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_enrollments')
        .select(`
          *,
          mentoring_catalogs:mentoring_id (
            id,
            name,
            type,
            duration_months,
            description
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar inscrições do estudante:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseToEnrollment);
    } catch (error) {
      console.error('Erro na query de inscrições do estudante:', error);
      return [];
    }
  }

  async createEnrollment(data: any): Promise<StudentMentoringEnrollment> {
    const { data: newEnrollment, error } = await supabase
      .from('mentoring_enrollments')
      .insert({
        student_id: data.studentId,
        mentoring_id: data.mentoringId,
        status: data.status || 'ativa',
        start_date: data.startDate,
        end_date: data.endDate,
        total_sessions: data.totalSessions || 12,
        sessions_used: 0,
        responsible_mentor: data.responsibleMentor,
        payment_status: data.paymentStatus || 'pendente',
        observations: data.observations
      })
      .select(`
        *,
        mentoring_catalogs:mentoring_id (
          id,
          name,
          type,
          duration_months,
          description
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }

    return this.mapDatabaseToEnrollment(newEnrollment);
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar inscrição:', error);
      return false;
    }

    return true;
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    try {
      // First, get the current enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('mentoring_enrollments')
        .select('end_date, original_end_date')
        .eq('id', data.enrollmentId)
        .single();

      if (enrollmentError) {
        console.error('Erro ao buscar inscrição:', enrollmentError);
        return false;
      }

      // Calculate new end date
      const currentEndDate = new Date(enrollment.end_date);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + data.extensionMonths);

      // Create extension record
      const { error: extensionError } = await supabase
        .from('mentoring_enrollment_extensions')
        .insert({
          enrollment_id: data.enrollmentId,
          extension_months: data.extensionMonths,
          applied_date: new Date().toISOString().split('T')[0],
          notes: data.notes,
          admin_id: 'current-admin-id' // You might want to get this from auth context
        });

      if (extensionError) {
        console.error('Erro ao criar extensão:', extensionError);
        return false;
      }

      // Update enrollment
      const { error: updateError } = await supabase
        .from('mentoring_enrollments')
        .update({
          end_date: newEndDate.toISOString().split('T')[0],
          original_end_date: enrollment.original_end_date || enrollment.end_date,
          has_extension: true
        })
        .eq('id', data.enrollmentId);

      if (updateError) {
        console.error('Erro ao atualizar inscrição:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro geral ao adicionar extensão:', error);
      return false;
    }
  }

  async removeExtension(extensionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_enrollment_extensions')
      .delete()
      .eq('id', extensionId);

    if (error) {
      console.error('Erro ao remover extensão:', error);
      return false;
    }

    return true;
  }

  // Session operations
  async getSessions(): Promise<MentoringSession[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sessões:', error);
        throw error;
      }

      return (data || []).map(this.mapDatabaseToSession);
    } catch (error) {
      console.error('Erro na query de sessões:', error);
      return [];
    }
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_sessions')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .order('session_number', { ascending: true });

      if (error) {
        console.error('Erro ao buscar sessões da inscrição:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseToSession);
    } catch (error) {
      console.error('Erro na query de sessões da inscrição:', error);
      return [];
    }
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    const { data: newSession, error } = await supabase
      .from('mentoring_sessions')
      .insert({
        enrollment_id: data.enrollmentId,
        type: data.type,
        title: data.title,
        scheduled_date: data.scheduledDate,
        duration_minutes: data.durationMinutes || 60,
        meeting_link: data.meetingLink,
        observations: data.observations,
        session_number: data.sessionNumber || 1,
        status: data.status || 'aguardando_agendamento',
        group_id: data.groupId
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }

    return this.mapDatabaseToSession(newSession);
  }

  async updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean> {
    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.scheduledDate) updateData.scheduled_date = data.scheduledDate;
    if (data.durationMinutes) updateData.duration_minutes = data.durationMinutes;
    if (data.meetingLink) updateData.meeting_link = data.meetingLink;
    if (data.observations) updateData.observations = data.observations;
    if (data.status) updateData.status = data.status;

    const { error } = await supabase
      .from('mentoring_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) {
      console.error('Erro ao atualizar sessão:', error);
      return false;
    }

    return true;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Erro ao deletar sessão:', error);
      return false;
    }

    return true;
  }

  // Material operations
  async getMaterials(): Promise<MentoringMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseToMaterial);
    } catch (error) {
      console.error('Erro na query de materiais:', error);
      return [];
    }
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_materials')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar materiais da inscrição:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseToMaterial);
    } catch (error) {
      console.error('Erro na query de materiais da inscrição:', error);
      return [];
    }
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_materials')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar materiais da sessão:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseToMaterial);
    } catch (error) {
      console.error('Erro na query de materiais da sessão:', error);
      return [];
    }
  }

  async uploadMaterial(file: File, enrollmentId?: string, sessionId?: string): Promise<MentoringMaterial> {
    // For now, we'll simulate the upload and create a record
    const { data: newMaterial, error } = await supabase
      .from('mentoring_materials')
      .insert({
        enrollment_id: enrollmentId,
        session_id: sessionId,
        file_name: file.name,
        file_url: `fake-url/${file.name}`, // In real implementation, upload to storage first
        file_type: file.type,
        size_mb: file.size / (1024 * 1024),
        uploader_type: 'admin'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao fazer upload do material:', error);
      throw error;
    }

    return this.mapDatabaseToMaterial(newMaterial);
  }

  // Helper methods to map database records to domain objects
  private mapDatabaseToCatalog(data: any): MentoringCatalog {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      durationMonths: data.duration_months,
      frequency: 'Semanal', // Default value as it's not in DB
      numberOfSessions: data.number_of_sessions,
      totalSessions: data.total_sessions,
      price: data.price,
      description: data.description,
      tags: data.tags || [],
      active: data.active,
      status: data.status,
      extensions: [], // Extensions would need to be loaded separately
      checkoutLinks: {}, // Default empty object
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapDatabaseToEnrollment(data: any): StudentMentoringEnrollment {
    return {
      id: data.id,
      studentId: data.student_id,
      mentoringId: data.mentoring_id,
      mentoring: data.mentoring_catalogs ? {
        id: data.mentoring_catalogs.id,
        name: data.mentoring_catalogs.name,
        type: data.mentoring_catalogs.type,
        frequency: 'Semanal',
        durationMonths: data.mentoring_catalogs.duration_months,
        extensions: [],
        description: data.mentoring_catalogs.description
      } : {
        id: data.mentoring_id,
        name: 'Unknown Mentoring',
        type: 'Individual' as const,
        frequency: 'Semanal',
        durationMonths: 6,
        extensions: [],
        description: ''
      },
      status: data.status as any,
      enrollmentDate: data.enrollment_date,
      startDate: data.start_date,
      endDate: data.end_date,
      sessionsUsed: data.sessions_used,
      totalSessions: data.total_sessions,
      responsibleMentor: data.responsible_mentor,
      paymentStatus: data.payment_status as any,
      observations: data.observations,
      hasExtension: data.has_extension || false,
      originalEndDate: data.original_end_date,
      extensions: [], // Extensions would need to be loaded separately
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapDatabaseToSession(data: any): MentoringSession {
    return {
      id: data.id,
      enrollment_id: data.enrollment_id,
      enrollmentId: data.enrollment_id,
      type: (data.type === 'individual' || data.type === 'group') ? data.type : 'individual',
      title: data.title,
      scheduled_date: data.scheduled_date,
      scheduledDate: data.scheduled_date,
      scheduled_time: data.scheduled_time || '',
      duration_minutes: data.duration_minutes,
      durationMinutes: data.duration_minutes,
      meeting_link: data.meeting_link,
      meetingLink: data.meeting_link,
      observations: data.observations,
      session_number: data.session_number,
      sessionNumber: data.session_number,
      status: data.status,
      group_id: data.group_id,
      groupId: data.group_id,
      created_at: data.created_at,
      createdAt: data.created_at,
      updated_at: data.updated_at,
      updatedAt: data.updated_at
    };
  }

  private mapDatabaseToMaterial(data: any): MentoringMaterial {
    return {
      id: data.id,
      enrollment_id: data.enrollment_id,
      enrollmentId: data.enrollment_id,
      session_id: data.session_id,
      sessionId: data.session_id,
      file_name: data.file_name,
      fileName: data.file_name,
      file_url: data.file_url,
      fileUrl: data.file_url,
      file_type: data.file_type,
      fileType: data.file_type,
      size_mb: data.size_mb,
      sizeMb: data.size_mb,
      created_at: data.created_at,
      createdAt: data.created_at,
      updated_at: data.updated_at,
      updatedAt: data.updated_at
    };
  }
}
