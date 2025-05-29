
import { useCallback } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { supabase } from '@/integrations/supabase/client';

export const usePerformanceOptimizedUsers = () => {
  const context = usePerformanceOptimizedUserContext();

  const deleteUserFromDatabase = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('🗑️ Starting user deletion process for:', userEmail);
      
      // Verificar se o usuário tem dados associados
      const { data: userData, error: checkError } = await supabase
        .from('profiles')
        .select(`
          id,
          my_suppliers(count),
          user_files(count),
          mentoring_enrollments(count)
        `)
        .eq('id', userId)
        .single();

      if (checkError) {
        console.error('❌ Error checking user data:', checkError);
        throw new Error('Erro ao verificar dados do usuário');
      }

      const hasAssociatedData = userData && (
        userData.my_suppliers?.length > 0 ||
        userData.user_files?.length > 0 ||
        userData.mentoring_enrollments?.length > 0
      );

      if (hasAssociatedData) {
        // Inativar usuário se tiver dados associados
        console.log('👤 User has associated data, inactivating instead of deleting');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            status: 'Inativo',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('❌ Error inactivating user:', updateError);
          throw new Error('Erro ao inativar usuário');
        }

        console.log('✅ User inactivated successfully');
        return true;
      } else {
        // Excluir usuário se não tiver dados associados
        console.log('🗑️ User has no associated data, proceeding with deletion');
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (deleteError) {
          console.error('❌ Error deleting user:', deleteError);
          throw new Error('Erro ao excluir usuário');
        }

        console.log('✅ User deleted successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ User deletion failed:', error);
      return false;
    }
  }, []);

  return {
    ...context,
    deleteUserFromDatabase
  };
};
