
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AuthTabs() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, sendMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modais
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

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
      // Redirecionar para a página inicial onde o usuário pode escolher a área
      navigate("/", { replace: true });
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

  const handleForgotPassword = async () => {
    if (!recoveryEmail.trim()) {
      toast.error("Digite seu email");
      return;
    }

    setRecoveryLoading(true);
    try {
      await resetPassword(recoveryEmail);
      toast.success("Email de recuperação enviado!");
      setShowForgotPassword(false);
      setRecoveryEmail("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar email de recuperação");
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!recoveryEmail.trim()) {
      toast.error("Digite seu email");
      return;
    }

    setRecoveryLoading(true);
    try {
      const success = await sendMagicLink(recoveryEmail);
      if (success) {
        toast.success("Magic Link enviado! Verifique seu email.");
        setShowMagicLink(false);
        setRecoveryEmail("");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar Magic Link");
    } finally {
      setRecoveryLoading(false);
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)} 
                    className="text-blue-300 hover:text-blue-200 hover:underline"
                    disabled={isLoading}
                  >
                    Esqueci a senha
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowMagicLink(true)} 
                    className="text-blue-300 hover:text-blue-200 hover:underline"
                    disabled={isLoading}
                  >
                    Magic Link
                  </button>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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

      {/* Modal Esqueci a Senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px] bg-blue-950 text-white border-blue-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Recuperar senha
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              Digite seu email para receber as instruções de recuperação
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                value={recoveryEmail} 
                onChange={e => setRecoveryEmail(e.target.value)} 
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                disabled={recoveryLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowForgotPassword(false)}
              disabled={recoveryLoading}
              className="border-blue-700 text-blue-300 hover:bg-blue-800/50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleForgotPassword} 
              className="bg-blue-600 hover:bg-blue-500"
              disabled={recoveryLoading || !recoveryEmail.trim()}
            >
              {recoveryLoading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Magic Link */}
      <Dialog open={showMagicLink} onOpenChange={setShowMagicLink}>
        <DialogContent className="sm:max-w-[425px] bg-blue-950 text-white border-blue-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Enviar Magic Link
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              Digite seu email para receber um link de acesso direto
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                value={recoveryEmail} 
                onChange={e => setRecoveryEmail(e.target.value)} 
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
                disabled={recoveryLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowMagicLink(false)}
              disabled={recoveryLoading}
              className="border-blue-700 text-blue-300 hover:bg-blue-800/50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleMagicLink} 
              className="bg-blue-600 hover:bg-blue-500"
              disabled={recoveryLoading || !recoveryEmail.trim()}
            >
              {recoveryLoading ? "Enviando..." : "Enviar Magic Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
