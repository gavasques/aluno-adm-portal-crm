
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastManager } from '@/hooks/useToastManager';
import { CRMLeadAttachment } from '@/types/crm.types';

export const useCRMAttachments = (leadId: string) => {
  const [attachments, setAttachments] = useState<CRMLeadAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToastManager();

  const fetchAttachments = useCallback(async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      
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
  }, [leadId, toast]);

  const uploadAttachment = useCallback(async (file: File) => {
    if (!leadId) return null;

    try {
      setUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${leadId}/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('crm-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Registrar no banco de dados
      const { data, error: dbError } = await supabase
        .from('crm_lead_attachments')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Arquivo anexado com sucesso');
      await fetchAttachments();
      
      return data;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao anexar arquivo');
      return null;
    } finally {
      setUploading(false);
    }
  }, [leadId, fetchAttachments, toast]);

  const deleteAttachment = useCallback(async (attachmentId: string, filePath: string) => {
    try {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('crm-attachments')
        .remove([filePath]);

      if (storageError) {
        console.warn('Erro ao deletar do storage:', storageError);
      }

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('crm_lead_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      toast.success('Anexo removido com sucesso');
      await fetchAttachments();
    } catch (error) {
      console.error('Erro ao deletar anexo:', error);
      toast.error('Erro ao remover anexo');
    }
  }, [fetchAttachments, toast]);

  const downloadAttachment = useCallback(async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('crm-attachments')
        .download(filePath);

      if (error) throw error;

      // Criar URL para download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  }, [toast]);

  return {
    attachments,
    loading,
    uploading,
    fetchAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment
  };
};
