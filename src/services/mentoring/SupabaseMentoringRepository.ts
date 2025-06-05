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
import { supabase } from '@/integrations/supabase/client';

export class SupabaseMentoringRepository implements IMentoringRepository {
  async getCatalogs(): Promise<MentoringCatalog[]> {
    try {
      console.log('🔍 SupabaseMentoringRepository.getCatalogs - Buscando catálogos...');
      
      const { data: catalogsData, error: catalogsError } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (catalogsError) {
        console.error('❌ Erro ao buscar catálogos:', catalogsError);
        throw catalogsError;
      }

      console.log('📋 Catálogos encontrados:', catalogsData?.length || 0);

      const catalogs: MentoringCatalog[] = [];

      for (const catalog of catalogsData || []) {
        // Buscar extensões para cada catálogo
        const { data: extensionsData, error: extensionsError } = await supabase
          .from('mentoring_extensions')
          .select('*')
          .eq('catalog_id', catalog.id)
          .order('months', { ascending: true });

        if (extensionsError) {
          console.error('❌ Erro ao buscar extensões:', extensionsError);
        }

        const extensions = (extensionsData || []).map(ext => ({
          id: ext.id,
          months: ext.months,
          price: ext.price,
          totalSessions: Math.ceil(ext.months * 4), // Aproximadamente 4 sessões por mês
          description: ext.description || ''
        }));

        const transformedCatalog: MentoringCatalog = {
          id: catalog.id,
          name: catalog.name,
          type: catalog.type as 'Individual' | 'Grupo',
          instructor: catalog.instructor,
          durationMonths: catalog.duration_months,
          frequency: 'Semanal',
          numberOfSessions: catalog.number_of_sessions,
          totalSessions: catalog.total_sessions,
          price: catalog.price,
          description: catalog.description,
          tags: catalog.tags || [],
          imageUrl: catalog.image_url,
          active: catalog.active,
          status: catalog.status as 'Ativa' | 'Inativa' | 'Cancelada',
          createdAt: catalog.created_at,
          updatedAt: catalog.updated_at,
          extensions
        };

        catalogs.push(transformedCatalog);
      }

      console.log('✅ Catálogos transformados:', catalogs.length);
      return catalogs;
    } catch (error) {
      console.error('❌ Erro geral ao buscar catálogos:', error);
      return [];
    }
  }

  async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    try {
      const { data: catalog, error } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching catalog by ID:', error);
        return null;
      }

      if (!catalog) return null;

      // Buscar extensões
      const { data: extensionsData } = await supabase
        .from('mentoring_extensions')
        .select('*')
        .eq('catalog_id', catalog.id);

      const extensions = (extensionsData || []).map(ext => ({
        id: ext.id,
        months: ext.months,
        price: ext.price,
        totalSessions: Math.ceil(ext.months * 4),
        description: ext.description || ''
      }));

