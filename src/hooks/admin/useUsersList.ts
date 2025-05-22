
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

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      
      // Tentar obter usuários do Supabase Auth diretamente se a edge function falhar
      try {
        // Chamar a edge function list-users com GET (sem body)
        const { data, error } = await supabase.functions.invoke('list-users', {
          method: 'GET'
        });
        
        if (error) {
          console.error("Erro ao chamar a função list-users:", error);
          throw error;
        }
        
        if (data && data.users) {
          console.log("Dados recebidos:", data.users.length, "usuários");
          setUsers(data.users);
        } else {
          console.error("Resposta da função sem dados de usuários:", data);
          throw new Error("A resposta do servidor não contém dados de usuários válidos");
        }
      } catch (edgeFunctionError) {
        console.error("Erro ao chamar edge function:", edgeFunctionError);
        
        // Obter usuários diretamente da API de autenticação
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.error("Erro ao listar usuários via API direta:", authError);
            throw authError;
          }
          
          if (authData && authData.users) {
            // Mapear usuários para o formato esperado
            const formattedUsers = authData.users.map(user => ({
              id: user.id,
              name: user.user_metadata?.name || "Usuário sem nome",
              email: user.email || "",
              role: user.user_metadata?.role || "Student",
              status: user.banned ? "Inativo" : (user.user_metadata?.status === "Convidado" ? "Convidado" : "Ativo"),
              lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
              tasks: []
            }));
            
            setUsers(formattedUsers);
          } else {
            // Se ambas as abordagens falharem, usar dados mockados
            setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
            setUsers(mockUsers);
          }
        } catch (authError) {
          console.error("Erro ao obter usuários via API direta:", authError);
          setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
          setUsers(mockUsers);
        }
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setFetchError("Não foi possível obter dados de usuários. Exibindo dados de exemplo.");
      setUsers(mockUsers);
      toast({
        title: "Erro",
        description: "Não foi possível obter a lista de usuários. Exibindo dados de exemplo.",
        variant: "destructive",
      });
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
