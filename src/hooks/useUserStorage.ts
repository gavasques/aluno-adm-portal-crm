
import { useState, useEffect, useRef } from "react";
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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useUserStorage = () => {
  const { user } = useAuth();
  const [storageInfo, setStorageInfo] = useState<UserStorageInfo | null>(null);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const isUnmountedRef = useRef(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchStorageInfo = async (retryCount = 0): Promise<boolean> => {
    if (!user || isUnmountedRef.current) return false;

    try {
      console.log('Fetching storage info for user:', user.id, 'retry:', retryCount);
      
      // Tentar buscar dados existentes primeiro
      const { data: existingData, error: fetchError } = await supabase
        .from('user_storage')
        .select('storage_used_mb, storage_limit_mb')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching storage info:', fetchError);
        throw fetchError;
      }

      let storageData;
      if (existingData) {
        storageData = existingData;
        console.log('Found existing storage data:', storageData);
      } else {
        // Criar registro inicial se não existir
        console.log('Creating initial storage record for user');
        const { data: newData, error: insertError } = await supabase
          .from('user_storage')
          .insert({
            user_id: user.id,
            storage_used_mb: 0,
            storage_limit_mb: 100
          })
          .select('storage_used_mb, storage_limit_mb')
          .single();

        if (insertError) {
          console.error('Error creating storage record:', insertError);
          throw insertError;
        }

        storageData = newData;
        console.log('Created new storage record:', storageData);
      }

      if (isUnmountedRef.current) return false;

      const storage_available_mb = storageData.storage_limit_mb - storageData.storage_used_mb;
      const usage_percentage = (storageData.storage_used_mb / storageData.storage_limit_mb) * 100;

      setStorageInfo({
        storage_used_mb: storageData.storage_used_mb,
        storage_limit_mb: storageData.storage_limit_mb,
        storage_available_mb,
        usage_percentage
      });

      setError(null);
      return true;
    } catch (error: any) {
      console.error('Error in fetchStorageInfo:', error);
      
      if (retryCount < MAX_RETRIES && !isUnmountedRef.current) {
        console.log(`Retrying storage fetch in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return fetchStorageInfo(retryCount + 1);
      }
      
      if (!isUnmountedRef.current) {
        setError('Erro ao carregar informações de armazenamento');
        // Usar valores padrão em caso de erro
        setStorageInfo({
          storage_used_mb: 0,
          storage_limit_mb: 100,
          storage_available_mb: 100,
          usage_percentage: 0
        });
      }
      return false;
    }
  };

  const fetchUserFiles = async (retryCount = 0): Promise<boolean> => {
    if (!user || isUnmountedRef.current) return false;

    try {
      console.log('Fetching user files for user:', user.id, 'retry:', retryCount);
      
      const { data, error } = await supabase
        .from('user_files')
        .select('id, file_name, file_size_mb, file_type, upload_date, supplier_id')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching user files:', error);
        throw error;
      }

      if (isUnmountedRef.current) return false;

      setUserFiles(data || []);
      console.log('Fetched files:', data?.length || 0);
      return true;
    } catch (error: any) {
      console.error('Error in fetchUserFiles:', error);
      
      if (retryCount < MAX_RETRIES && !isUnmountedRef.current) {
        console.log(`Retrying files fetch in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return fetchUserFiles(retryCount + 1);
      }
      
      if (!isUnmountedRef.current) {
        setUserFiles([]);
      }
      return false;
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

      // Atualizar informações localmente sem loop
      await Promise.all([
        fetchStorageInfo(),
        fetchUserFiles()
      ]);
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
      await Promise.all([
        fetchStorageInfo(),
        fetchUserFiles()
      ]);
      toast.success('Arquivo deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  };

  const refreshStorage = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    retryCountRef.current = 0;
    
    try {
      await Promise.all([
        fetchStorageInfo(),
        fetchUserFiles()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    
    if (user) {
      console.log('useUserStorage: User changed, starting data fetch');
      setIsLoading(true);
      setError(null);
      retryCountRef.current = 0;
      
      Promise.all([
        fetchStorageInfo(),
        fetchUserFiles()
      ]).finally(() => {
        if (!isUnmountedRef.current) {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
      setStorageInfo(null);
      setUserFiles([]);
      setError(null);
    }

    return () => {
      isUnmountedRef.current = true;
    };
  }, [user?.id]); // Depender apenas do ID do usuário

  return {
    storageInfo,
    userFiles,
    isLoading,
    error,
    canUploadFile,
    recordFileUpload,
    deleteFile,
    refreshStorage
  };
};
