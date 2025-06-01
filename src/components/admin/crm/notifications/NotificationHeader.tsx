
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check } from 'lucide-react';

interface NotificationHeaderProps {
  unreadCount: number;
  showUnreadOnly: boolean;
  onToggleUnreadFilter: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  showUnreadOnly,
  onToggleUnreadFilter,
  onMarkAllAsRead
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações CRM
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleUnreadFilter}
        >
          {showUnreadOnly ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {showUnreadOnly ? 'Mostrar todas' : 'Só não lidas'}
        </Button>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationHeader;
