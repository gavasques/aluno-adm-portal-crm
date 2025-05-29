
import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { YouTubeVideoCard } from './YouTubeVideoCard';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';

export const YouTubeSection: React.FC = () => {
  const { videos, loading, error, refetch } = useYouTubeVideos();

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
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Erro ao carregar vídeos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={refetch} variant="outline" className="space-x-2">
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
            <Youtube className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum vídeo encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Não foi possível carregar os vídeos do canal no momento.
            </p>
            <Button onClick={refetch} variant="outline" className="space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar</span>
            </Button>
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
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Últimos Vídeos
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Confira o conteúdo mais recente do canal
              </p>
            </div>
          </div>
          
          {!loading && !error && (
            <Button 
              onClick={refetch} 
              variant="ghost" 
              size="sm"
              className="opacity-70 hover:opacity-100"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};
