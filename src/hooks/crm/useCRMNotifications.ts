
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMNotification } from '@/types/crm.types';

export const useCRMNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('crm_notifications')
          .select('*');

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  return { notifications, loading };
};
