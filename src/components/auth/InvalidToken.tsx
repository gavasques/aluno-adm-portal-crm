
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { useNavigate } from "react-router-dom";

interface InvalidTokenProps {
  error: string;
}

export const InvalidToken: React.FC<InvalidTokenProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-12">
          <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
        </div>
        <div className="w-full max-w-md mx-auto p-8 space-y-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertOctagon className="h-16 w-16 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Link inválido ou expirado</h2>
          <p className="text-red-400">{error}</p>
          <p className="text-white mt-2">
            Solicite um novo link de recuperação de senha.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Voltar para o login
          </Button>
        </div>
      </div>
    </div>
  );
};
