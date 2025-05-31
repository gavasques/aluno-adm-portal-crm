
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastManager } from '@/hooks/useToastManager';

interface EmailData {
  leadName?: string;
  leadEmail?: string;
  responsibleName?: string;
  contactDate?: string;
  contactType?: string;
  columnName?: string;
  [key: string]: any;
}

export const useCRMEmail = () => {
  const toast = useToastManager();

  const sendEmail = useCallback(async (
    to: string,
    template: 'lead_assigned' | 'contact_scheduled' | 'lead_moved',
    data: EmailData,
    subject?: string
  ) => {
    try {
      console.log('📧 Enviando email CRM:', { to, template, data });

      const { data: result, error } = await supabase.functions.invoke('send-crm-email', {
        body: {
          to,
          template,
          data,
          subject
        }
      });

      if (error) throw error;

      if (result?.success) {
        toast.success('Email enviado com sucesso');
        return true;
      } else {
        throw new Error(result?.error || 'Erro ao enviar email');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      toast.error('Erro ao enviar email');
      return false;
    }
  }, [toast]);

  const sendLeadAssignedEmail = useCallback(async (
    responsibleEmail: string,
    leadData: { name: string; email: string },
    responsibleName: string
  ) => {
    return sendEmail(
      responsibleEmail,
      'lead_assigned',
      {
        leadName: leadData.name,
        leadEmail: leadData.email,
        responsibleName
      }
    );
  }, [sendEmail]);

  const sendContactScheduledEmail = useCallback(async (
    responsibleEmail: string,
    contactData: {
      leadName: string;
      contactDate: string;
      contactType: string;
    }
  ) => {
    return sendEmail(
      responsibleEmail,
      'contact_scheduled',
      contactData
    );
  }, [sendEmail]);

  const sendLeadMovedEmail = useCallback(async (
    responsibleEmail: string,
    moveData: {
      leadName: string;
      columnName: string;
    }
  ) => {
    return sendEmail(
      responsibleEmail,
      'lead_moved',
      moveData
    );
  }, [sendEmail]);

  return {
    sendEmail,
    sendLeadAssignedEmail,
    sendContactScheduledEmail,
    sendLeadMovedEmail
  };
};
