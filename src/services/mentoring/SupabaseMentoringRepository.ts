
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
  MentoringExtensionOption
} from '@/types/mentoring.types';
import { calculateSessionsFromFrequency } from '@/utils/mentoringCalculations';

export class SupabaseMentoringRepository implements IMentoringRepository {
  // Catalog operations
  async getCatalogs(): Promise<MentoringCatalog[]> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching catalogs:', error);
      throw new Error('Erro ao buscar catálogo de mentorias');
    }

    const catalogs = (data || []).map((item) => this.transformCatalogFromSupabase(item));
    
    // Buscar extensões para cada catálogo
    for (const catalog of catalogs) {
      const extensions = await this.getCatalogExtensions(catalog.id);
      catalog.extensions = extensions;
    }

    return catalogs;
  }

  async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching catalog:', error);
      throw new Error('Erro ao buscar mentoria');
    }

    const catalog = this.transformCatalogFromSupabase(data);
    catalog.extensions = await this.getCatalogExtensions(catalog.id);
    
    return catalog;
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    const supabaseData = this.transformCatalogToSupabase(data);
    
    const { data: result, error } = await supabase
      .from('mentoring_catalogs')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating catalog:', error);
      throw new Error('Erro ao criar mentoria');
    }

    const catalog = this.transformCatalogFromSupabase(result);
    
    // Criar extensões se fornecidas
    if (data.extensions && data.extensions.length > 0) {
      await this.createCatalogExtensions(catalog.id, data.extensions);
      catalog.extensions = await this.getCatalogExtensions(catalog.id);
    }

    return catalog;
  }

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.instructor !== undefined) updateData.instructor = data.instructor;
    if (data.durationMonths !== undefined) updateData.duration_months = data.durationMonths;
    if (data.numberOfSessions !== undefined) {
      updateData.number_of_sessions = data.numberOfSessions;
      updateData.total_sessions = data.numberOfSessions;
    }
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.status !== undefined) updateData.status = data.status;

    const { error } = await supabase
      .from('mentoring_catalogs')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating catalog:', error);
      throw new Error('Erro ao atualizar mentoria');
    }

    // Atualizar extensões se fornecidas
    if (data.extensions !== undefined) {
      await this.updateCatalogExtensions(id, data.extensions);
    }

    return true;
  }

  async deleteCatalog(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_catalogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting catalog:', error);
      throw new Error('Erro ao excluir mentoria');
    }

    return true;
  }

  // Enrollment operations
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    // Usando approach direto sem tipagem específica
    const { data, error } = await (supabase as any)
      .from('mentoring_enrollments')
      .select(`
        *,
        mentoring:mentoring_catalogs(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      throw new Error('Erro ao buscar inscrições');
    }

    return (data || []).map((item: any) => this.transformEnrollmentFromSupabase(item));
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_enrollments')
      .select(`
        *,
        mentoring:mentoring_catalogs(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student enrollments:', error);
      throw new Error('Erro ao buscar inscrições do aluno');
    }

    return (data || []).map((item: any) => this.transformEnrollmentFromSupabase(item));
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('mentoring_enrollment_extensions')
      .insert([{
        enrollment_id: data.enrollmentId,
        extension_months: data.extensionMonths,
        notes: data.notes,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) {
      console.error('Error adding extension:', error);
      throw new Error('Erro ao adicionar extensão');
    }

    return true;
  }

  // Session operations
  async getSessions(): Promise<MentoringSession[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_sessions')
      .select(`
        *,
        enrollment:mentoring_enrollments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Erro ao buscar sessões');
    }

    return (data || []).map((item: any) => this.transformSessionFromSupabase(item));
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_sessions')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('session_number', { ascending: true });

    if (error) {
      console.error('Error fetching enrollment sessions:', error);
      throw new Error('Erro ao buscar sessões da inscrição');
    }

    return (data || []).map((item: any) => this.transformSessionFromSupabase(item));
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    const { data: result, error } = await (supabase as any)
      .from('mentoring_sessions')
      .insert([this.transformSessionToSupabase(data)])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('Erro ao criar sessão');
    }

    return this.transformSessionFromSupabase(result);
  }

  // Material operations
  async getMaterials(): Promise<MentoringMaterial[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      throw new Error('Erro ao buscar materiais');
    }

    return (data || []).map((item: any) => this.transformMaterialFromSupabase(item));
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_materials')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollment materials:', error);
      throw new Error('Erro ao buscar materiais da inscrição');
    }

    return (data || []).map((item: any) => this.transformMaterialFromSupabase(item));
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await (supabase as any)
      .from('mentoring_materials')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching session materials:', error);
      throw new Error('Erro ao buscar materiais da sessão');
    }

    return (data || []).map((item: any) => this.transformMaterialFromSupabase(item));
  }

  // Extension operations
  async getCatalogExtensions(catalogId: string): Promise<MentoringExtensionOption[]> {
    const { data, error } = await supabase
      .from('mentoring_extensions')
      .select('*')
      .eq('catalog_id', catalogId)
      .order('months', { ascending: true });

    if (error) {
      console.error('Error fetching extensions:', error);
      return [];
    }

    return (data || []).map(ext => ({
      id: ext.id,
      months: ext.months,
      price: ext.price,
      totalSessions: calculateSessionsFromFrequency(ext.months, 'Semanal'),
      description: ext.description || ''
    }));
  }

  async createCatalogExtensions(catalogId: string, extensions: MentoringExtensionOption[]): Promise<void> {
    const extensionsData = extensions.map(ext => ({
      catalog_id: catalogId,
      months: ext.months,
      price: ext.price,
      description: ext.description || ''
    }));

    const { error } = await supabase
      .from('mentoring_extensions')
      .insert(extensionsData);

    if (error) {
      console.error('Error creating extensions:', error);
      throw new Error('Erro ao criar extensões');
    }
  }

  async updateCatalogExtensions(catalogId: string, extensions: MentoringExtensionOption[]): Promise<void> {
    // Primeiro, remove todas as extensões existentes
    const { error: deleteError } = await supabase
      .from('mentoring_extensions')
      .delete()
      .eq('catalog_id', catalogId);

    if (deleteError) {
      console.error('Error deleting existing extensions:', deleteError);
    }

    // Depois, cria as novas extensões
    if (extensions && extensions.length > 0) {
      await this.createCatalogExtensions(catalogId, extensions);
    }
  }

  // Transform methods
  private transformCatalogFromSupabase(data: any): MentoringCatalog {
    return {
      id: data.id,
      name: data.name,
      type: data.type as 'Individual' | 'Grupo',
      instructor: data.instructor,
      durationMonths: data.duration_months,
      frequency: 'Semanal',
      numberOfSessions: data.number_of_sessions,
      totalSessions: data.total_sessions,
      price: data.price,
      description: data.description,
      tags: data.tags || [],
      imageUrl: data.image_url,
      active: data.active,
      status: data.status as 'Ativa' | 'Inativa' | 'Cancelada',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      extensions: []
    };
  }

  private transformCatalogToSupabase(data: CreateMentoringCatalogData) {
    return {
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      duration_months: data.durationMonths,
      number_of_sessions: data.numberOfSessions,
      total_sessions: data.numberOfSessions,
      price: data.price,
      description: data.description,
      active: data.active ?? true,
      status: data.status ?? 'Ativa'
    };
  }

  private transformEnrollmentFromSupabase(data: any): StudentMentoringEnrollment {
    return {
      id: data.id,
      studentId: data.student_id,
      mentoringId: data.mentoring_id,
      mentoring: data.mentoring ? this.transformCatalogFromSupabase(data.mentoring) : {} as MentoringCatalog,
      status: data.status as 'ativa' | 'concluida' | 'cancelada' | 'pausada',
      enrollmentDate: data.enrollment_date,
      startDate: data.start_date,
      endDate: data.end_date,
      originalEndDate: data.original_end_date,
      sessionsUsed: data.sessions_used,
      totalSessions: data.total_sessions,
      responsibleMentor: data.responsible_mentor,
      paymentStatus: data.payment_status,
      observations: data.observations,
      hasExtension: data.has_extension,
      groupId: data.group_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformSessionFromSupabase(data: any): MentoringSession {
    return {
      id: data.id,
      enrollmentId: data.enrollment_id,
      enrollment: data.enrollment ? this.transformEnrollmentFromSupabase(data.enrollment) : undefined,
      sessionNumber: data.session_number,
      type: data.type as 'individual' | 'grupo',
      title: data.title,
      scheduledDate: data.scheduled_date,
      durationMinutes: data.duration_minutes,
      status: data.status as 'aguardando_agendamento' | 'agendada' | 'concluida' | 'cancelada' | 'reagendada' | 'no_show_aluno' | 'no_show_mentor',
      calendlyLink: data.calendly_link,
      meetingLink: data.meeting_link,
      recordingLink: data.recording_link,
      mentorNotes: data.mentor_notes,
      studentNotes: data.student_notes,
      observations: data.observations,
      transcription: data.transcription,
      groupId: data.group_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformSessionToSupabase(data: CreateSessionData) {
    return {
      enrollment_id: data.enrollmentId,
      session_number: 1, // Will be calculated properly
      type: data.type,
      title: data.title,
      scheduled_date: data.scheduledDate,
      duration_minutes: data.durationMinutes,
      meeting_link: data.meetingLink,
      group_id: data.groupId,
      status: data.status || 'aguardando_agendamento'
    };
  }

  private transformMaterialFromSupabase(data: any): MentoringMaterial {
    return {
      id: data.id,
      sessionId: data.session_id,
      enrollmentId: data.enrollment_id,
      fileName: data.file_name,
      fileUrl: data.file_url,
      type: data.file_type,
      description: data.description,
      storagePath: data.storage_path,
      fileType: data.file_type,
      sizeMB: data.size_mb,
      uploaderId: data.uploader_id,
      uploaderType: data.uploader_type as 'admin' | 'mentor' | 'aluno',
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
