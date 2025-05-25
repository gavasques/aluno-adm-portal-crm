
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { usePasswordReset } from "@/hooks/auth/usePasswordReset";
import { validatePassword } from "@/utils/security";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserPassword } = usePasswordReset();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    const validation = validatePassword(newPassword);
    setPasswordErrors(validation.errors);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordErrors.length > 0) {
      setError("Por favor, corrija os erros na senha antes de continuar.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("=== INICIANDO ATUALIZAÇÃO DE SENHA ===");
      await updateUserPassword(password);
      console.log("✅ Senha atualizada com sucesso");
      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        console.log("Redirecionando para a página inicial...");
        navigate("/");
      }, 3000);
      
    } catch (error: any) {
      console.error("❌ Erro ao atualizar senha:", error);
      setError(error.message || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = passwordErrors.length === 0 && password === confirmPassword && password.length > 0;

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo at center top */}
        <div className="mb-12">
          <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
        </div>

        <div className="w-full max-w-md mx-auto p-8 space-y-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Senha redefinida com sucesso!
              </h2>
              <p className="text-green-400">
                Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em alguns segundos.
              </p>
              <Button 
                onClick={() => navigate("/")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ir para Login
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center text-white">
                Definir nova senha
              </h2>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="Nova senha" 
                      className="pl-10 bg-gray-950/50 border-gray-800"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
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
                
                {passwordErrors.length > 0 && (
                  <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded border border-red-800">
                    <p className="font-medium mb-2">Critérios de senha:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {password !== confirmPassword && confirmPassword.length > 0 && (
                  <p className="text-red-400 text-sm">As senhas não coincidem</p>
                )}
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Processando..." : "Redefinir Senha"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
