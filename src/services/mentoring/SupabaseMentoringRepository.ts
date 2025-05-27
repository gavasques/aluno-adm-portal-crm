
import { supabase } from '@/lib/supabase';
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
  // Catalog methods
  async getCatalogs(): Promise<MentoringCatalog[]> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
        ...catalogData,
        numberOfSessions: totalSessions,
        totalSessions: totalSessions,
        active: catalogData.active ?? true,
        status: catalogData.status ?? 'Ativa'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCatalog(id: string, catalogData: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const updateData: any = { ...catalogData };
    
    // Recalculate total sessions if duration or frequency changed
    if (catalogData.durationMonths || catalogData.frequency) {
      const current = await this.getCatalogById(id);
      if (current) {
        const duration = catalogData.durationMonths ?? current.durationMonths;
        const frequency = catalogData.frequency ?? current.frequency;
        const totalSessions = this.calculateTotalSessions(duration, frequency);
        updateData.numberOfSessions = totalSessions;
        updateData.totalSessions = totalSessions;
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

  private async getCatalogById(id: string): Promise<MentoringCatalog | null> {
    const { data, error } = await supabase
      .from('mentoring_catalogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
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
      ...enrollment,
      mentoring: enrollment.mentoring,
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
      ...enrollment,
      mentoring: enrollment.mentoring,
      extensions: enrollment.extensions || [],
      hasExtension: (enrollment.extensions?.length || 0) > 0
    }));
  }

  async addExtension(extensionData: CreateExtensionData): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_enrollment_extensions')
      .insert(extensionData);

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
    return data || [];
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('session_number', { ascending: true });

    if (error) throw error;
    return data || [];
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
        ...sessionData,
        session_number: nextSessionNumber,
        status: sessionData.status || 'aguardando_agendamento'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSession(sessionId: string, sessionData: UpdateSessionData): Promise<boolean> {
    const { error } = await supabase
      .from('mentoring_sessions')
      .update(sessionData)
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
    return data || [];
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await supabase
      .from('mentoring_materials')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    const { data, error } = await supabase
      .from('mentoring_materials')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
