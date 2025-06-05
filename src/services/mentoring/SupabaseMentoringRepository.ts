
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

      // Map database fields to interface
      return (data || []).map(catalog => ({
        id: catalog.id,
        name: catalog.name,
        description: catalog.description,
        instructor: catalog.instructor,
        type: catalog.type as 'Individual' | 'Grupo',
        durationMonths: catalog.duration_months,
        numberOfSessions: catalog.number_of_sessions,
        totalSessions: catalog.total_sessions,
        price: catalog.price,
        active: catalog.active,
        status: catalog.status as 'Ativa' | 'Inativa' | 'Cancelada',
        createdAt: catalog.created_at,
        updatedAt: catalog.updated_at,
        tags: catalog.tags || [],
        imageUrl: catalog.image_url
      }));
    } catch (error) {
      console.error('Erro na consulta de catálogos:', error);
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

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        instructor: data.instructor,
        type: data.type as 'Individual' | 'Grupo',
        durationMonths: data.duration_months,
        numberOfSessions: data.number_of_sessions,
        totalSessions: data.total_sessions,
        price: data.price,
        active: data.active,
        status: data.status as 'Ativa' | 'Inativa' | 'Cancelada',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        tags: data.tags || [],
        imageUrl: data.image_url
      };
    } catch (error) {
      console.error('Erro ao buscar catálogo:', error);
      return null;
    }
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    try {
      const { data: result, error } = await supabase
        .from('mentoring_catalogs')
        .insert({
          name: data.name,
          description: data.description,
          instructor: data.instructor,
          type: data.type,
          duration_months: data.durationMonths,
          number_of_sessions: data.numberOfSessions,
          total_sessions: data.numberOfSessions,
          price: data.price,
          active: data.active,
          status: data.status || 'Ativa',
          tags: data.tags || []
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar catálogo:', error);
        throw error;
      }

      return {
        id: result.id,
        name: result.name,
        description: result.description,
        instructor: result.instructor,
        type: result.type as 'Individual' | 'Grupo',
        durationMonths: result.duration_months,
        numberOfSessions: result.number_of_sessions,
        totalSessions: result.total_sessions,
        price: result.price,
        active: result.active,
        status: result.status as 'Ativa' | 'Inativa' | 'Cancelada',
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        tags: result.tags || []
      };
    } catch (error) {
      console.error('Erro ao criar catálogo:', error);
      throw error;
    }
  }

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.instructor !== undefined) updateData.instructor = data.instructor;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.durationMonths !== undefined) updateData.duration_months = data.durationMonths;
      if (data.numberOfSessions !== undefined) {
        updateData.number_of_sessions = data.numberOfSessions;
        updateData.total_sessions = data.numberOfSessions;
      }
      if (data.price !== undefined) updateData.price = data.price;
      if (data.active !== undefined) updateData.active = data.active;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tags !== undefined) updateData.tags = data.tags;

      const { error } = await supabase
        .from('mentoring_catalogs')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar catálogo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar catálogo:', error);
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
        console.error('Erro ao deletar catálogo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar catálogo:', error);
      return false;
    }
  }

  // Enrollment operations
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_enrollments')
        .select(`
          *,
          mentoring_catalogs (
            id,
            name,
            type,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar inscrições:', error);
        throw error;
      }

      return (data || []).map(enrollment => ({
        id: enrollment.id,
        studentId: enrollment.student_id,
        mentoringId: enrollment.mentoring_id,
        mentoring: {
          id: enrollment.mentoring_catalogs?.id || enrollment.mentoring_id,
          name: enrollment.mentoring_catalogs?.name || 'Mentoria não encontrada',
          type: (enrollment.mentoring_catalogs?.type as 'Individual' | 'Grupo') || 'Individual',
          description: enrollment.mentoring_catalogs?.description
        },
        status: enrollment.status as 'ativa' | 'concluida' | 'pausada' | 'cancelada',
        enrollmentDate: enrollment.enrollment_date,
        startDate: enrollment.start_date,
        endDate: enrollment.end_date,
        totalSessions: enrollment.total_sessions,
        sessionsUsed: enrollment.sessions_used,
        responsibleMentor: enrollment.responsible_mentor,
        paymentStatus: enrollment.payment_status,
        observations: enrollment.observations,
        hasExtension: enrollment.has_extension || false,
        originalEndDate: enrollment.original_end_date,
        createdAt: enrollment.created_at,
        updatedAt: enrollment.updated_at,
        groupId: enrollment.group_id
      }));
    } catch (error) {
      console.error('Erro na consulta de inscrições:', error);
      return [];
    }
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    try {
      const { data, error } = await supabase
        .from('mentoring_enrollments')
        .select(`
          *,
          mentoring_catalogs (
            id,
            name,
            type,
            description
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar inscrições do estudante:', error);
        throw error;
      }

      return (data || []).map(enrollment => ({
        id: enrollment.id,
        studentId: enrollment.student_id,
        mentoringId: enrollment.mentoring_id,
        mentoring: {
          id: enrollment.mentoring_catalogs?.id || enrollment.mentoring_id,
          name: enrollment.mentoring_catalogs?.name || 'Mentoria não encontrada',
          type: (enrollment.mentoring_catalogs?.type as 'Individual' | 'Grupo') || 'Individual',
          description: enrollment.mentoring_catalogs?.description
        },
        status: enrollment.status as 'ativa' | 'concluida' | 'pausada' | 'cancelada',
        enrollmentDate: enrollment.enrollment_date,
        startDate: enrollment.start_date,
        endDate: enrollment.end_date,
        totalSessions: enrollment.total_sessions,
        sessionsUsed: enrollment.sessions_used,
        responsibleMentor: enrollment.responsible_mentor,
        paymentStatus: enrollment.payment_status,
        observations: enrollment.observations,
        hasExtension: enrollment.has_extension || false,
        originalEndDate: enrollment.original_end_date,
        createdAt: enrollment.created_at,
        updatedAt: enrollment.updated_at,
        groupId: enrollment.group_id
      }));
    } catch (error) {
      console.error('Erro ao buscar inscrições do estudante:', error);
      return [];
    }
  }

  async createEnrollment(data: any): Promise<StudentMentoringEnrollment> {
    try {
      const { data: result, error } = await supabase
        .from('mentoring_enrollments')
        .insert({
          student_id: data.studentId,
          mentoring_id: data.mentoringId,
          enrollment_date: data.enrollmentDate || new Date().toISOString().split('T')[0],
          start_date: data.startDate,
          end_date: data.endDate,
          total_sessions: data.totalSessions || 12,
          sessions_used: 0,
          responsible_mentor: data.responsibleMentor,
          payment_status: data.paymentStatus || 'pendente',
          observations: data.observations,
          status: 'ativa'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar inscrição:', error);
        throw error;
      }

      // Buscar dados da mentoria para retorno completo
      const { data: catalogData } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .eq('id', result.mentoring_id)
        .single();

      return {
        id: result.id,
        studentId: result.student_id,
        mentoringId: result.mentoring_id,
        mentoring: {
          id: catalogData?.id || result.mentoring_id,
          name: catalogData?.name || 'Mentoria não encontrada',
          type: (catalogData?.type as 'Individual' | 'Grupo') || 'Individual',
          description: catalogData?.description
        },
        status: result.status as 'ativa' | 'concluida' | 'pausada' | 'cancelada',
        enrollmentDate: result.enrollment_date,
        startDate: result.start_date,
        endDate: result.end_date,
        totalSessions: result.total_sessions,
        sessionsUsed: result.sessions_used,
        responsibleMentor: result.responsible_mentor,
        paymentStatus: result.payment_status,
        observations: result.observations,
        hasExtension: result.has_extension || false,
        originalEndDate: result.original_end_date,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        groupId: result.group_id
      };
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mentoring_enrollments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar inscrição:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      return false;
    }
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mentoring_enrollment_extensions')
        .insert({
          enrollment_id: data.enrollmentId,
          extension_months: data.extensionMonths,
          notes: data.notes,
          applied_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Erro ao adicionar extensão:', error);
        return false;
      }

      // Atualizar a data de fim da inscrição
      const { error: updateError } = await supabase
        .from('mentoring_enrollments')
        .update({
          has_extension: true,
          end_date: supabase.rpc('extend_enrollment_date', {
            enrollment_id: data.enrollmentId,
            months_to_add: data.extensionMonths
          })
        })
        .eq('id', data.enrollmentId);

      if (updateError) {
        console.error('Erro ao atualizar inscrição com extensão:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao adicionar extensão:', error);
      return false;
    }
  }

  async removeExtension(extensionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mentoring_enrollment_extensions')
        .delete()
        .eq('id', extensionId);

      if (error) {
        console.error('Erro ao remover extensão:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao remover extensão:', error);
      return false;
    }
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

      return (data || []).map(session => ({
        id: session.id,
        enrollment_id: session.enrollment_id,
        enrollmentId: session.enrollment_id,
        type: (session.type === 'individual' || session.type === 'group') ? session.type : 'individual',
        title: session.title,
        scheduled_date: session.scheduled_date,
        scheduledDate: session.scheduled_date,
        scheduled_time: session.scheduled_date ? new Date(session.scheduled_date).toTimeString().substring(0, 5) : undefined,
        duration_minutes: session.duration_minutes,
        durationMinutes: session.duration_minutes,
        meeting_link: session.meeting_link,
        meetingLink: session.meeting_link,
        observations: session.observations,
        session_number: session.session_number,
        sessionNumber: session.session_number,
        status: session.status as 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada',
        group_id: session.group_id,
        groupId: session.group_id,
        mentor_notes: session.mentor_notes,
        mentorNotes: session.mentor_notes,
        transcription: session.transcription,
        recording_link: session.recording_link,
        recordingLink: session.recording_link,
        calendly_link: session.calendly_link,
        calendlyLink: session.calendly_link,
        student_notes: session.student_notes,
        studentNotes: session.student_notes,
        created_at: session.created_at,
        createdAt: session.created_at,
        updated_at: session.updated_at,
        updatedAt: session.updated_at
      }));
    } catch (error) {
      console.error('Erro na consulta de sessões:', error);
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

      return (data || []).map(session => ({
        id: session.id,
        enrollment_id: session.enrollment_id,
        enrollmentId: session.enrollment_id,
        type: (session.type === 'individual' || session.type === 'group') ? session.type : 'individual',
        title: session.title,
        scheduled_date: session.scheduled_date,
        scheduledDate: session.scheduled_date,
        scheduled_time: session.scheduled_date ? new Date(session.scheduled_date).toTimeString().substring(0, 5) : undefined,
        duration_minutes: session.duration_minutes,
        durationMinutes: session.duration_minutes,
        meeting_link: session.meeting_link,
        meetingLink: session.meeting_link,
        observations: session.observations,
        session_number: session.session_number,
        sessionNumber: session.session_number,
        status: session.status as 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada',
        group_id: session.group_id,
        groupId: session.group_id,
        mentor_notes: session.mentor_notes,
        mentorNotes: session.mentor_notes,
        transcription: session.transcription,
        recording_link: session.recording_link,
        recordingLink: session.recording_link,
        calendly_link: session.calendly_link,
        calendlyLink: session.calendly_link,
        student_notes: session.student_notes,
        studentNotes: session.student_notes,
        created_at: session.created_at,
        createdAt: session.created_at,
        updated_at: session.updated_at,
        updatedAt: session.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar sessões da inscrição:', error);
      return [];
    }
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    try {
      const { data: result, error } = await supabase
        .from('mentoring_sessions')
        .insert({
          enrollment_id: data.enrollmentId,
          type: data.type,
          title: data.title,
          scheduled_date: data.scheduledDate,
          duration_minutes: data.durationMinutes,
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

      return {
        id: result.id,
        enrollment_id: result.enrollment_id,
        enrollmentId: result.enrollment_id,
        type: result.type as 'individual' | 'group',
        title: result.title,
        scheduled_date: result.scheduled_date,
        scheduledDate: result.scheduled_date,
        scheduled_time: result.scheduled_date ? new Date(result.scheduled_date).toTimeString().substring(0, 5) : undefined,
        duration_minutes: result.duration_minutes,
        durationMinutes: result.duration_minutes,
        meeting_link: result.meeting_link,
        meetingLink: result.meeting_link,
        observations: result.observations,
        session_number: result.session_number,
        sessionNumber: result.session_number,
        status: result.status as 'agendada' | 'concluida' | 'cancelada' | 'aguardando_agendamento' | 'no_show_aluno' | 'no_show_mentor' | 'reagendada',
        group_id: result.group_id,
        groupId: result.group_id,
        created_at: result.created_at,
        createdAt: result.created_at,
        updated_at: result.updated_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.scheduledDate !== undefined) updateData.scheduled_date = data.scheduledDate;
      if (data.durationMinutes !== undefined) updateData.duration_minutes = data.durationMinutes;
      if (data.meetingLink !== undefined) updateData.meeting_link = data.meetingLink;
      if (data.observations !== undefined) updateData.observations = data.observations;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.mentorNotes !== undefined) updateData.mentor_notes = data.mentorNotes;
      if (data.transcription !== undefined) updateData.transcription = data.transcription;
      if (data.recordingLink !== undefined) updateData.recording_link = data.recordingLink;
      if (data.calendlyLink !== undefined) updateData.calendly_link = data.calendlyLink;
      if (data.studentNotes !== undefined) updateData.student_notes = data.studentNotes;

      const { error } = await supabase
        .from('mentoring_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        console.error('Erro ao atualizar sessão:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      return false;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mentoring_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Erro ao deletar sessão:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      return false;
    }
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

      return (data || []).map(material => ({
        id: material.id,
        enrollment_id: material.enrollment_id,
        enrollmentId: material.enrollment_id,
        session_id: material.session_id,
        sessionId: material.session_id,
        file_name: material.file_name,
        fileName: material.file_name,
        file_url: material.file_url,
        fileUrl: material.file_url,
        file_type: material.file_type,
        fileType: material.file_type,
        description: material.description,
        uploader_id: material.uploader_id,
        uploaderId: material.uploader_id,
        uploader_type: material.uploader_type,
        uploaderType: material.uploader_type,
        size_mb: material.size_mb,
        sizeMb: material.size_mb,
        sizeMB: material.size_mb,
        tags: material.tags || [],
        created_at: material.created_at,
        createdAt: material.created_at,
        updated_at: material.updated_at,
        updatedAt: material.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
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

      return (data || []).map(material => ({
        id: material.id,
        enrollment_id: material.enrollment_id,
        enrollmentId: material.enrollment_id,
        session_id: material.session_id,
        sessionId: material.session_id,
        file_name: material.file_name,
        fileName: material.file_name,
        file_url: material.file_url,
        fileUrl: material.file_url,
        file_type: material.file_type,
        fileType: material.file_type,
        description: material.description,
        uploader_id: material.uploader_id,
        uploaderId: material.uploader_id,
        uploader_type: material.uploader_type,
        uploaderType: material.uploader_type,
        size_mb: material.size_mb,
        sizeMb: material.size_mb,
        sizeMB: material.size_mb,
        tags: material.tags || [],
        created_at: material.created_at,
        createdAt: material.created_at,
        updated_at: material.updated_at,
        updatedAt: material.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar materiais da inscrição:', error);
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

      return (data || []).map(material => ({
        id: material.id,
        enrollment_id: material.enrollment_id,
        enrollmentId: material.enrollment_id,
        session_id: material.session_id,
        sessionId: material.session_id,
        file_name: material.file_name,
        fileName: material.file_name,
        file_url: material.file_url,
        fileUrl: material.file_url,
        file_type: material.file_type,
        fileType: material.file_type,
        description: material.description,
        uploader_id: material.uploader_id,
        uploaderId: material.uploader_id,
        uploader_type: material.uploader_type,
        uploaderType: material.uploader_type,
        size_mb: material.size_mb,
        sizeMb: material.size_mb,
        sizeMB: material.size_mb,
        tags: material.tags || [],
        created_at: material.created_at,
        createdAt: material.created_at,
        updated_at: material.updated_at,
        updatedAt: material.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar materiais da sessão:', error);
      return [];
    }
  }

  async uploadMaterial(file: File, enrollmentId?: string, sessionId?: string): Promise<MentoringMaterial> {
    try {
      // Upload do arquivo para o storage (implementar conforme necessário)
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = `fake-url/${fileName}`; // Substituir por upload real

      const { data: result, error } = await supabase
        .from('mentoring_materials')
        .insert({
          enrollment_id: enrollmentId,
          session_id: sessionId,
          file_name: file.name,
          file_url: fileUrl,
          file_type: file.type,
          size_mb: file.size / (1024 * 1024)
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao fazer upload do material:', error);
        throw error;
      }

      return {
        id: result.id,
        enrollment_id: result.enrollment_id,
        enrollmentId: result.enrollment_id,
        session_id: result.session_id,
        sessionId: result.session_id,
        file_name: result.file_name,
        fileName: result.file_name,
        file_url: result.file_url,
        fileUrl: result.file_url,
        file_type: result.file_type,
        fileType: result.file_type,
        description: result.description,
        uploader_id: result.uploader_id,
        uploaderId: result.uploader_id,
        uploader_type: result.uploader_type,
        uploaderType: result.uploader_type,
        size_mb: result.size_mb,
        sizeMb: result.size_mb,
        sizeMB: result.size_mb,
        tags: result.tags || [],
        created_at: result.created_at,
        createdAt: result.created_at,
        updated_at: result.updated_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      console.error('Erro ao fazer upload do material:', error);
      throw error;
    }
  }
}
