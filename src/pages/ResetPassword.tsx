
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();

  // Pega o token da URL se estiver usando search params
  const tokenFromParams = searchParams.get('token') || searchParams.get('access_token');
  const typeFromParams = searchParams.get('type');
  
  // Verificar se estamos em um fluxo de recuperação de senha
  const isRecoveryFlow = typeFromParams === 'recovery' || !!tokenFromParams;

  useEffect(() => {
    // Verificar se o token é válido
    const validateToken = async () => {
      setValidatingToken(true);
      
      try {
        // Se não temos um token de recuperação, não podemos prosseguir
        if (!isRecoveryFlow) {
          setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
          setTokenValid(false);
          return;
        }

        setTokenValid(true);
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setError("Link inválido ou expirado. Solicite um novo link de recuperação de senha.");
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
    
    // Log de informações para diagnóstico
    console.log("Token de recuperação detectado:", tokenFromParams || "Não encontrado em query params");
    console.log("Tipo de ação:", typeFromParams);
    console.log("URL atual:", window.location.href);
  }, [tokenFromParams, typeFromParams, isRecoveryFlow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Validação de senha
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }
    
    try {
      // Usar diretamente o método updateUser com a senha
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      
      toast({
        title: "Senha atualizada com sucesso",
        description: "Você será redirecionado para a página de login",
        variant: "default",
      });
      
      // Fazer logout para forçar uma nova autenticação
      await supabase.auth.signOut();
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Ocorreu um erro ao redefinir a senha. Tente novamente.");
      
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Se estamos validando o token, mostrar loading
  if (validatingToken) {
    return (
      <div className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="mb-12">
            <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
          </div>
          <div className="w-full max-w-md mx-auto p-8 space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-white">Verificando link de recuperação...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Se o token não for válido, mostrar mensagem de erro
  if (!tokenValid && !success) {
    return (
      <div className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="mb-12">
            <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
          </div>
          <div className="w-full max-w-md mx-auto p-8 space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-white">Link inválido ou expirado</h2>
            <p className="text-red-400">{error}</p>
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
  }

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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Processando..." : "Redefinir Senha"}
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
