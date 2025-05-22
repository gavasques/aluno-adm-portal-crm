
import { useState, useEffect } from "react";
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
}

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      
      // Usar método GET para listar usuários
      try {
        console.log("Buscando usuários via Edge Function com método GET");
        const { data, error } = await supabase.functions.invoke('list-users', {
          method: 'GET'
        });
        
        if (error) {
          console.error("Erro ao chamar a função list-users:", error);
          throw error;
        }
        
        // Log para debug - verificar payload completo recebido do backend
        console.log("users payload", data);
        
        if (data && data.users) {
          console.log("Dados recebidos:", data.users.length, "usuários");
          setUsers(data.users);
        } else {
          console.error("Resposta da função sem dados de usuários:", data);
          throw new Error("A resposta do servidor não contém dados de usuários válidos");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        
        // Verificar se já estamos usando os dados mockados para evitar mostrar o alerta novamente
        if (users.length === 0 || users[0].id !== "mock-1") {
          setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
          
          // Dados mockados para usar quando a API falhar
          const mockUsers: User[] = [
            {
              id: "mock-1",
              name: "Administrador",
              email: "admin@exemplo.com",
              role: "Admin",
              status: "Ativo",
              lastLogin: "Nunca",
              tasks: [],
            },
            {
              id: "mock-2",
              name: "Aluno Exemplo",
              email: "aluno@exemplo.com",
              role: "Student",
              status: "Ativo",
              lastLogin: "Nunca",
              tasks: [],
            }
          ];
          
          setUsers(mockUsers);
          
          toast({
            title: "Erro",
            description: "Não foi possível obter a lista de usuários. Exibindo dados de exemplo.",
            variant: "destructive",
          });
        }
      }
      
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Função para atualizar a lista de usuários
  const refreshUsersList = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  // Buscar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    isRefreshing,
    fetchError,
    refreshUsersList
  };
};
