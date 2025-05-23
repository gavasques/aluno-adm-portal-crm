
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
        console.log("Buscando usuários via Edge Function com método GET direto");
        
        // Adicionar timestamp para evitar cache
        const timestamp = new Date().getTime();
        
        // Obter o token de acesso do usuário autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        
        // Usar fetch diretamente em vez de invoke
        const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM',
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
          }
        });
        
        // Verificar se a resposta é OK
        if (!response.ok) {
          console.error("Erro na resposta HTTP:", response.status, response.statusText);
          const errorText = await response.text();
          console.error("Erro detalhado:", errorText);
          throw new Error(`Erro na requisição HTTP: ${response.status} ${response.statusText}`);
        }
        
        // Parsear o JSON da resposta
        const data = await response.json();
        console.log("Dados processados da função list-users:", data);
        
        if (data && Array.isArray(data.users)) {
          console.log(`Dados recebidos: ${data.users.length} usuários`);
          
          // Log dos primeiros usuários para debug
          if (data.users.length > 0) {
            console.log("Amostra dos dados de usuários:", data.users.slice(0, 2));
          }
          
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