      return {
        id: catalog.id,
        name: catalog.name,
        type: catalog.type as 'Individual' | 'Grupo',
        instructor: catalog.instructor,
        durationMonths: catalog.duration_months,
        frequency: 'Semanal',
        numberOfSessions: catalog.number_of_sessions,
        totalSessions: catalog.total_sessions,
        price: catalog.price,
        description: catalog.description,
        tags: catalog.tags || [],
        imageUrl: catalog.image_url,
        active: catalog.active,
        status: catalog.status as 'Ativa' | 'Inativa' | 'Cancelada',
        createdAt: catalog.created_at,
        updatedAt: catalog.updated_at,
        extensions
      };
    } catch (error) {
      console.error('Error fetching catalog by ID:', error);
      return null;
    }
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    try {
      const { data: newCatalog, error } = await supabase
        .from('mentoring_catalogs')
        .insert([{
          name: data.name,
          type: data.type,
          instructor: data.instructor,
          duration_months: data.durationMonths,
          number_of_sessions: data.numberOfSessions || 0,
          total_sessions: data.numberOfSessions || 0,
          price: data.price,
          description: data.description,
          active: data.active ?? true,
          status: data.status ?? 'Ativa',
          tags: []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating catalog:', error);
        throw error;
      }

      return {
        id: newCatalog.id,
        name: newCatalog.name,
        type: newCatalog.type as 'Individual' | 'Grupo',
        instructor: newCatalog.instructor,
        durationMonths: newCatalog.duration_months,
        frequency: 'Semanal',
        numberOfSessions: newCatalog.number_of_sessions,
        totalSessions: newCatalog.total_sessions,
        price: newCatalog.price,
        description: newCatalog.description,
        tags: newCatalog.tags || [],
        active: newCatalog.active,
        status: newCatalog.status as 'Ativa' | 'Inativa' | 'Cancelada',
        extensions: [],
        createdAt: newCatalog.created_at,
        updatedAt: newCatalog.updated_at
      };
    } catch (error) {
      console.error('Error creating catalog:', error);
      throw error;
    }
  }

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating catalog:', error);
      return false;
    }
  }

  async deleteCatalog(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mentoring_catalogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting catalog:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting catalog:', error);
      return false;
    }
  }

  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    try {
      console.log('🔍 SupabaseMentoringRepository.getEnrollments - Buscando inscrições...');
      
      const { data: enrollmentsData, error } = await supabase
        .from('mentoring_enrollments')
        .select(`
          *,
          mentoring_catalogs (
            id,
            name,
            type,
            duration_months,
            description
          ),
          profiles!mentoring_enrollments_student_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar inscrições:', error);
        return [];
      }

      console.log('📋 Inscrições encontradas:', enrollmentsData?.length || 0);

      const enrollments: StudentMentoringEnrollment[] = (enrollmentsData || []).map(enrollment => {
        // Buscar extensões para esta inscrição
        const extensions: MentoringExtension[] = [];

        return {
          id: enrollment.id,
          studentId: enrollment.student_id,
          mentoringId: enrollment.mentoring_id,
          mentoring: {
            id: enrollment.mentoring_catalogs.id,
            name: enrollment.mentoring_catalogs.name,
            type: enrollment.mentoring_catalogs.type as 'Individual' | 'Grupo',
            frequency: 'Semanal',
            durationMonths: enrollment.mentoring_catalogs.duration_months,
            extensions: [],
            description: enrollment.mentoring_catalogs.description
          },
          status: enrollment.status as 'ativa' | 'pausada' | 'cancelada' | 'concluida',
          enrollmentDate: enrollment.enrollment_date,
          startDate: enrollment.start_date,
          endDate: enrollment.end_date,
          sessionsUsed: enrollment.sessions_used,
          totalSessions: enrollment.total_sessions,
          responsibleMentor: enrollment.responsible_mentor,
          paymentStatus: enrollment.payment_status as 'pendente' | 'pago' | 'cancelado',
          observations: enrollment.observations,
          hasExtension: enrollment.has_extension || false,
          extensions: extensions,
          originalEndDate: enrollment.original_end_date,
          createdAt: enrollment.created_at,
          updatedAt: enrollment.updated_at
        };
      });

      return enrollments;
    } catch (error) {
      console.error('❌ Erro geral ao buscar inscrições:', error);
      return [];
    }
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    try {
      const enrollments = await this.getEnrollments();
      return enrollments.filter(e => e.studentId === studentId);
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return [];
    }
  }

  async createEnrollment(data: any): Promise<StudentMentoringEnrollment> {
    try {
      const { data: newEnrollment, error } = await supabase
        .from('mentoring_enrollments')
        .insert([{
          student_id: data.studentId,
          mentoring_id: data.mentoringId,
          start_date: data.startDate,
          end_date: data.endDate,
          total_sessions: data.totalSessions || 12,
          responsible_mentor: data.responsibleMentor,
          observations: data.observations,
          status: 'ativa',
          payment_status: 'pendente',
          sessions_used: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating enrollment:', error);
        throw error;
      }

      // Buscar dados do catálogo
      const catalog = await this.getCatalogById(data.mentoringId);

      return {
        id: newEnrollment.id,
        studentId: newEnrollment.student_id,
        mentoringId: newEnrollment.mentoring_id,
        mentoring: {
          id: catalog?.id || data.mentoringId,
          name: catalog?.name || 'Mentoria',
          type: catalog?.type || 'Individual',
          frequency: 'Semanal',
          durationMonths: catalog?.durationMonths || 6,
          extensions: [],
          description: catalog?.description || ''
        },
        status: 'ativa',
        enrollmentDate: newEnrollment.enrollment_date,
        startDate: newEnrollment.start_date,
        endDate: newEnrollment.end_date,
        sessionsUsed: 0,
        totalSessions: newEnrollment.total_sessions,
        responsibleMentor: newEnrollment.responsible_mentor,
        paymentStatus: 'pendente',
        observations: newEnrollment.observations,
        hasExtension: false,
        createdAt: newEnrollment.created_at,
        updatedAt: newEnrollment.updated_at
      };
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    try {
      console.log('🗑️ SupabaseMentoringRepository.deleteEnrollment - ID:', id);
      // Delete enrollment from Supabase
      return true;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      return false;
    }
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    try {
      const extension = {
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

      // Logic to update enrollment and add extension
      return true;
    } catch (error) {
      console.error('Error adding extension:', error);
      return false;
    }
  }

  async removeExtension(extensionId: string): Promise<boolean> {
    try {
      console.log('🗑️ SupabaseMentoringRepository.removeExtension - ID:', extensionId);
      // Remove extension from Supabase
      return true;
    } catch (error) {
      console.error('Error removing extension:', error);
      return false;
    }
  }

  async getSessions(): Promise<MentoringSession[]> {
    try {
      console.log('🔍 SupabaseMentoringRepository.getSessions - Buscando sessões...');
      
      const { data: sessionsData, error } = await supabase
        .from('mentoring_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar sessões:', error);
        return [];
      }

      console.log('📋 Sessões encontradas:', sessionsData?.length || 0);

      const sessions: MentoringSession[] = (sessionsData || []).map(session => ({
        id: session.id,
        enrollment_id: session.enrollment_id,
        enrollmentId: session.enrollment_id,
        type: session.type,
        title: session.title,
        scheduled_date: session.scheduled_date,
        scheduledDate: session.scheduled_date,
        scheduled_time: session.scheduled_date ? new Date(session.scheduled_date).toTimeString().slice(0, 5) : undefined,
        duration_minutes: session.duration_minutes,
        durationMinutes: session.duration_minutes,
        meeting_link: session.meeting_link,
        meetingLink: session.meeting_link,
        observations: session.observations,
        session_number: session.session_number,
        sessionNumber: session.session_number,
        status: session.status,
        group_id: session.group_id,
        groupId: session.group_id,
        created_at: session.created_at,
        createdAt: session.created_at,
        updated_at: session.updated_at,
        updatedAt: session.updated_at
      }));

      return sessions;
    } catch (error) {
      console.error('❌ Erro geral ao buscar sessões:', error);
      return [];
    }
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    try {
      const sessions = await this.getSessions();
      return sessions.filter(s => s.enrollmentId === enrollmentId);
    } catch (error) {
      console.error('Error fetching enrollment sessions:', error);
      return [];
    }
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    try {
      const sessionNumber = data.sessionNumber || 1; // Auto-generate if not provided
      
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

      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean> {
    try {
      console.log('📝 SupabaseMentoringRepository.updateSession - ID:', sessionId, 'Data:', data);
      // Update session in Supabase
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      console.log('🗑️ SupabaseMentoringRepository.deleteSession - ID:', sessionId);
      // Delete session from Supabase
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  async getMaterials(): Promise<MentoringMaterial[]> {
    try {
      // Fetch materials from Supabase
      return []; // Replace with actual data
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
    }
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    try {
      // Fetch enrollment materials from Supabase
      return []; // Replace with actual data
    } catch (error) {
      console.error('Error fetching enrollment materials:', error);
      return [];
    }
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    try {
      // Fetch session materials from Supabase
      return []; // Replace with actual data
    } catch (error) {
      console.error('Error fetching session materials:', error);
      return [];
    }
  }

  async uploadMaterial(file: File, enrollmentId?: string, sessionId?: string): Promise<MentoringMaterial> {
    try {
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

      return material;
    } catch (error) {
      console.error('Error uploading material:', error);
      throw error;
    }
  }
}
