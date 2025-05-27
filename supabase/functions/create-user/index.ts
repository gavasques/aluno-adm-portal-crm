
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

console.log("Edge Function create-user inicializada");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Processando requisição OPTIONS");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`Recebendo requisição ${req.method} para create-user`);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase com service_role para admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Criar cliente normal para verificar o usuário atual
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { authorization: authHeader }
        }
      }
    );

    // Verificar se o usuário está autenticado e é admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Erro de autenticação:", authError);
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Verificando permissões do usuário:", user.id);

    // Verificar se o usuário é admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        permission_groups!inner(
          is_admin,
          allow_admin_access
        )
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao verificar perfil:", profileError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar permissões do usuário' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdmin = profile?.role === 'Admin' || 
                   profile?.permission_groups?.is_admin === true ||
                   profile?.permission_groups?.allow_admin_access === true;

    if (!isAdmin) {
      console.error("Usuário sem permissões administrativas");
      return new Response(
        JSON.stringify({ error: 'Você não tem permissões para criar usuários' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do usuário a ser criado
    const { email, name, role, password, is_mentor } = await req.json();

    console.log("Dados recebidos:", { email, name, role, is_mentor });

    // Validações básicas
    if (!email || !name || !role || !password) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos obrigatórios devem ser preenchidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o usuário já existe
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar usuário existente:", checkError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar usuário existente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingProfile) {
      console.log("Usuário já existe:", existingProfile);
      return new Response(
        JSON.stringify({ 
          success: false, 
          existed: true, 
          error: 'Usuário já cadastrado' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar o usuário usando Admin API
    console.log("Criando usuário via Admin API");
    
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name,
        role: role,
        is_mentor: is_mentor || false
      }
    });

    if (createError) {
      console.error("Erro ao criar usuário:", createError);
      
      if (createError.message.includes('already registered') || createError.message.includes('User already registered')) {
        // Usuário já existe no auth, mas não no profiles
        console.log("Usuário existe no auth, buscando para criar profile");
        
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          console.error("Erro ao listar usuários:", listError);
          return new Response(
            JSON.stringify({ error: 'Erro ao verificar usuários existentes' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const existingUser = usersData.users.find((u: any) => u.email === email.toLowerCase());
        
        if (existingUser) {
          // Criar apenas o profile
          const { error: profileCreateError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: existingUser.id,
              email: email.toLowerCase(),
              name: name,
              role: role,
              is_mentor: is_mentor || false,
              status: 'Ativo'
            });

          if (profileCreateError) {
            console.error("Erro ao criar profile:", profileCreateError);
            return new Response(
              JSON.stringify({ error: 'Erro ao criar perfil do usuário' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              existed: true, 
              profileCreated: true 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!authUser.user) {
      return new Response(
        JSON.stringify({ error: 'Falha ao criar usuário - dados não retornados' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Usuário criado no auth:", authUser.user.id);

    // Criar o profile do usuário
    const { error: profileInsertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: email.toLowerCase(),
        name: name,
        role: role,
        is_mentor: is_mentor || false,
        status: 'Ativo'
      });

    if (profileInsertError) {
      console.error("Erro ao criar profile:", profileInsertError);
      
      // Se o profile não foi criado, limpar o usuário do auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return new Response(
        JSON.stringify({ error: 'Erro ao criar perfil do usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Profile criado com sucesso");
    
    return new Response(
      JSON.stringify({ success: true, existed: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Erro na edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
