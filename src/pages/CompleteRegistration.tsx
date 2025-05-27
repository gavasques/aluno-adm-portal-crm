import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AcceptInvite = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Verificar se já temos acesso ao nome do usuário
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Se o usuário já estiver autenticado, podemos verificar seus metadados
        if (session.user.user_metadata?.name) {
          setName(session.user.user_metadata.name);
        }
      }
    };
    
    checkUserSession();
  }, []);

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
      // Atualizar a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password,
        data: { name, status: 'Ativo' }
      });

      if (error) throw error;
      
      // Atualizar o perfil para status Ativo
      const { error: profileError } = await supabase.from('profiles')
        .update({ status: 'Ativo', name })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (profileError) {
        console.error("Erro ao atualizar status no perfil:", profileError);
        // Continue mesmo com erro no perfil
      }
      
      setSuccess(true);
      
      toast({
        title: "Cadastro concluído com sucesso",
        description: "Você será redirecionado para sua área",
        variant: "default",
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        // Redirecionar para a página adequada com base no papel do usuário
        const checkUserRole = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();
            
            if (data?.role === "Admin") {
              navigate("/admin");
            } else {
              navigate("/aluno");
            }
          } else {
            navigate("/");
          }
        };
        
        checkUserRole();
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao finalizar cadastro:", error);
      setError(error.message || "Ocorreu um erro ao finalizar o cadastro. Tente novamente.");
      
      toast({
        title: "Erro ao finalizar cadastro",
        description: error.message || "Ocorreu um erro ao finalizar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            {success ? "Cadastro concluído com sucesso!" : "Complete seu cadastro"}
          </h2>
          
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Seu nome completo" 
                    className="pl-10 bg-gray-950/50 border-gray-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Defina sua senha" 
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
                    placeholder="Confirme sua senha" 
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
                {loading ? "Processando..." : "Concluir Cadastro"}
              </Button>
            </form>
          ) : (
            <p className="text-center text-green-400">
              Seu cadastro foi concluído com sucesso. Você será redirecionado em instantes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
