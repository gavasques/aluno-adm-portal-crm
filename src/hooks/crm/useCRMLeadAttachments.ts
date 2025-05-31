
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadAttachment } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadAttachments = (leadId: string) => {
  const [attachments, setAttachments] = useState<CRMLeadAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAttachments = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_attachments')
        .select(`
          *,
          user:profiles!crm_lead_attachments_user_id_fkey(name)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      toast.error('Erro ao carregar anexos');
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachment = async (file: File) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Para demonstração, vamos simular o upload
      // Em um ambiente real, você faria o upload para o Supabase Storage
      const filePath = `lead-attachments/${leadId}/${Date.now()}-${file.name}`;
      
      const { error: insertError } = await supabase
        .from('crm_lead_attachments')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        });

      if (insertError) throw insertError;
      
      await fetchAttachments();
      toast.success('Arquivo enviado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao enviar arquivo');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
      
      await fetchAttachments();
      toast.success('Arquivo removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    }
  };

  const downloadAttachment = async (attachment: CRMLeadAttachment) => {
    try {
      // Em um ambiente real, você baixaria o arquivo do Supabase Storage
      // Por enquanto, vamos simular o download
      toast.info(`Download iniciado: ${attachment.file_name}`);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [leadId]);

  return {
    attachments,
    loading,
    uploading,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    fetchAttachments
  };
};
