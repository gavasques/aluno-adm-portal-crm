
// Funções auxiliares para execução de RPC e SQL no Supabase

/**
 * Função para remover todas as políticas RLS de uma tabela
 */
export async function dropPoliciesForTable(supabaseAdmin: any, tableName: string) {
  try {
    // Primeiro, obter todas as políticas existentes para a tabela
    const { data: policies, error: queryError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        SELECT policyname
        FROM pg_policies
        WHERE tablename = '${tableName}'
      `
    });
    
    if (queryError) throw queryError;
    
    // Se não houver políticas, retornar
    if (!policies || policies.length === 0) {
      return { success: true, message: "No policies found to drop" };
    }
    
    // Remover cada política
    for (const policy of policies) {
      const { error } = await supabaseAdmin.rpc('execute_sql', {
        sql: `DROP POLICY IF EXISTS "${policy.policyname}" ON public.${tableName};`
      });
      
      if (error) throw error;
    }
    
    return { success: true, message: `Dropped ${policies.length} policies from ${tableName}` };
  } catch (error) {
    console.error(`Error dropping policies from ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Função para executar SQL seguro
 */
export async function executeSql(supabaseAdmin: any, sql: string) {
  try {
    const { error } = await supabaseAdmin.rpc('execute_sql', { sql });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error executing SQL:", error);
    return { success: false, error };
  }
}
