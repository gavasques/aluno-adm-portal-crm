
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';
import { useCRMNotifications } from '@/hooks/crm/useCRMNotifications';
import { useCRMNotificationFilters } from '@/hooks/crm/useCRMNotificationFilters';
import { useCRMNotificationActions } from '@/hooks/crm/useCRMNotificationActions';
import NotificationHeader from './notifications/NotificationHeader';
import NotificationItem from './notifications/NotificationItem';
import NotificationEmptyState from './notifications/NotificationEmptyState';

interface CRMNotificationCenterProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMNotificationCenter: React.FC<CRMNotificationCenterProps> = ({ 
  onOpenLead 
}) => {
  const {
    notifications,
    unreadCount,
    loading
  } = useCRMNotifications();

  const { 
    showUnreadOnly, 
    toggleUnreadFilter 
  } = useCRMNotificationFilters();

  const {
    handleNotificationClick,
    handleMarkAsRead,
    handleDelete,
    markAllAsRead
  } = useCRMNotificationActions({ onOpenLead });

  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <NotificationHeader
          unreadCount={unreadCount}
          showUnreadOnly={showUnreadOnly}
          onToggleUnreadFilter={toggleUnreadFilter}
          onMarkAllAsRead={markAllAsRead}
        />
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <NotificationEmptyState showUnreadOnly={showUnreadOnly} />
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onNotificationClick={handleNotificationClick}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CRMNotificationCenter;
