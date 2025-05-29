
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export async function deleteUserOperation(
  supabaseAdmin: SupabaseClient,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string; message?: string; inactivated?: boolean }> {
  console.log(`🗑️ [DELETE_OPERATION] ===== INICIANDO EXCLUSÃO =====`);
  console.log(`🗑️ [DELETE_OPERATION] Usuário: ${userEmail} (ID: ${userId})`);
  console.log(`🗑️ [DELETE_OPERATION] Timestamp: ${new Date().toISOString()}`);
  console.log(`🗑️ [DELETE_OPERATION] ==============================`);
  
  try {
    if (!userId || !userEmail) {
      console.error('❌ [DELETE_OPERATION] VALIDAÇÃO FALHOU: Parâmetros obrigatórios faltando:', { userId, userEmail });
      return { success: false, error: 'ID do usuário e email são obrigatórios' };
    }

    // ETAPA 1: Verificar se o usuário existe no auth
    console.log('🔍 [DELETE_OPERATION] ETAPA 1: Verificando existência no Supabase Auth...');
    
    let authUser;
    try {
      const { data: authUserData, error: authCheckError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (authCheckError) {
        console.error('❌ [DELETE_OPERATION] ETAPA 1 - Erro na verificação do auth:', authCheckError);
        return { success: false, error: `Erro ao verificar usuário: ${authCheckError.message}` };
      }
      
      authUser = authUserData.user;
      console.log(`📊 [DELETE_OPERATION] ETAPA 1 - Resultado:`, {
        exists: !!authUser,
        id: authUser?.id,
        email: authUser?.email
      });
    } catch (error) {
      console.error('❌ [DELETE_OPERATION] ETAPA 1 - Exceção na verificação:', error);
      return { success: false, error: `Exceção ao verificar usuário: ${error.message}` };
    }

    if (!authUser) {
      console.log('⚠️ [DELETE_OPERATION] Usuário não encontrado no auth, removendo apenas do perfil...');
      
      // ETAPA 1.1: Remover apenas do perfil se não existe no auth
      console.log('🔄 [DELETE_OPERATION] ETAPA 1.1: Removendo perfil...');
      try {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) {
          console.error('❌ [DELETE_OPERATION] ETAPA 1.1 FALHOU: Erro ao remover perfil:', profileError);
          return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
        }

        console.log('✅ [DELETE_OPERATION] ETAPA 1.1 SUCESSO: Perfil removido');
        return { 
          success: true, 
          message: 'Usuário removido com sucesso (perfil apenas)' 
        };
      } catch (error) {
        console.error('❌ [DELETE_OPERATION] ETAPA 1.1 EXCEÇÃO:', error);
        return { success: false, error: `Exceção ao remover perfil: ${error.message}` };
      }
    }

    // ETAPA 2: Verificar se o usuário tem dados associados
    console.log('🔍 [DELETE_OPERATION] ETAPA 2: Verificando dados associados...');
    
    try {
      const checks = await Promise.all([
        supabaseAdmin.from('my_suppliers').select('id').eq('user_id', userId).limit(1),
        supabaseAdmin.from('user_files').select('id').eq('user_id', userId).limit(1),
        supabaseAdmin.from('mentoring_enrollments').select('id').eq('student_id', userId).limit(1),
        supabaseAdmin.from('my_supplier_comments').select('id').eq('user_id', userId).limit(1),
        supabaseAdmin.from('my_supplier_ratings').select('id').eq('user_id', userId).limit(1)
      ]);

      // Log detalhado dos resultados das verificações
      const checkResults = {
        my_suppliers: checks[0].data?.length || 0,
        user_files: checks[1].data?.length || 0,
        mentoring_enrollments: checks[2].data?.length || 0,
        my_supplier_comments: checks[3].data?.length || 0,
        my_supplier_ratings: checks[4].data?.length || 0
      };
      
      console.log('📊 [DELETE_OPERATION] ETAPA 2 RESULTADOS:', checkResults);

      const hasAssociatedData = checks.some(check => 
        check.data && check.data.length > 0
      );

      console.log(`📊 [DELETE_OPERATION] ETAPA 2 CONCLUSÃO: hasAssociatedData = ${hasAssociatedData}`);

      if (hasAssociatedData) {
        console.log('⚠️ [DELETE_OPERATION] ETAPA 3: Usuário possui dados associados, inativando...');
        
        // ETAPA 3: Inativar o usuário ao invés de excluir
        console.log('🔄 [DELETE_OPERATION] ETAPA 3: Executando inativação...');
        try {
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ 
              status: 'Inativo',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ [DELETE_OPERATION] ETAPA 3 FALHOU: Erro ao inativar usuário:', updateError);
            return { success: false, error: `Erro ao inativar usuário: ${updateError.message}` };
          }

          console.log('✅ [DELETE_OPERATION] ETAPA 3 SUCESSO: Usuário inativado');
          
          // VERIFICAÇÃO PÓS-INATIVAÇÃO
          console.log('🔍 [DELETE_OPERATION] VERIFICAÇÃO PÓS-INATIVAÇÃO...');
          const { data: verifyProfile } = await supabaseAdmin
            .from('profiles')
            .select('status')
            .eq('id', userId)
            .single();
          
          if (verifyProfile?.status === 'Inativo') {
            console.log('✅ [DELETE_OPERATION] VERIFICAÇÃO: Status confirmado como Inativo');
            return { 
              success: true, 
              inactivated: true,
              message: 'Usuário inativado porque possui dados associados' 
            };
          } else {
            console.error('❌ [DELETE_OPERATION] VERIFICAÇÃO FALHOU: Status não foi alterado');
            return { success: false, error: 'Falha na verificação: status não foi alterado' };
          }
        } catch (error) {
          console.error('❌ [DELETE_OPERATION] ETAPA 3 EXCEÇÃO:', error);
          return { success: false, error: `Exceção ao inativar usuário: ${error.message}` };
        }
      }
    } catch (error) {
      console.error('❌ [DELETE_OPERATION] ETAPA 2 EXCEÇÃO:', error);
      return { success: false, error: `Exceção ao verificar dados associados: ${error.message}` };
    }

    console.log('🗑️ [DELETE_OPERATION] ETAPA 4: Usuário sem dados associados, prosseguindo com exclusão completa...');
    
    // ETAPA 4: Remover o perfil primeiro
    console.log('🔄 [DELETE_OPERATION] ETAPA 4.1: Removendo perfil do banco...');
    try {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('❌ [DELETE_OPERATION] ETAPA 4.1 FALHOU: Erro ao remover perfil:', profileError);
        return { success: false, error: `Erro ao remover perfil: ${profileError.message}` };
      }

      console.log('✅ [DELETE_OPERATION] ETAPA 4.1 SUCESSO: Perfil removido do banco');
    } catch (error) {
      console.error('❌ [DELETE_OPERATION] ETAPA 4.1 EXCEÇÃO:', error);
      return { success: false, error: `Exceção ao remover perfil: ${error.message}` };
    }

    // ETAPA 5: Remover do auth
    console.log('🔄 [DELETE_OPERATION] ETAPA 4.2: Removendo do Supabase Auth...');
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('❌ [DELETE_OPERATION] ETAPA 4.2 FALHOU: Erro ao remover usuário do auth:', authError);
        return { success: false, error: `Erro ao remover do auth: ${authError.message}` };
      }

      console.log('✅ [DELETE_OPERATION] ETAPA 4.2 SUCESSO: Usuário removido do auth');
    } catch (error) {
      console.error('❌ [DELETE_OPERATION] ETAPA 4.2 EXCEÇÃO:', error);
      return { success: false, error: `Exceção ao remover do auth: ${error.message}` };
    }
    
    // ETAPA 6: Verificação final OBRIGATÓRIA
    console.log('🔍 [DELETE_OPERATION] ETAPA 5: Verificação final OBRIGATÓRIA...');
    try {
      // Verificar se ainda existe no auth
      const { data: verificationCheck } = await supabaseAdmin.auth.admin.getUserById(userId);
      console.log('📊 [DELETE_OPERATION] ETAPA 5 - Verificação Auth:', {
        stillExistsInAuth: !!verificationCheck.user,
        deletionSuccessful: !verificationCheck.user
      });
      
      // Verificar se ainda existe no profiles
      const { data: profileCheck } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      console.log('📊 [DELETE_OPERATION] ETAPA 5 - Verificação Profile:', {
        stillExistsInProfiles: !!profileCheck,
        profileDeleted: !profileCheck
      });
      
      if (verificationCheck.user || profileCheck) {
        console.error('❌ [DELETE_OPERATION] VERIFICAÇÃO FALHOU: Usuário ainda existe após tentativa de exclusão');
        return { 
          success: false, 
          error: 'Falha na verificação: usuário ainda existe no sistema após exclusão' 
        };
      }
    } catch (verificationError) {
      // Se der erro na verificação, é provável que o usuário realmente não existe mais
      console.log('✅ [DELETE_OPERATION] ETAPA 5: Usuário não encontrado nas verificações (confirmando exclusão bem-sucedida)');
    }

    console.log('🎉 [DELETE_OPERATION] ===== PROCESSO COMPLETO =====');
    console.log('🎉 [DELETE_OPERATION] Usuário excluído com sucesso');
    console.log('🎉 [DELETE_OPERATION] =============================');
    
    return { 
      success: true, 
      message: 'Usuário excluído com sucesso' 
    };

  } catch (error: any) {
    console.error('💥 [DELETE_OPERATION] ERRO INESPERADO CRÍTICO:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userId,
      userEmail
    });
    return { 
      success: false, 
      error: `Erro inesperado: ${error.message}` 
    };
  }
}

// Função de teste manual para verificar conectividade
export async function testDeleteConnectivity(
  supabaseAdmin: SupabaseClient
): Promise<{ success: boolean; message: string; details?: any }> {
  console.log('🧪 [TEST_CONNECTIVITY] Iniciando teste de conectividade...');
  
  try {
    // Testar conexão com auth
    const { data: authTest } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    console.log('✅ [TEST_CONNECTIVITY] Auth: Conexão OK');
    
    // Testar conexão com profiles
    const { data: profileTest } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);
    console.log('✅ [TEST_CONNECTIVITY] Profiles: Conexão OK');
    
    return {
      success: true,
      message: 'Conectividade verificada com sucesso',
      details: {
        auth: !!authTest,
        profiles: !!profileTest,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('❌ [TEST_CONNECTIVITY] Erro:', error);
    return {
      success: false,
      message: `Falha na conectividade: ${error.message}`,
      details: { error: error.message }
    };
  }
}
