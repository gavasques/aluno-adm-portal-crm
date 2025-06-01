
import { useCRMNotifications } from './useCRMNotifications';

interface UseNotificationActionsProps {
  onOpenLead?: (leadId: string) => void;
}

export const useCRMNotificationActions = ({ onOpenLead }: UseNotificationActionsProps) => {
  const { markAsRead, markAllAsRead, deleteNotification } = useCRMNotifications();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.lead_id && onOpenLead) {
      onOpenLead(notification.lead_id);
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteNotification(notificationId);
  };

  return {
    handleNotificationClick,
    handleMarkAsRead,
    handleDelete,
    markAllAsRead
  };
};
