
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FixPermissionsButtonProps {
  onSuccess: () => void;
}

const FixPermissionsButton: React.FC<FixPermissionsButtonProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleFixPermissions = async () => {
    try {
      setIsLoading(true);
      
      // Chamar a Edge Function para corrigir as políticas RLS
      const { data, error } = await supabase.functions.invoke("fix-permission-groups-policy");
      
      if (error) {
        console.error("Erro na função de correção:", error);
        throw error;
      }
      
      console.log("Resultado da correção:", data);
      
      toast({
        title: "Correção aplicada",
        description: "As políticas de permissão foram corrigidas com sucesso!",
      });
      
      setShowAlert(true);
      
      // Atualizar os dados
      onSuccess();
    } catch (err) {
      console.error("Erro ao corrigir políticas:", err);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir as políticas de permissão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {showAlert && (
        <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <AlertTitle>Correção aplicada com sucesso</AlertTitle>
          <AlertDescription>
            As políticas de acesso ao banco de dados foram corrigidas. Tente carregar os dados novamente.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        variant="outline" 
        onClick={handleFixPermissions}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Corrigir Políticas de Acesso
      </Button>
    </div>
  );
};

export default FixPermissionsButton;
