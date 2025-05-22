
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// Definir headers CORS para permitir o acesso a partir do frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Lidar com requisições OPTIONS (pre-flight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Criar cliente Supabase com token service_role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );
    
    // Lidar com requisições POST (criar usuário)
    if (req.method === 'POST') {
      const requestData = await req.json();
      
      if (requestData.action === 'createUser') {
        const { email, name, role } = requestData;
        
        // Gerar uma senha aleatória temporária
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Criar um novo usuário
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            name,
            role,
          }
        });
        
        if (authError) {
          throw authError;
        }
        
        // Criar perfil para o novo usuário
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            name,
            role,
          });
        
        if (profileError) {
          throw profileError;
        }
        
        // Enviar email de redefinição de senha
        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: {
            redirectTo: `${new URL(req.url).origin}/reset-password`,
          }
        });
        
        if (resetError) {
          throw resetError;
        }
        
        return new Response(
          JSON.stringify({ success: true, message: "Usuário criado com sucesso" }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
          },
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Ação não reconhecida" }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 400
        },
      );
    }
    
    // Lidar com requisições GET (listar usuários)
    // Obter usuários através do admin.listUsers
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }

    // Buscar perfis dos usuários
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error("Erro ao buscar perfis:", profilesError);
    }

    // Para cada usuário que não tem perfil, criar um
    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Criar perfis para usuários que não têm
    for (const authUser of authUsers.users) {
      if (!profilesMap.has(authUser.id)) {
        const isAdmin = authUser.email?.includes('gavasques') ? true : false;
        
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
            role: isAdmin ? 'Admin' : 'Student'
          });
        
        if (insertError) {
          console.error(`Erro ao criar perfil para ${authUser.email}:`, insertError);
        } else {
          console.log(`Perfil criado para o usuário ${authUser.email}`);
          
          // Adicionar o novo perfil ao mapa
          profilesMap.set(authUser.id, {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
            role: isAdmin ? 'Admin' : 'Student'
          });
        }
      }
    }

    // Buscar perfis novamente se houveram atualizações
    const latestProfiles = profilesMap.size > 0 ? 
      Array.from(profilesMap.values()) : 
      profiles || [];

    // Mapear usuários combinando dados de auth e profiles
    const mappedUsers = authUsers.users.map(authUser => {
      const profile = latestProfiles.find((p: any) => p.id === authUser.id);
      
      return {
        id: authUser.id,
        name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
        email: authUser.email || '',
        role: profile?.role || 'Student',
        status: authUser.banned ? 'Inativo' : 'Ativo',
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
    mappedUsers.sort((a, b) => a.email.localeCompare(b.email));

    return new Response(
      JSON.stringify({ users: mappedUsers }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      },
    );
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar requisição"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      },
    );
  }
});
