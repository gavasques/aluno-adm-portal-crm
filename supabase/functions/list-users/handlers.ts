
import { CORS_CONFIG, CORS_LOGGER } from "./cors-config.ts";

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
        is_banned,
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
      CORS_LOGGER.logError(error, "busca de usuários");
      return CORS_CONFIG.createErrorResponse(`Erro ao buscar usuários: ${error.message}`, 400);
    }

    console.log(`✅ [HANDLER] ${users?.length || 0} usuários encontrados`);
    return CORS_CONFIG.createSuccessResponse({ users: users || [] });
    
  } catch (error: any) {
    console.error("💥 [HANDLER] Erro crítico no GET:", error);
    CORS_LOGGER.logError(error, "GET handler");
    return CORS_CONFIG.createErrorResponse(`Erro interno: ${error.message}`, 500);
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
        CORS_LOGGER.logError(error, "deleção de usuário");
        return CORS_CONFIG.createErrorResponse(`Erro ao deletar usuário: ${error.message}`, 400);
      }
      
      console.log("✅ [HANDLER] Usuário deletado com sucesso");
      return CORS_CONFIG.createSuccessResponse({ 
        success: true, 
        message: "Usuário deletado com sucesso" 
      });
    }
    
    console.error("❌ [HANDLER] Ação não reconhecida no POST:", body);
    return CORS_CONFIG.createErrorResponse("Ação não reconhecida", 400);
    
  } catch (error: any) {
    console.error("💥 [HANDLER] Erro crítico no POST:", error);
    CORS_LOGGER.logError(error, "POST handler");
    return CORS_CONFIG.createErrorResponse(`Erro interno: ${error.message}`, 500);
  }
}
