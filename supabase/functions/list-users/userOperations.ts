
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export async function deleteUserOperation(
  supabaseAdmin: SupabaseClient,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string; message?: string; inactivated?: boolean }> {
  console.log(`🗑️ Iniciando exclusão do usuário: ${userEmail} (ID: ${userId})`);
  
  try {
    if (!userId || !userEmail) {
      console.error('❌ Parâmetros obrigatórios faltando');
      return { success: false, error: 'ID do usuário e email são obrigatórios' };
    }

    // Verificar se o usuário existe no auth
    console.log('🔍 Verificando se usuário existe no auth...');
    const { data: authUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authCheckError) {
      console.error('❌ Erro ao verificar usuário no auth:', authCheckError);
      return { success: false, error: `Erro ao verificar usuário: ${authCheckError.message}` };
    }

    if (!authUser.user) {
      console.log('⚠️ Usuário não encontrado no auth, removendo apenas do perfil...');
      // Se não existe no auth, remove apenas do perfil
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('❌ Erro ao remover perfil:', profileError);
        return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
      }

      console.log('✅ Perfil removido com sucesso');
      return { 
        success: true, 
        message: 'Usuário removido com sucesso (perfil apenas)' 
      };
    }

    // Verificar se o usuário tem dados associados
    console.log('🔍 Verificando dados associados...');
    
    const checks = await Promise.all([
      supabaseAdmin.from('my_suppliers').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('user_files').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('mentoring_enrollments').select('id').eq('student_id', userId).limit(1),
      supabaseAdmin.from('my_supplier_comments').select('id').eq('user_id', userId).limit(1),
      supabaseAdmin.from('my_supplier_ratings').select('id').eq('user_id', userId).limit(1)
    ]);

    const hasAssociatedData = checks.some(check => 
      check.data && check.data.length > 0
    );

    if (hasAssociatedData) {
      console.log('⚠️ Usuário possui dados associados, inativando ao invés de excluir...');
      
      // Inativar o usuário ao invés de excluir
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          status: 'Inativo',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Erro ao inativar usuário:', updateError);
        return { success: false, error: `Erro ao inativar usuário: ${updateError.message}` };
      }

      console.log('✅ Usuário inativado com sucesso');
      return { 
        success: true, 
        inactivated: true,
        message: 'Usuário inativado porque possui dados associados' 
      };
    }

    console.log('🗑️ User has no associated data, proceeding with deletion');
    
    // Primeiro, remover o perfil
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('❌ Erro ao remover perfil:', profileError);
      return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
    }

    console.log('✅ Perfil removido do banco');

    // Depois, remover do auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('❌ Erro ao remover usuário do auth:', authError);
      return { success: false, error: `Erro ao remover do auth: ${authError.message}` };
    }

    console.log('✅ User deleted successfully');
    return { 
      success: true, 
      message: 'Usuário excluído com sucesso' 
    };

  } catch (error: any) {
    console.error('❌ Erro inesperado durante exclusão:', error);
    return { 
      success: false, 
      error: `Erro inesperado: ${error.message}` 
    };
  }
}
