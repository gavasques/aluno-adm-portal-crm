
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎥 Iniciando busca de vídeos do YouTube...');
    
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key não configurada');
      // Retornar array vazio em vez de erro para não quebrar o frontend
      return new Response(
        JSON.stringify({ videos: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Canal ID direto do @guilhermeavasques
    const channelId = 'UCccs9hxFuzq77stdELIU59w';
    
    console.log(`✅ Usando canal ID: ${channelId}`);

    // Buscar os últimos vídeos do canal
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    console.log('🔗 URL da busca:', videosUrl.replace(YOUTUBE_API_KEY, '[HIDDEN]'));

    const videosResponse = await fetch(videosUrl);
    
    console.log('📡 Status da resposta:', videosResponse.status);

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      console.error(`❌ Erro na API do YouTube (${videosResponse.status}):`, errorText);
      
      // Se erro 403 (quota exceeded ou API key inválida), retornar array vazio
      if (videosResponse.status === 403) {
        console.log('⚠️ Erro 403 - Retornando array vazio para não quebrar o frontend');
        return new Response(
          JSON.stringify({ videos: [] }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
      
      throw new Error(`Erro na API do YouTube: ${videosResponse.status} - ${errorText}`);
    }

    const videosData = await videosResponse.json();
    console.log('📊 Dados recebidos:', {
      itemCount: videosData.items?.length || 0,
      hasError: !!videosData.error
    });
    
    if (videosData.error) {
      console.error('❌ Erro no JSON da resposta:', videosData.error);
      return new Response(
        JSON.stringify({ videos: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    if (!videosData.items || videosData.items.length === 0) {
      console.log('📹 Nenhum vídeo encontrado');
      return new Response(
        JSON.stringify({ videos: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Obter detalhes adicionais dos vídeos (duração, visualizações)
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    console.log('🔍 Buscando detalhes dos vídeos...');
    const detailsResponse = await fetch(detailsUrl);

    let videoDetails = new Map();
    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      videoDetails = new Map(
        detailsData.items?.map((item: any) => [item.id, item]) || []
      );
      console.log('✅ Detalhes obtidos para', videoDetails.size, 'vídeos');
    } else {
      console.warn('⚠️ Não foi possível obter detalhes dos vídeos, continuando sem eles');
    }

    // Processar vídeos
    const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
      const details = videoDetails.get(item.id.videoId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url || 
                  item.snippet.thumbnails.default?.url || 
                  '/placeholder-video.jpg',
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails?.duration || 'PT0M0S',
        viewCount: details?.statistics?.viewCount || '0'
      };
    });

    console.log(`✅ ${videos.length} vídeos processados com sucesso`);

    return new Response(
      JSON.stringify({ videos }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro geral na função:', error);
    
    // Sempre retornar array vazio em vez de erro 500 para não quebrar o frontend
    return new Response(
      JSON.stringify({ 
        videos: [],
        error: 'Erro ao carregar vídeos, tente novamente mais tarde'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
