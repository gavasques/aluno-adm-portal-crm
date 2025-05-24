
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserStorageInfo {
  storage_used_mb: number;
  storage_limit_mb: number;
  storage_available_mb: number;
  usage_percentage: number;
}

interface UserFile {
  id: string;
  file_name: string;
  file_size_mb: number;
  file_type: string;
  upload_date: string;
  supplier_id?: string;
}

export const useUserStorage = () => {
  const { user } = useAuth();
  const [storageInfo, setStorageInfo] = useState<UserStorageInfo | null>(null);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStorageInfo = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_storage')
        .select('storage_used_mb, storage_limit_mb')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar informações de armazenamento:', error);
        return;
      }

      if (data) {
        const storage_available_mb = data.storage_limit_mb - data.storage_used_mb;
        const usage_percentage = (data.storage_used_mb / data.storage_limit_mb) * 100;

        setStorageInfo({
          storage_used_mb: data.storage_used_mb,
          storage_limit_mb: data.storage_limit_mb,
          storage_available_mb,
          usage_percentage
        });
      } else {
        // Criar registro inicial se não existir
        setStorageInfo({
          storage_used_mb: 0,
          storage_limit_mb: 100,
          storage_available_mb: 100,
          usage_percentage: 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar armazenamento:', error);
    }
  };

  const fetchUserFiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('id, file_name, file_size_mb, file_type, upload_date, supplier_id')
        .eq('user_id', user.id)
        .order('file_size_mb', { ascending: false });

      if (error) {
        console.error('Erro ao buscar arquivos do usuário:', error);
        return;
      }

      setUserFiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
    }
  };

  const canUploadFile = async (fileSizeInBytes: number): Promise<boolean> => {
    if (!user) return false;

    const fileSizeMB = fileSizeInBytes / (1024 * 1024);

    try {
      const { data, error } = await supabase.rpc('can_user_upload', {
        user_uuid: user.id,
        file_size_mb: fileSizeMB
      });

      if (error) {
        console.error('Erro ao verificar limite de upload:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Erro na verificação de upload:', error);
      return false;
    }
  };

  const recordFileUpload = async (
    fileName: string,
    fileSizeInBytes: number,
    fileType: string,
    supplierId?: string
  ) => {
    if (!user) return;

    const fileSizeMB = fileSizeInBytes / (1024 * 1024);

    try {
      const { error } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size_mb: fileSizeMB,
          file_type: fileType,
          supplier_id: supplierId
        });

      if (error) {
        console.error('Erro ao registrar arquivo:', error);
        toast.error('Erro ao registrar arquivo no sistema');
        return;
      }

      // Atualizar informações localmente
      await fetchStorageInfo();
      await fetchUserFiles();
    } catch (error) {
      console.error('Erro ao registrar upload:', error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('user_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        toast.error('Erro ao deletar arquivo');
        return;
      }

      // Atualizar informações localmente
      await fetchStorageInfo();
      await fetchUserFiles();
      toast.success('Arquivo deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchStorageInfo(), fetchUserFiles()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);

  return {
    storageInfo,
    userFiles,
    isLoading,
    canUploadFile,
    recordFileUpload,
    deleteFile,
    refreshStorage: () => {
      fetchStorageInfo();
      fetchUserFiles();
    }
  };
};
