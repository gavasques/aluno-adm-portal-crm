
import { useCallback } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { supabase } from '@/integrations/supabase/client';

export const usePerformanceOptimizedUsers = () => {
  const context = usePerformanceOptimizedUserContext();

  const deleteUserFromDatabase = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('🗑️ Starting user deletion process for:', userEmail);
      
      // Verificar se o usuário tem dados associados usando consultas separadas
      let hasAssociatedData = false;

      // Verificar fornecedores
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('my_suppliers')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (suppliersError) {
        console.error('❌ Error checking suppliers:', suppliersError);
      } else if (suppliersData && suppliersData.length > 0) {
        hasAssociatedData = true;
      }

      // Verificar arquivos apenas se ainda não encontrou dados associados
      if (!hasAssociatedData) {
        const { data: filesData, error: filesError } = await supabase
          .from('user_files')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (filesError) {
          console.error('❌ Error checking files:', filesError);
        } else if (filesData && filesData.length > 0) {
          hasAssociatedData = true;
        }
      }

      // Verificar inscrições em mentorias apenas se ainda não encontrou dados associados
      if (!hasAssociatedData) {
        const { data: mentoringData, error: mentoringError } = await supabase
          .from('mentoring_enrollments')
          .select('id')
          .eq('student_id', userId)
          .limit(1);

        if (mentoringError) {
          console.error('❌ Error checking mentoring enrollments:', mentoringError);
        } else if (mentoringData && mentoringData.length > 0) {
          hasAssociatedData = true;
        }
      }

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
