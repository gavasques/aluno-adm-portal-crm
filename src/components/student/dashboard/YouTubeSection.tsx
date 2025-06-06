
import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, RefreshCw, AlertCircle, Users, Calendar, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { YouTubeVideoCard } from './YouTubeVideoCard';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const YouTubeSection: React.FC = () => {
  const { 
    videos, 
    channelInfo, 
    loading, 
    error, 
    isAdmin, 
    refetch, 
    syncVideos, 
    syncing, 
    lastSync 
  } = useYouTubeVideos();

  console.log('🎥 YouTubeSection: Estado detalhado', {
    videosCount: videos?.length || 0,
    videos: videos?.map(v => ({ id: v.id, title: v.title?.substring(0, 30) })),
    loading,
    error,
    isAdmin,
    syncing,
    hasChannelInfo: !!channelInfo,
    lastSync
  });

  const formatSubscriberCount = (count: string) => {
    if (!count) return '0';
    const num = parseInt(count);
    if (isNaN(num)) return '0';
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatLastSync = (syncDate: string) => {
    if (!syncDate) return 'nunca';
    
    try {
      return formatDistanceToNow(new Date(syncDate), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      console.warn('Erro ao formatar data de sync:', error);
      return 'data inválida';
    }
  };

  const renderContent = () => {
    // Estado de loading
    if (loading) {
      console.log('🔄 YouTubeSection: Renderizando skeleton de loading');
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      );
    }

    // Se há vídeos, mostrar mesmo com erro (dados em cache)
    if (videos && videos.length > 0) {
      console.log(`✅ YouTubeSection: Renderizando ${videos.length} vídeos`);
      
      try {
        return (
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  Exibindo dados em cache - {error}
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, index) => {
                if (!video || !video.id) {
                  console.warn('⚠️ Vídeo inválido encontrado:', video);
                  return null;
                }
                
                return (
                  <YouTubeVideoCard 
                    key={`${video.id}-${index}`} 
                    video={video} 
                    index={index} 
                  />
                );
              }).filter(Boolean)}
            </div>
          </div>
        );
      } catch (renderError) {
        console.error('❌ Erro ao renderizar vídeos:', renderError);
        return (
          <div className="text-center py-8">
            <p className="text-red-600">Erro ao exibir vídeos. Tente recarregar a página.</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar
            </Button>
          </div>
        );
      }
    }

    // Diferentes estados de erro sem vídeos
    if (error) {
      console.log('❌ YouTubeSection: Renderizando estado de erro:', error);
      
      const isConfigurationError = error.includes('API key') || error.includes('configuração') || error.includes('Configuration');
      const isTemporaryError = error.includes('temporariamente') || error.includes('Cache');
      
      return (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${
              isConfigurationError ? 'bg-red-100 dark:bg-red-900/20' : 'bg-amber-100 dark:bg-amber-900/20'
            }`}>
              {isConfigurationError ? (
                <Settings className="w-8 h-8 text-red-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-500" />
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isConfigurationError ? 'Configuração Necessária' : 
               isTemporaryError ? 'Serviço Temporariamente Indisponível' : 
               'Sistema de Vídeos Indisponível'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm max-w-md mx-auto">
              {isConfigurationError ? 
                'O sistema de vídeos precisa ser configurado por um administrador.' :
                isTemporaryError ?
                'O sistema está temporariamente indisponível. Tente novamente em alguns minutos.' :
                'Os vídeos não puderam ser carregados. Tente novamente mais tarde.'
              }
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={refetch} variant="outline" size="sm" className="space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Tentar novamente</span>
              </Button>
              
              {isAdmin && isConfigurationError && (
                <Button 
                  onClick={syncVideos} 
                  variant="default" 
                  size="sm" 
                  className="space-x-2"
                  disabled={syncing}
                >
                  <Settings className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  <span>Configurar Sistema</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Estado vazio sem erro
    console.log('📭 YouTubeSection: Renderizando estado vazio');
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Youtube className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum vídeo disponível
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Os vídeos mais recentes aparecerão aqui em breve.
          </p>
          <Button onClick={refetch} variant="outline" size="sm" className="space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Verificar novamente</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Últimos vídeos do YouTube
              </CardTitle>
              <div className="flex items-center gap-4 mt-1">
                {channelInfo && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{formatSubscriberCount(channelInfo.subscriber_count)} seguidores</span>
                  </div>
                )}
                {lastSync && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Atualizado {formatLastSync(lastSync)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {syncing && (
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Sincronizando...
              </Badge>
            )}
            
            {isAdmin && (
              <Button 
                onClick={syncVideos} 
                variant="ghost" 
                size="sm"
                className="opacity-70 hover:opacity-100"
                disabled={syncing}
                title="Sincronizar vídeos agora (apenas admin)"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              </Button>
            )}
            
            <Button 
              onClick={refetch} 
              variant="ghost" 
              size="sm"
              className="opacity-70 hover:opacity-100"
              disabled={loading || syncing}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};
