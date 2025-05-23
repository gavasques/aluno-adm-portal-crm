
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
  permission_group_id?: string | null;
}

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setFetchError(null);
      
      try {
        console.log("Buscando usuários via Edge Function com método GET");
        
        // Adicionar timestamp para evitar cache e logs detalhados
        const timestamp = new Date().getTime();
        console.log(`Realizando chamada à edge function: ${timestamp}`);
        
        const response = await supabase.functions.invoke('list-users', {
          method: 'GET',
          headers: { 
            'Cache-Control': 'no-cache', 
            'X-Timestamp': timestamp.toString(),
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Resposta completa da Edge Function:", response);
        
        // Verificar erros na resposta
        if (response.error) {
          console.error("Erro na resposta da Edge Function:", response.error);
          throw new Error(`Erro na Edge Function: ${response.error.message || JSON.stringify(response.error)}`);
        }

        const data = response.data;
        
        // Log para debug - verificar payload completo recebido do backend
        console.log("Dados processados da função list-users:", data);
        
        if (!data) {
          throw new Error("Resposta da Edge Function sem dados");
        }
        
        if (data && Array.isArray(data.users)) {
          console.log(`Dados recebidos: ${data.users.length} usuários`);
          setUsers(data.users);
          
          // Limpar erro caso existente
          if (fetchError) {
            setFetchError(null);
          }
        } else {
          console.error("Resposta da função sem dados de usuários válidos:", data);
          throw new Error("A resposta do servidor não contém dados de usuários válidos");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        
        // Erro detalhado para diagnóstico
        const errorMessage = error instanceof Error 
          ? `Erro: ${error.message}` 
          : "Erro desconhecido ao buscar usuários";
          
        setFetchError(errorMessage);
        
        toast({
          title: "Erro ao carregar usuários",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Se não conseguirmos obter os usuários, definimos uma lista vazia
        setUsers([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error("Erro não tratado ao buscar usuários:", error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchError]);

  // Função para atualizar a lista de usuários
  const refreshUsersList = useCallback(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  // Buscar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isRefreshing,
    fetchError,
    refreshUsersList
  };
};
