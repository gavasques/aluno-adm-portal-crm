
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

export interface ChannelInfo {
  subscriber_count: string;
  channel_name: string;
  last_sync: string;
}

interface UseYouTubeVideosReturn {
  videos: YouTubeVideo[];
  channelInfo: ChannelInfo | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  refetch: () => void;
  syncVideos: () => Promise<void>;
  syncing: boolean;
  lastSync: string | null;
}

export const useYouTubeVideos = (): UseYouTubeVideosReturn => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user } = useAuth();

  // Verificar se é admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (!error) {
          setIsAdmin(data || false);
        }
      } catch (err) {
        console.error('Erro ao verificar status admin:', err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎥 Buscando vídeos do cache...');

      const { data, error: supabaseError } = await supabase.functions.invoke('youtube-videos');

      if (supabaseError) {
        console.error('❌ Erro na Edge Function:', supabaseError);
        throw new Error('Erro de conexão com o serviço');
      }

      if (data?.error) {
        console.error('❌ Erro retornado pela API:', data.error);
        setError(data.error);
        setVideos([]);
        return;
      }

      const fetchedVideos = data?.videos || [];
      const channelData = data?.channel_info || null;
      
      console.log(`✅ ${fetchedVideos.length} vídeos carregados do cache`);
      
      setVideos(fetchedVideos);
      setChannelInfo(channelData);
      setError(null);
      
      if (channelData?.last_sync) {
        setLastSync(channelData.last_sync);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar vídeos:', err);
      setError('Não foi possível carregar os vídeos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const syncVideos = async () => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem sincronizar vídeos');
      return;
    }

    try {
      setSyncing(true);
      console.log('🔄 Iniciando sincronização manual...');
      
      toast.loading('Sincronizando vídeos do YouTube...', { id: 'sync' });

      const { data, error } = await supabase.functions.invoke('youtube-sync', {
        body: { manual: true }
      });

      if (error) {
        console.error('❌ Erro na sincronização:', error);
        throw new Error('Erro na sincronização');
      }

      if (data?.error) {
        console.error('❌ Erro retornado:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ Sincronização concluída:', data);
      toast.success(`${data.videos_synced} vídeos sincronizados com sucesso!`, { id: 'sync' });
      
      // Atualizar dados após sincronização
      await fetchVideos();
      
    } catch (err) {
      console.error('❌ Erro na sincronização:', err);
      toast.error('Erro ao sincronizar vídeos', { id: 'sync' });
    } finally {
      setSyncing(false);
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
    channelInfo,
    loading,
    error,
    isAdmin,
    refetch,
    syncVideos,
    syncing,
    lastSync
  };
};
