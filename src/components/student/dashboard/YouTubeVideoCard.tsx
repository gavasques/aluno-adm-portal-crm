
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { YouTubeVideo } from '@/hooks/useYouTubeVideos';

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
  index: number;
}

// Função para converter duração ISO 8601 para formato legível
const formatDuration = (duration: string): string => {
  if (!duration) return '0:00';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Função para formatar número de visualizações
const formatViewCount = (count: string): string => {
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

// Função para formatar data
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `há ${Math.ceil(diffDays / 30)} meses`;
    return `há ${Math.ceil(diffDays / 365)} anos`;
  } catch (error) {
    console.warn('Erro ao formatar data:', error);
    return '';
  }
};

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ video, index }) => {
  console.log('🎬 Renderizando YouTubeVideoCard:', {
    videoId: video.id,
    title: video.title?.substring(0, 50),
    thumbnail: video.thumbnail,
    index
  });

  const handleVideoClick = () => {
    if (video.id) {
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
    }
  };

  // Fallbacks para dados ausentes
  const safeVideo = {
    id: video.id || '',
    title: video.title || 'Título não disponível',
    thumbnail: video.thumbnail || '/placeholder-video.jpg',
    duration: video.duration || 'PT0M0S',
    viewCount: video.viewCount || '0',
    publishedAt: video.publishedAt || new Date().toISOString()
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={handleVideoClick}
    >
      <Card className="overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300 group">
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={safeVideo.thumbnail}
            alt={safeVideo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              console.warn('Erro ao carregar thumbnail:', safeVideo.thumbnail);
              e.currentTarget.src = '/placeholder-video.jpg';
            }}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(safeVideo.duration)}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {safeVideo.title}
          </h3>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{formatViewCount(safeVideo.viewCount)} visualizações</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(safeVideo.publishedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
