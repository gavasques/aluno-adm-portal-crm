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
  MentoringExtension
} from '@/types/mentoring.types';

interface SupabaseMentoringCatalog {
  id: string;
  name: string;
  type: string;
  instructor: string;
  duration_weeks: number;
  number_of_sessions: number;
  total_sessions: number;
  price: number;
  description: string;
  tags: string[];
  image_url?: string;
  active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export class SupabaseMentoringRepository implements IMentoringRepository {
  private transformFromSupabase(data: SupabaseMentoringCatalog): MentoringCatalog {
    return {
      id: data.id,
      name: data.name,
      type: (data.type as 'Individual' | 'Grupo'),
      instructor: data.instructor,
      durationWeeks: data.duration_weeks,
      numberOfSessions: data.number_of_sessions,
      totalSessions: data.total_sessions,
      price: data.price,
      description: data.description,
      tags: data.tags || [],
      imageUrl: data.image_url,
      active: data.active,
      status: (data.status as 'Ativa' | 'Inativa' | 'Cancelada'),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      extensions: []
    };
  }

  private transformToSupabase(data: CreateMentoringCatalogData) {
    return {
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      duration_weeks: data.durationWeeks,
      number_of_sessions: data.numberOfSessions,
      total_sessions: data.numberOfSessions,
      price: data.price,
      description: data.description,
      active: data.active ?? true,
      status: data.status ?? 'Ativa'
    };
  }

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

    return (data || []).map((item) => this.transformFromSupabase(item as SupabaseMentoringCatalog));
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

    return this.transformFromSupabase(data as SupabaseMentoringCatalog);
  }

  async createCatalog(data: CreateMentoringCatalogData): Promise<MentoringCatalog> {
    const supabaseData = this.transformToSupabase(data);
    
    const { data: result, error } = await supabase
      .from('mentoring_catalogs')
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating catalog:', error);
      throw new Error('Erro ao criar mentoria');
    }

    return this.transformFromSupabase(result as SupabaseMentoringCatalog);
  }

  async updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.instructor !== undefined) updateData.instructor = data.instructor;
    if (data.durationWeeks !== undefined) updateData.duration_weeks = data.durationWeeks;
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

  // Enrollment operations (mock for now)
  async getEnrollments(): Promise<StudentMentoringEnrollment[]> {
    return [];
  }

  async getStudentEnrollments(studentId: string): Promise<StudentMentoringEnrollment[]> {
    return [];
  }

  async addExtension(data: CreateExtensionData): Promise<boolean> {
    return true;
  }

  // Session operations (mock for now)
  async getSessions(): Promise<MentoringSession[]> {
    return [];
  }

  async getEnrollmentSessions(enrollmentId: string): Promise<MentoringSession[]> {
    return [];
  }

  async createSession(data: CreateSessionData): Promise<MentoringSession> {
    throw new Error('Not implemented yet');
  }

  // Material operations (mock for now)
  async getMaterials(): Promise<MentoringMaterial[]> {
    return [];
  }

  async getEnrollmentMaterials(enrollmentId: string): Promise<MentoringMaterial[]> {
    return [];
  }

  async getSessionMaterials(sessionId: string): Promise<MentoringMaterial[]> {
    return [];
  }
}
