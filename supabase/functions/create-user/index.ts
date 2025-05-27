
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

    console.log("Cliente Supabase Admin criado");

    // Obter o usuário autenticado via JWT context (automaticamente validado pelo verify_jwt = true)
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Token de autorização ausente");
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("Token presente, decodificando...");

    // Usar o token para obter dados do usuário através do admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Erro ao obter usuário:", userError);
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Usuário autenticado:", user.email, "ID:", user.id);

    // Verificar permissões do usuário usando consulta direta
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permission_group_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar permissões' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Profile encontrado:", profile);

    // Verificar se é admin
    let isAdmin = profile?.role === 'Admin';

    // Se não é admin direto, verificar pelo grupo de permissão
    if (!isAdmin && profile?.permission_group_id) {
      const { data: permissionGroup, error: groupError } = await supabaseAdmin
        .from('permission_groups')
        .select('is_admin, allow_admin_access')
        .eq('id', profile.permission_group_id)
        .single();

      if (!groupError && permissionGroup) {
        isAdmin = permissionGroup.is_admin === true || permissionGroup.allow_admin_access === true;
        console.log("Verificação de grupo:", permissionGroup);
      }
    }

    console.log("É admin:", isAdmin);

    if (!isAdmin) {
      console.error("Usuário sem permissões administrativas");
      return new Response(
        JSON.stringify({ error: 'Você não tem permissões para criar usuários' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do usuário a ser criado
    const requestBody = await req.text();
    console.log("Body da requisição:", requestBody);
    
    let userData;
    try {
      userData = JSON.parse(requestBody);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      return new Response(
        JSON.stringify({ error: 'Dados inválidos no corpo da requisição' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, name, role, password, is_mentor } = userData;

    console.log("Dados recebidos:", { email, name, role, is_mentor, hasPassword: !!password });

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
      console.log("Usuário já existe:", existingProfile.email);
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
