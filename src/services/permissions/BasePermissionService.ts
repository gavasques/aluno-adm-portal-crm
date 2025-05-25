
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { PermissionOperationResult } from '@/types/permissions';

export abstract class BasePermissionService {
  protected async handleError(error: any, operation: string): Promise<PermissionOperationResult> {
    console.error(`Erro na operação ${operation}:`, error);
    
    const errorMessage = error.message || `Erro ao executar ${operation}`;
    
    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      success: false,
      error: errorMessage,
    };
  }

  protected async handleSuccess(message: string, data?: any): Promise<PermissionOperationResult> {
    toast({
      title: "Sucesso",
      description: message,
    });

    return {
      success: true,
      data,
    };
  }

  protected getCurrentUserId(): string | null {
    return supabase.auth.getUser().then(({ data: { user } }) => user?.id || null);
  }

  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      await this.handleError(error, operationName);
      return null;
    }
  }
}
