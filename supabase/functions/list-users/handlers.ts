
export async function handleGetRequest(supabaseAdmin: any) {
  try {
    console.log("📋 [HANDLER] Iniciando busca de usuários...");
    
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        email,
        name,
        role,
        status,
        is_mentor,
        is_onboarding,
        is_closer,
        created_at,
        updated_at,
        storage_limit_mb,
        storage_used_mb,
        permission_group:permission_groups(id, name, is_admin)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ [HANDLER] Erro ao buscar usuários:", error);
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }

    console.log(`✅ [HANDLER] ${users?.length || 0} usuários encontrados`);
    return { users: users || [] };
    
  } catch (error: any) {
    console.error("💥 [HANDLER] Erro crítico no GET:", error);
    throw error;
  }
}

export async function handlePostRequest(req: Request, supabaseAdmin: any) {
  try {
    console.log("📝 [HANDLER] Processando POST request...");
    
    const body = await req.json();
    console.log("📄 [HANDLER] Body recebido:", body);
    
    if (body.action === 'delete' && body.userId) {
      console.log(`🗑️ [HANDLER] Deletando usuário: ${body.userId}`);
      
      const { error } = await supabaseAdmin.auth.admin.deleteUser(body.userId);
      
      if (error) {
        console.error("❌ [HANDLER] Erro ao deletar usuário:", error);
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
      }
      
      console.log("✅ [HANDLER] Usuário deletado com sucesso");
      return { 
        success: true, 
        message: "Usuário deletado com sucesso" 
      };
    }
    
    console.error("❌ [HANDLER] Ação não reconhecida no POST:", body);
    throw new Error("Ação não reconhecida");
    
  } catch (error: any) {
    console.error("💥 [HANDLER] Erro crítico no POST:", error);
    throw error;
  }
}
