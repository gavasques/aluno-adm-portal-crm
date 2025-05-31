
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadAttachment } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMAttachments = (leadId: string) => {
  const [attachments, setAttachments] = useState<CRMLeadAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_lead_attachments')
        .select(`
          *,
          user:profiles!crm_lead_attachments_user_id_fkey(id, name, email)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected type
      const transformedAttachments = (data || []).map(attachment => ({
        ...attachment,
        user: attachment.user ? {
          id: attachment.user.id,
          name: attachment.user.name,
          email: attachment.user.email
        } : undefined
      }));

      setAttachments(transformedAttachments);
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      toast.error('Erro ao carregar anexos');
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachment = async (file: File) => {
    try {
      setUploading(true);
      
      // Upload file to storage (placeholder - implement actual storage logic)
      const filePath = `crm-attachments/${leadId}/${Date.now()}-${file.name}`;
      
      // Insert attachment record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('crm_lead_attachments')
        .insert({
          lead_id: leadId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchAttachments();
      toast.success('Arquivo enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string, filePath: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
      
      await fetchAttachments();
      toast.success('Arquivo removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    }
  };

  const downloadAttachment = async (filePath: string, fileName: string) => {
    try {
      // Implement download logic here
      console.log('Downloading:', filePath, fileName);
      toast.info('Funcionalidade de download será implementada');
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchAttachments();
    }
  }, [leadId]);

  return {
    attachments,
    loading,
    uploading,
    fetchAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    refetch: fetchAttachments
  };
};
