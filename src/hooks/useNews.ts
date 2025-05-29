
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  author_name?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNews = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      // Se não incluir não publicadas, filtrar apenas as publicadas
      if (!includeUnpublished) {
        query = query.eq('status', 'published');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Erro ao buscar notícias:', fetchError);
        throw fetchError;
      }

      // Tipagem correta dos dados retornados
      const typedNews: News[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        author_id: item.author_id,
        author_name: item.author_name,
        status: item.status as 'draft' | 'published',
        published_at: item.published_at,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setNews(typedNews);
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('news')
        .insert([{
          ...newsData,
          author_id: user?.id,
          author_name: user?.user_metadata?.name || user?.email || 'Admin'
        }])
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar notícia:', createError);
        throw createError;
      }

      await fetchNews(true); // Recarregar lista incluindo não publicadas
      return data;
    } catch (err) {
      console.error('Erro ao criar notícia:', err);
      throw err;
    }
  };

  const updateNews = async (id: string, updates: Partial<News>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar notícia:', updateError);
        throw updateError;
      }

      await fetchNews(true); // Recarregar lista
      return data;
    } catch (err) {
      console.error('Erro ao atualizar notícia:', err);
      throw err;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Erro ao deletar notícia:', deleteError);
        throw deleteError;
      }

      await fetchNews(true); // Recarregar lista
    } catch (err) {
      console.error('Erro ao deletar notícia:', err);
      throw err;
    }
  };

  const publishNews = async (id: string) => {
    return updateNews(id, { 
      status: 'published', 
      published_at: new Date().toISOString() 
    });
  };

  const unpublishNews = async (id: string) => {
    return updateNews(id, { 
      status: 'draft', 
      published_at: null 
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    publishNews,
    unpublishNews,
    refetch: () => fetchNews(true)
  };
};
