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

interface SupabaseMentoringCatalog {
  id: string;
  name: string;
  type: string;
  instructor: string;
  duration_months: number;
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
      durationMonths: data.duration_months,
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
      duration_months: data.durationMonths,
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

    const catalogs = (data || []).map((item) => this.transformFromSupabase(item as SupabaseMentoringCatalog));
    
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

    const catalog = this.transformFromSupabase(data as SupabaseMentoringCatalog);
    catalog.extensions = await this.getCatalogExtensions(catalog.id);
    
    return catalog;
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

    const catalog = this.transformFromSupabase(result as SupabaseMentoringCatalog);
    
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
      description: ext.description
    }));
  }

  async createCatalogExtensions(catalogId: string, extensions: MentoringExtensionOption[]): Promise<void> {
    const extensionsData = extensions.map(ext => ({
      catalog_id: catalogId,
      months: ext.months,
      price: ext.price,
      description: ext.description
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
    await supabase
      .from('mentoring_extensions')
      .delete()
      .eq('catalog_id', catalogId);

    // Depois, cria as novas extensões
    if (extensions && extensions.length > 0) {
      await this.createCatalogExtensions(catalogId, extensions);
    }
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
