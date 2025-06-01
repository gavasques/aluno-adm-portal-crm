
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Trash2, 
  MessageSquare, 
  UserPlus, 
  RefreshCw,
  Calendar,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: any;
  onNotificationClick: (notification: any) => void;
  onMarkAsRead: (notificationId: string, event: React.MouseEvent) => void;
  onDelete: (notificationId: string, event: React.MouseEvent) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNotificationClick,
  onMarkAsRead,
  onDelete
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return <MessageSquare className="h-4 w-4" />;
      case 'assignment':
        return <UserPlus className="h-4 w-4" />;
      case 'status_change':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'mention':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assignment':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'status_change':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mention':
        return 'Menção';
      case 'assignment':
        return 'Atribuição';
      case 'status_change':
        return 'Mudança de Status';
      default:
        return 'Notificação';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all duration-200",
        notification.read 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      )}
      onClick={() => onNotificationClick(notification)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            "p-2 rounded-full",
            getNotificationColor(notification.type)
          )}>
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getNotificationColor(notification.type))}
              >
                {getTypeLabel(notification.type)}
              </Badge>
              
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            
            <h4 className="font-medium text-sm mb-1 truncate">
              {notification.title}
            </h4>
            
            {notification.message && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {notification.message}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {new Date(notification.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onMarkAsRead(notification.id, e)}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onDelete(notification.id, e)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
