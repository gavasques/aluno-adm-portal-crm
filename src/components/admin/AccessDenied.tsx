
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar toast com a mensagem
    toast({
      title: "Acesso Negado",
      description: "Você não tem acesso a essa área.",
      variant: "destructive",
    });

    // Redirecionamento automático após 3 segundos
    const timer = setTimeout(() => {
      navigate("/student");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  const handleGoToStudent = () => {
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Alert variant="destructive" className="p-6">
          <ShieldX className="h-6 w-6" />
          <AlertTitle className="text-lg font-semibold mb-2">
            Acesso Negado
          </AlertTitle>
          <AlertDescription className="text-sm text-gray-600 mb-4">
            Você não tem acesso a essa área. Apenas administradores podem acessar
            esta seção do sistema.
          </AlertDescription>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGoToStudent}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir para Área do Estudante
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Redirecionando automaticamente em 3 segundos...
            </p>
          </div>
        </Alert>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
