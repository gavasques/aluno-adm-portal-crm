
import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationEmptyStateProps {
  showUnreadOnly: boolean;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({ 
  showUnreadOnly 
}) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      {showUnreadOnly 
        ? 'Nenhuma notificação não lida'
        : 'Nenhuma notificação encontrada'
      }
    </div>
  );
};

export default NotificationEmptyState;
