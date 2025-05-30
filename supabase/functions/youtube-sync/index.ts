
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

interface ChannelInfo {
  subscriberCount: string;
  title: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Iniciando sincronização dos vídeos do YouTube...');
    const startTime = Date.now();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key não configurada');
      await logSync(supabaseClient, 'manual', 'error', 0, 'YouTube API key não configurada', 0);
      return new Response(
        JSON.stringify({ error: 'YouTube API key não configurada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const channelId = 'UCccs9hxFuzq77stdELIU59w';
    
    // 1. Buscar informações do canal (seguidores)
    console.log('📊 Buscando informações do canal...');
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    
    let channelInfo: ChannelInfo | null = null;
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        const channel = channelData.items[0];
        channelInfo = {
          subscriberCount: channel.statistics.subscriberCount || '0',
          title: channel.snippet.title || 'Guilherme Avasques'
        };
        console.log(`✅ Canal encontrado: ${channelInfo.title} - ${channelInfo.subscriberCount} seguidores`);
      }
    }

    // 2. Buscar vídeos mais recentes
    console.log('🎥 Buscando vídeos mais recentes...');
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=12&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      console.error(`❌ Erro na API do YouTube: ${videosResponse.status} - ${errorText}`);
      await logSync(supabaseClient, 'manual', 'error', 0, `Erro na API: ${videosResponse.status}`, Date.now() - startTime);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar vídeos da API do YouTube' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      console.log('📹 Nenhum vídeo encontrado');
      await logSync(supabaseClient, 'manual', 'success', 0, 'Nenhum vídeo encontrado', Date.now() - startTime);
      return new Response(
        JSON.stringify({ message: 'Nenhum vídeo encontrado', videos_synced: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 3. Buscar detalhes dos vídeos
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    let videoDetails = new Map();
    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      videoDetails = new Map(
        detailsData.items?.map((item: any) => [item.id, item]) || []
      );
    }

    // 4. Processar e salvar vídeos no cache
    console.log('💾 Salvando vídeos no cache...');
    const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
      const details = videoDetails.get(item.id.videoId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url || 
                  item.snippet.thumbnails.default?.url || '',
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration || 'PT0M0S',
        viewCount: details?.statistics?.viewCount || '0'
      };
    });

    // 5. Limpar cache antigo e inserir novos vídeos
    await supabaseClient.from('youtube_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { error: insertError } = await supabaseClient.from('youtube_cache').insert(
      videos.map(video => ({
        video_id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        published_at: video.publishedAt,
        duration: video.duration,
        view_count: video.viewCount
      }))
    );

    if (insertError) {
      console.error('❌ Erro ao salvar vídeos:', insertError);
      await logSync(supabaseClient, 'manual', 'error', 0, `Erro ao salvar: ${insertError.message}`, Date.now() - startTime);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar vídeos no cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // 6. Salvar informações do canal
    if (channelInfo) {
      await supabaseClient.from('youtube_channel_info').upsert({
        channel_id: channelId,
        channel_name: channelInfo.title,
        subscriber_count: channelInfo.subscriberCount,
        last_sync: new Date().toISOString(),
        sync_status: 'success'
      });
    }

    // 7. Registrar log de sucesso
    const duration = Date.now() - startTime;
    await logSync(supabaseClient, 'manual', 'success', videos.length, 'Sincronização concluída com sucesso', duration);

    console.log(`✅ Sincronização concluída: ${videos.length} vídeos salvos em ${duration}ms`);

    return new Response(
      JSON.stringify({ 
        message: 'Sincronização concluída com sucesso',
        videos_synced: videos.length,
        channel_info: channelInfo,
        duration_ms: duration
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro geral na sincronização:', error);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await logSync(supabaseClient, 'manual', 'error', 0, error.message, 0);
    
    return new Response(
      JSON.stringify({ error: 'Erro interno na sincronização' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function logSync(supabase: any, type: string, status: string, videoCount: number, message: string, duration: number) {
  try {
    await supabase.from('youtube_sync_logs').insert({
      sync_type: type,
      status,
      videos_synced: videoCount,
      error_message: status === 'error' ? message : null,
      sync_duration_ms: duration
    });
  } catch (err) {
    console.error('❌ Erro ao salvar log:', err);
  }
}
