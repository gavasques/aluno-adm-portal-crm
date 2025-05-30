
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

interface UseYouTubeVideosReturn {
  videos: YouTubeVideo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useYouTubeVideos = (): UseYouTubeVideosReturn => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎥 Buscando vídeos do YouTube...');

      const { data, error: supabaseError } = await supabase.functions.invoke('youtube-videos');

      if (supabaseError) {
        console.error('❌ Erro na Edge Function:', supabaseError);
        throw new Error('Erro de conexão com o serviço');
      }

      if (data?.error) {
        console.error('❌ Erro retornado pela API:', data.error);
        // Não lançar erro se a API retornou array vazio com mensagem de erro
        setError(data.error);
        setVideos([]);
        return;
      }

      const fetchedVideos = data?.videos || [];
      console.log(`✅ ${fetchedVideos.length} vídeos carregados`);
      
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error('❌ Erro ao carregar vídeos:', err);
      setError('Não foi possível carregar os vídeos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const refetch = () => {
    console.log('🔄 Recarregando vídeos...');
    fetchVideos();
  };

  return {
    videos,
    loading,
    error,
    refetch
  };
};
