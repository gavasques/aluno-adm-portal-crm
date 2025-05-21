
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    await resetPassword(password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <GridBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-16 md:h-22 object-cover"
          />
        </div>
        
        <div className="w-full max-w-md p-6 space-y-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Redefinir Senha</h1>
            <p className="text-blue-200 mt-2">Digite sua nova senha</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-md text-sm border border-red-500/30">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-blue-200">
                  Nova Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Digite sua nova senha"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-blue-200">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirme sua nova senha"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
