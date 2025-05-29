
import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNews } from '@/hooks/useNews';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NewsSection: React.FC = () => {
  const { news, loading, error } = useNews();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded mb-1"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
          <div className="text-red-600 dark:text-red-400 mb-2">
            Erro ao carregar notícias
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      );
    }

    if (news.length === 0) {
      return (
        <div className="text-center py-8">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma notícia disponível
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            As novidades aparecerão aqui em breve!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {news.slice(0, 3).map((item, index) => (
          <NewsCard key={item.id} news={item} index={index} />
        ))}
        
        {news.length > 3 && (
          <div className="text-center pt-4">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              Ver todas as notícias
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                📰 Notícias e Atualizações
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fique por dentro das novidades
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    published_at?: string;
    created_at: string;
  };
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, index }) => {
  const [expanded, setExpanded] = React.useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getPreview = (content: string) => {
    if (news.excerpt) return news.excerpt;
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white flex-1 pr-4">
          {news.title}
        </h4>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(news.published_at || news.created_at)}</span>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {expanded ? (
          <div className="whitespace-pre-wrap">{news.content}</div>
        ) : (
          <div>{getPreview(news.content)}</div>
        )}
      </div>
      
      {(news.content.length > 150 || news.excerpt) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-700 p-0 h-auto mt-2"
        >
          {expanded ? 'Ler menos' : 'Ler mais'}
        </Button>
      )}
    </motion.div>
  );
};
