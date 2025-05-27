
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MentoringCatalog } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';
import { calculateSessionsFromFrequency } from '@/utils/mentoringCalculations';

export const useMentoringCatalogData = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Buscando catálogos de mentoria...');

      // Buscar catálogos
      const { data: catalogsData, error: catalogsError } = await supabase
        .from('mentoring_catalogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (catalogsError) {
        console.error('❌ Erro ao buscar catálogos:', catalogsError);
        throw catalogsError;
      }

      console.log('📋 Catálogos encontrados:', catalogsData?.length || 0, catalogsData);

      const transformedCatalogs: MentoringCatalog[] = [];

      for (const catalog of catalogsData || []) {
        // Buscar extensões para cada catálogo
        const { data: extensionsData, error: extensionsError } = await supabase
          .from('mentoring_extensions')
          .select('*')
          .eq('catalog_id', catalog.id)
          .order('months', { ascending: true });

        if (extensionsError) {
          console.error('❌ Erro ao buscar extensões para catálogo', catalog.id, ':', extensionsError);
        }

        console.log('📦 Extensões para catálogo', catalog.name, ':', extensionsData?.length || 0);

        const extensions = (extensionsData || []).map(ext => ({
          id: ext.id,
          months: ext.months,
          price: ext.price,
          totalSessions: calculateSessionsFromFrequency(ext.months, 'Semanal'),
          description: ext.description || ''
        }));

        const transformedCatalog: MentoringCatalog = {
          id: catalog.id,
          name: catalog.name,
          type: catalog.type as 'Individual' | 'Grupo',
          instructor: catalog.instructor,
          durationMonths: catalog.duration_months,
          frequency: 'Semanal', // Default frequency
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

        transformedCatalogs.push(transformedCatalog);
      }

      console.log('✅ Catálogos transformados:', transformedCatalogs.length, transformedCatalogs);
      setCatalogs(transformedCatalogs);

    } catch (err: any) {
      console.error('❌ Erro geral ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar mentorias');
      toast({
        title: "Erro",
        description: "Erro ao carregar mentorias. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return {
    catalogs,
    loading,
    error,
    refetch: fetchCatalogs
  };
};
