
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageInfo {
  storage_used_mb: number;
  storage_limit_mb: number;
  storage_percentage: number;
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
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStorageInfo = async () => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_storage')
        .select('storage_used_mb, storage_limit_mb')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Se não existe registro, criar um
        const { data: newRecord, error: insertError } = await supabase
          .from('user_storage')
          .insert({
            user_id: user.id,
            storage_used_mb: 0,
            storage_limit_mb: 100
          })
          .select('storage_used_mb, storage_limit_mb')
          .single();

        if (!insertError && newRecord) {
          const storage = {
            ...newRecord,
            storage_percentage: 0,
            storage_available_mb: newRecord.storage_limit_mb,
            usage_percentage: 0
          };
          setStorageInfo(storage);
        }
      } else if (data) {
        const storage = {
          ...data,
          storage_percentage: (data.storage_used_mb / data.storage_limit_mb) * 100,
          storage_available_mb: data.storage_limit_mb - data.storage_used_mb,
          usage_percentage: (data.storage_used_mb / data.storage_limit_mb) * 100
        };
        setStorageInfo(storage);
      }
    } catch (error) {
      console.error('Erro ao buscar informações de armazenamento:', error);
      setError('Erro ao carregar informações de armazenamento');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const fetchUserFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setUserFiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar arquivos do usuário:', error);
    }
  };

  const canUploadFile = async (fileSizeMB: number): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_storage')
      .select('storage_used_mb, storage_limit_mb')
      .eq('user_id', user.id)
      .single();

    if (!data) return false;

    return (data.storage_used_mb + fileSizeMB) <= data.storage_limit_mb;
  };

  const recordFileUpload = async (
    fileName: string,
    fileSizeMB: number,
    fileType: string,
    supplierId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Registrar arquivo
      await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size_mb: fileSizeMB,
          file_type: fileType,
          supplier_id: supplierId
        });

      // Atualizar storage
      const { data: currentStorage } = await supabase
        .from('user_storage')
        .select('storage_used_mb')
        .eq('user_id', user.id)
        .single();

      if (currentStorage) {
        await supabase
          .from('user_storage')
          .update({
            storage_used_mb: currentStorage.storage_used_mb + fileSizeMB
          })
          .eq('user_id', user.id);
      }

      // Refresh dados
      await Promise.all([fetchStorageInfo(), fetchUserFiles()]);
    } catch (error) {
      console.error('Erro ao registrar upload:', error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar info do arquivo
      const { data: fileData } = await supabase
        .from('user_files')
        .select('file_size_mb')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single();

      if (!fileData) return;

      // Deletar arquivo
      await supabase
        .from('user_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      // Atualizar storage
      const { data: currentStorage } = await supabase
        .from('user_storage')
        .select('storage_used_mb')
        .eq('user_id', user.id)
        .single();

      if (currentStorage) {
        await supabase
          .from('user_storage')
          .update({
            storage_used_mb: Math.max(0, currentStorage.storage_used_mb - fileData.file_size_mb)
          })
          .eq('user_id', user.id);
      }

      // Refresh dados
      await Promise.all([fetchStorageInfo(), fetchUserFiles()]);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  };

  const refreshStorage = async () => {
    setIsLoading(true);
    await Promise.all([fetchStorageInfo(), fetchUserFiles()]);
  };

  useEffect(() => {
    Promise.all([fetchStorageInfo(), fetchUserFiles()]);
  }, []);

  return {
    storageInfo,
    userFiles,
    loading,
    isLoading,
    error,
    refetch: fetchStorageInfo,
    refreshStorage,
    canUploadFile,
    recordFileUpload,
    deleteFile
  };
};
