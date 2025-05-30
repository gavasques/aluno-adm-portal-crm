import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, RefreshCw, AlertCircle, Wifi, Users, Calendar } from 'lucide-react';
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

  const formatSubscriberCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatLastSync = (syncDate: string) => {
    try {
      return formatDistanceToNow(new Date(syncDate), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'data inválida';
    }
  };

  const renderContent = () => {
    if (loading) {
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

    if (error) {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Wifi className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Problema de Conexão
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Não foi possível carregar os vídeos no momento. Isso pode ser temporário.
            </p>
            <Button onClick={refetch} variant="outline" size="sm" className="space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </Button>
          </div>
        </div>
      );
    }

    if (videos.length === 0) {
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
            {isAdmin && (
              <Button 
                onClick={syncVideos} 
                variant="outline" 
                size="sm" 
                className="space-x-2"
                disabled={syncing}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>Sincronizar agora</span>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <YouTubeVideoCard key={video.id} video={video} index={index} />
        ))}
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
                Últimos vídeos de Meu canal @guilhermeavasques
              </CardTitle>
              <div className="flex items-center gap-4 mt-1">
                {channelInfo && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{formatSubscriberCount(channelInfo.subscriber_count)} seguidores</span>
                  </div>
                )}
                {lastSync && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
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
            
            {!loading && (
              <Button 
                onClick={refetch} 
                variant="ghost" 
                size="sm"
                className="opacity-70 hover:opacity-100"
                disabled={loading || syncing}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};
