
import React from 'react';
import { BookOpen, Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  type: 'enrollments' | 'sessions' | 'materials';
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description }) => {
  const config = {
    enrollments: {
      icon: BookOpen,
      defaultTitle: 'Nenhuma mentoria encontrada',
      defaultDescription: 'Você ainda não possui inscrições em mentorias. Entre em contato para se inscrever.'
    },
    sessions: {
      icon: Calendar,
      defaultTitle: 'Nenhuma sessão agendada',
      defaultDescription: 'Não há sessões agendadas para esta mentoria no momento.'
    },
    materials: {
      icon: FileText,
      defaultTitle: 'Nenhum material disponível',
      defaultDescription: 'Ainda não há materiais compartilhados para esta mentoria.'
    }
  };

  const { icon: Icon, defaultTitle, defaultDescription } = config[type];

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title || defaultTitle}
        </h3>
        <p className="text-gray-500">
          {description || defaultDescription}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
