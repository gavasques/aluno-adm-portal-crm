
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
      throw new Error('YouTube API key não configurada');
    }

    // ID do canal @guilhermeavasques
    const channelUsername = 'guilhermeavasques';
    
    // Primeiro, obter o ID do canal usando o username
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channelUsername}&key=${YOUTUBE_API_KEY}`
    );
    
    let channelData = await channelResponse.json();
    let channelId = channelData.items?.[0]?.id;
    
    // Se não encontrou por username, tentar por handle
    if (!channelId) {
      const handleResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${channelUsername}&key=${YOUTUBE_API_KEY}`
      );
      const handleData = await handleResponse.json();
      channelId = handleData.items?.[0]?.id;
    }
    
    // Se ainda não encontrou, usar pesquisa
    if (!channelId) {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=guilherme+vasques&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      const searchData = await searchResponse.json();
      channelId = searchData.items?.[0]?.id?.channelId;
    }

    if (!channelId) {
      console.error('❌ Canal não encontrado');
      throw new Error('Canal não encontrado');
    }

    console.log(`✅ Canal encontrado: ${channelId}`);

    // Buscar os últimos vídeos do canal
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!videosResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${videosResponse.status}`);
    }

    const videosData = await videosResponse.json();
    
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
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    const detailsData = await detailsResponse.json();
    const videoDetails = new Map(
      detailsData.items?.map((item: any) => [item.id, item]) || []
    );

    // Processar vídeos
    const videos: YouTubeVideo[] = videosData.items.map((item: any) => {
      const details = videoDetails.get(item.id.videoId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
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
    console.error('❌ Erro ao buscar vídeos:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao buscar vídeos do YouTube',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
