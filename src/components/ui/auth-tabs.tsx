
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

export function AuthTabs() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Login realizado com sucesso!");
      // O redirecionamento será feito automaticamente pelo AuthProvider
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-black z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-16 md:h-22 object-cover" 
          />
        </div>
        
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-900/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                Cadastrar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Nome completo" 
                      className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
