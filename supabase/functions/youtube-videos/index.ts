
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎥 Buscando vídeos do cache...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Buscar vídeos do cache
    const { data: cachedVideos, error: cacheError } = await supabaseClient
      .from('youtube_cache')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(6);

    if (cacheError) {
      console.error('❌ Erro ao buscar cache:', cacheError);
      throw cacheError;
    }

    // Buscar informações do canal
    const { data: channelInfo } = await supabaseClient
      .from('youtube_channel_info')
      .select('*')
      .single();

    // Converter dados do cache para o formato esperado
    const videos: YouTubeVideo[] = cachedVideos?.map(video => ({
      id: video.video_id,
      title: video.title,
      description: video.description || '',
      thumbnail: video.thumbnail,
      publishedAt: video.published_at,
      duration: video.duration,
      viewCount: video.view_count
    })) || [];

    console.log(`✅ ${videos.length} vídeos carregados do cache`);

    const response = {
      videos,
      channel_info: channelInfo ? {
        subscriber_count: channelInfo.subscriber_count,
        channel_name: channelInfo.channel_name,
        last_sync: channelInfo.last_sync
      } : null,
      cached: true,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro ao carregar vídeos:', error);
    
    // Fallback: retornar array vazio em caso de erro
    return new Response(
      JSON.stringify({ 
        videos: [],
        channel_info: null,
        error: 'Erro ao carregar vídeos do cache',
        cached: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
