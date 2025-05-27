
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
    console.log("=== INÍCIO DO DEBUG DETALHADO DA EDGE FUNCTION ===");
    console.log(`Recebendo requisição ${req.method} para create-user`);

    if (req.method !== 'POST') {
      console.error("Método não permitido:", req.method);
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

    // Obter o usuário autenticado via JWT context
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Token de autorização ausente ou inválido");
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("Token presente, validando...");

    // Usar o token para obter dados do usuário
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Erro ao validar token:", userError);
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Usuário autenticado:", user.email, "ID:", user.id);

    // Verificar permissões do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, permission_group_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil do usuário:", profileError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar permissões' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Profile do usuário encontrado:", profile);

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

    console.log("✅ Usuário é admin:", isAdmin);

    if (!isAdmin) {
      console.error("❌ Usuário sem permissões administrativas");
      return new Response(
        JSON.stringify({ error: 'Você não tem permissões para criar usuários' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do usuário a ser criado
    let requestBody;
    try {
      requestBody = await req.text();
      console.log("📝 Body da requisição recebido (tamanho):", requestBody.length);
      console.log("📝 Body da requisição:", requestBody);
    } catch (error) {
      console.error("❌ Erro ao ler o body da requisição:", error);
      return new Response(
        JSON.stringify({ error: 'Erro ao ler dados da requisição' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!requestBody || requestBody.trim() === '') {
      console.error("❌ Body da requisição está vazio");
      return new Response(
        JSON.stringify({ error: 'Body da requisição está vazio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let userData;
    try {
      userData = JSON.parse(requestBody);
      console.log("✅ Dados parseados:", { ...userData, password: userData.password ? "***" : "não definida" });
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError);
      return new Response(
        JSON.stringify({ error: 'JSON inválido no corpo da requisição' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, name, role, password, is_mentor } = userData;

    console.log("📋 Dados extraídos:", { email, name, role, is_mentor, hasPassword: !!password });

    // Validações básicas
    if (!email || !name || !role || !password) {
      const missing = [];
      if (!email) missing.push('email');
      if (!name) missing.push('name');
      if (!role) missing.push('role');
      if (!password) missing.push('password');
      
      console.error("❌ Campos obrigatórios faltando:", missing);
      return new Response(
        JSON.stringify({ error: `Campos obrigatórios faltando: ${missing.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      console.error("❌ Senha muito curta:", password.length, "caracteres");
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("🔍 Verificando se o usuário já existe...");

    // Verificar se o usuário já existe - DUAS VERIFICAÇÕES
    // 1. Verificar no auth.users via admin
    const { data: existingAuthUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserByEmail(email.toLowerCase());
    
    if (authCheckError && authCheckError.message !== 'User not found') {
      console.error("❌ Erro ao verificar usuário no auth:", authCheckError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar usuário existente no auth' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verificar no profiles
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileCheckError) {
      console.error("❌ Erro ao verificar perfil existente:", profileCheckError);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar usuário existente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("🔍 Resultado da verificação:");
    console.log("- Usuário no auth:", existingAuthUser?.user ? "EXISTE" : "NÃO EXISTE");
    console.log("- Perfil na tabela:", existingProfile ? "EXISTE" : "NÃO EXISTE");

    // Se existir em qualquer lugar, retornar erro
    if (existingAuthUser?.user || existingProfile) {
      console.log("❌ Usuário já existe no sistema");
      return new Response(
        JSON.stringify({ 
          success: false, 
          existed: true, 
          error: 'Usuário já cadastrado no sistema' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Usuário não existe, prosseguindo com a criação...");

    // Criar o usuário usando Admin API
    console.log("👤 Criando usuário via Admin API...");
    
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
      console.error("❌ Erro ao criar usuário no auth:", createError);
      return new Response(
        JSON.stringify({ error: `Erro no auth: ${createError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!authUser.user) {
      console.error("❌ Usuário não foi retornado após criação");
      return new Response(
        JSON.stringify({ error: 'Falha ao criar usuário - dados não retornados' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Usuário criado no auth:", authUser.user.id);

    // Criar o profile do usuário
    console.log("👤 Criando perfil do usuário...");
    
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
      console.error("❌ Erro ao criar profile:", profileInsertError);
      
      // Se o profile não foi criado, limpar o usuário do auth
      console.log("🧹 Limpando usuário do auth devido a erro no profile...");
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return new Response(
        JSON.stringify({ error: `Erro ao criar perfil: ${profileInsertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Profile criado com sucesso");
    console.log("=== USUÁRIO CRIADO COM SUCESSO ===");
    
    return new Response(
      JSON.stringify({ success: true, existed: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("=== ERRO GERAL NA EDGE FUNCTION ===");
    console.error("Erro:", error);
    console.error("Tipo:", typeof error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== FIM DO ERRO ===");
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        details: error.stack ? error.stack.substring(0, 500) : 'Sem stack trace'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
