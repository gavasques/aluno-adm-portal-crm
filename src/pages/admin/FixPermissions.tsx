
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FixPermissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFixPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Chamar a edge function para criar as funções auxiliares e ajustar RLS
      const { data, error } = await supabase.functions.invoke('create-rls-helper-functions');
      
      if (error) {
        throw new Error(`Erro ao corrigir permissões: ${error.message}`);
      }

      setIsSuccess(true);
      toast({
        title: "Sucesso!",
        description: "As permissões foram corrigidas com sucesso.",
      });
    } catch (err: any) {
      console.error("Erro ao corrigir permissões:", err);
      setError(err.message);
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Corrigir Permissões</CardTitle>
          <CardDescription>
            Resolva problemas de acesso à tabela permission_groups e outros erros relacionados a permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">
            Use este utilitário para corrigir problemas de recursão infinita nas políticas RLS e configurar corretamente as funções de permissão.
          </p>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {isSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700 text-sm">Permissões corrigidas com sucesso! Agora você pode voltar à página de usuários.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleFixPermissions}
            disabled={isLoading || isSuccess}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Corrigindo...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Concluído
              </>
            ) : (
              "Corrigir Permissões"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FixPermissions;
