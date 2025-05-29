
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
        throw new Error(supabaseError.message || 'Erro ao buscar vídeos');
      }

      if (data?.error) {
        console.error('❌ Erro retornado pela API:', data.error);
        throw new Error(data.error);
      }

      const fetchedVideos = data?.videos || [];
      console.log(`✅ ${fetchedVideos.length} vídeos carregados`);
      
      setVideos(fetchedVideos);
    } catch (err) {
      console.error('❌ Erro ao carregar vídeos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const refetch = () => {
    fetchVideos();
  };

  return {
    videos,
    loading,
    error,
    refetch
  };
};
