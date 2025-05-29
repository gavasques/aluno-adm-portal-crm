
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export async function deleteUserOperation(
  supabaseAdmin: SupabaseClient,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string; message?: string; inactivated?: boolean }> {
  console.log(`🗑️ [DELETE] Iniciando exclusão do usuário: ${userEmail} (ID: ${userId})`);
  console.log(`🗑️ [DELETE] Timestamp: ${new Date().toISOString()}`);
  
  try {
    if (!userId || !userEmail) {
      console.error('❌ [DELETE] Parâmetros obrigatórios faltando:', { userId, userEmail });
      return { success: false, error: 'ID do usuário e email são obrigatórios' };
    }

    // ETAPA 1: Verificar se o usuário existe no auth
    console.log('🔍 [DELETE] ETAPA 1: Verificando se usuário existe no auth...');
    const { data: authUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authCheckError) {
      console.error('❌ [DELETE] ETAPA 1 FALHOU: Erro ao verificar usuário no auth:', authCheckError);
      return { success: false, error: `Erro ao verificar usuário: ${authCheckError.message}` };
    }

    console.log(`✅ [DELETE] ETAPA 1 SUCESSO: Usuário encontrado no auth:`, {
      exists: !!authUser.user,
      id: authUser.user?.id,
      email: authUser.user?.email
    });

    if (!authUser.user) {
      console.log('⚠️ [DELETE] Usuário não encontrado no auth, removendo apenas do perfil...');
      
      // ETAPA 1.1: Remover apenas do perfil se não existe no auth
      console.log('🔄 [DELETE] ETAPA 1.1: Removendo perfil...');
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('❌ [DELETE] ETAPA 1.1 FALHOU: Erro ao remover perfil:', profileError);
        return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
      }

      console.log('✅ [DELETE] ETAPA 1.1 SUCESSO: Perfil removido');
      return { 
        success: true, 
        message: 'Usuário removido com sucesso (perfil apenas)' 
      };
    }

    // ETAPA 2: Verificar se o usuário tem dados associados
    console.log('🔍 [DELETE] ETAPA 2: Verificando dados associados...');
    
    const checks = await Promise.all([
      supabaseAdmin.from('my_suppliers').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('user_files').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('mentoring_enrollments').select('id').eq('student_id', userId).limit(1),
      supabaseAdmin.from('my_supplier_comments').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('my_supplier_ratings').select('id').eq('user_id', userId).limit(1)
    ]);

    // Log detalhado dos resultados das verificações
    console.log('📊 [DELETE] ETAPA 2 RESULTADOS:', {
      my_suppliers: checks[0].data?.length || 0,
      user_files: checks[1].data?.length || 0,
      mentoring_enrollments: checks[2].data?.length || 0,
      my_supplier_comments: checks[3].data?.length || 0,
      my_supplier_ratings: checks[4].data?.length || 0
    });

    const hasAssociatedData = checks.some(check => 
      check.data && check.data.length > 0
    );

    console.log(`✅ [DELETE] ETAPA 2 SUCESSO: hasAssociatedData = ${hasAssociatedData}`);

    if (hasAssociatedData) {
      console.log('⚠️ [DELETE] ETAPA 3: Usuário possui dados associados, inativando ao invés de excluir...');
      
      // ETAPA 3: Inativar o usuário ao invés de excluir
      console.log('🔄 [DELETE] ETAPA 3: Inativando usuário...');
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          status: 'Inativo',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [DELETE] ETAPA 3 FALHOU: Erro ao inativar usuário:', updateError);
        return { success: false, error: `Erro ao inativar usuário: ${updateError.message}` };
      }

      console.log('✅ [DELETE] ETAPA 3 SUCESSO: Usuário inativado');
      return { 
        success: true, 
        inactivated: true,
        message: 'Usuário inativado porque possui dados associados' 
      };
    }

    console.log('🗑️ [DELETE] ETAPA 4: Usuário sem dados associados, prosseguindo com exclusão...');
    
    // ETAPA 4: Remover o perfil primeiro
    console.log('🔄 [DELETE] ETAPA 4.1: Removendo perfil...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('❌ [DELETE] ETAPA 4.1 FALHOU: Erro ao remover perfil:', profileError);
      return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
    }

    console.log('✅ [DELETE] ETAPA 4.1 SUCESSO: Perfil removido do banco');

    // ETAPA 5: Remover do auth
    console.log('🔄 [DELETE] ETAPA 4.2: Removendo do auth...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('❌ [DELETE] ETAPA 4.2 FALHOU: Erro ao remover usuário do auth:', authError);
      return { success: false, error: `Erro ao remover do auth: ${authError.message}` };
    }

    console.log('✅ [DELETE] ETAPA 4.2 SUCESSO: Usuário removido do auth');
    
    // ETAPA 6: Verificação final
    console.log('🔍 [DELETE] ETAPA 5: Verificação final...');
    try {
      const { data: verificationCheck } = await supabaseAdmin.auth.admin.getUserById(userId);
      console.log('📊 [DELETE] ETAPA 5 RESULTADO:', {
        stillExistsInAuth: !!verificationCheck.user,
        deletionSuccessful: !verificationCheck.user
      });
    } catch (verificationError) {
      console.log('✅ [DELETE] ETAPA 5: Usuário não encontrado no auth (confirmando exclusão)');
    }

    console.log('✅ [DELETE] PROCESSO COMPLETO: Usuário excluído com sucesso');
    return { 
      success: true, 
      message: 'Usuário excluído com sucesso' 
    };

  } catch (error: any) {
    console.error('❌ [DELETE] ERRO INESPERADO:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return { 
      success: false, 
      error: `Erro inesperado: ${error.message}` 
    };
  }
}
