
// Utilitários e configurações compartilhadas

// Definir headers CORS para permitir o acesso a partir do frontend
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Função para criar o cliente do Supabase com role de administrador
export function createSupabaseAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
      }
    }
  );
}

// Função para lidar com as requisições OPTIONS (CORS)
export function handleOptionsRequest() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

// Função para mapear usuários combinando dados de auth e profiles
export function mapUsers(authUsers: any, latestProfiles: any[]) {
  // Mapear usuários combinando dados de auth e profiles
  const mappedUsers = authUsers.users.map((authUser: any) => {
    const profile = latestProfiles.find((p) => p.id === authUser.id);
    
    // Determinar o papel com base no email ou nos metadados
    const isAdmin = authUser.email && (
      authUser.email.includes('gavasques') || 
      authUser.user_metadata?.role === 'Admin'
    );
    
    // Importante: usar diretamente o valor banned do objeto authUser
    const isActive = !authUser.banned;
    
    return {
      id: authUser.id,
      name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
      email: authUser.email || '',
      role: profile?.role || (isAdmin ? 'Admin' : 'Student'),
      status: isActive ? 'Ativo' : 'Inativo',
      lastLogin: authUser.last_sign_in_at 
        ? new Date(authUser.last_sign_in_at).toLocaleDateString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) 
        : 'Nunca',
      tasks: []
    };
  });

  // Ordenar usuários por email
  mappedUsers.sort((a: any, b: any) => a.email.localeCompare(b.email));
  
  return mappedUsers;
}

// Importar dependências necessárias
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
