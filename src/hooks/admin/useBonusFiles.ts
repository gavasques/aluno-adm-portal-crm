import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BonusFile } from "@/types/bonus.types";

export const useBonusFiles = (bonusId: string) => {
  const [files, setFiles] = useState<BonusFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Carregar arquivos
  const loadFiles = async () => {
    if (!bonusId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonus_files')
        .select('*')
        .eq('bonus_id', bonusId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar arquivos:', error);
        toast.error('Erro ao carregar arquivos');
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  };

  // Upload de arquivo
  const uploadFile = async (file: File, description?: string) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para fazer upload');
        return false;
      }

      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${bonusId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bonus-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        toast.error('Erro ao fazer upload do arquivo');
        return false;
      }

      // Salvar metadados no banco
      const { data, error } = await supabase
        .from('bonus_files')
        .insert([{
          bonus_id: bonusId,
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          description,
          file_path: filePath
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar metadados:', error);
        toast.error('Erro ao salvar informações do arquivo');
        
        // Remover arquivo do storage se falhou ao salvar metadados
        await supabase.storage
          .from('bonus-files')
          .remove([filePath]);
        
        return false;
      }

      setFiles(prev => [data, ...prev]);
      toast.success('Arquivo enviado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao fazer upload');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Excluir arquivo
  const deleteFile = async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return false;

      // Remover do storage
      const { error: storageError } = await supabase.storage
        .from('bonus-files')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Erro ao remover do storage:', storageError);
        toast.error('Erro ao remover arquivo do storage');
        return false;
      }

      // Remover do banco
      const { error } = await supabase
        .from('bonus_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Erro ao excluir arquivo:', error);
        toast.error('Erro ao excluir arquivo');
        return false;
      }

      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('Arquivo excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao excluir arquivo');
      return false;
    }
  };

  // Obter URL pública do arquivo
  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('bonus-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  // Download do arquivo
  const downloadFile = async (file: BonusFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('bonus-files')
        .download(file.file_path);

      if (error) {
        console.error('Erro ao baixar arquivo:', error);
        toast.error('Erro ao baixar arquivo');
        return;
      }

      // Criar URL temporária para download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao baixar arquivo');
    }
  };

  useEffect(() => {
    loadFiles();
  }, [bonusId]);

  return {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    downloadFile,
    getFileUrl,
    loadFiles
  };
};
