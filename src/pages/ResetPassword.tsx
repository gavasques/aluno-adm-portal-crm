
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const { updateUserPassword } = useAuth();

  useEffect(() => {
    // O token é tratado automaticamente pelo Supabase quando chega nesta página
    console.log("Token de recuperação recebido:", token);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validação de senha
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    try {
      await updateUserPassword(password);
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Ocorreu um erro ao redefinir a senha. Tente novamente.");
    }
  };

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo no centro superior */}
        <div className="mb-12">
          <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
        </div>

        <div className="w-full max-w-md mx-auto p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-white">
            {success ? "Senha redefinida com sucesso!" : "Definir nova senha"}
          </h2>
          
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Nova senha" 
                    className="pl-10 bg-gray-950/50 border-gray-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Confirmar nova senha" 
                    className="pl-10 bg-gray-950/50 border-gray-800"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Redefinir Senha
              </Button>
            </form>
          ) : (
            <p className="text-center text-green-400">
              Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
