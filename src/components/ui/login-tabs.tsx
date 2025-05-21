
import { useState } from "react";
import { Tabs as TabsComponent, TabsList as TabsListComponent, TabsTrigger as TabsTriggerComponent, TabsContent as TabsContentComponent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/grid-background";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

// Exportando os componentes para uso em outros arquivos
export const Tabs = TabsComponent;
export const TabsList = TabsListComponent;
export const TabsTrigger = TabsTriggerComponent;
export const TabsContent = TabsContentComponent;

export function LoginTabs() {
  const navigate = useNavigate();
  const { signIn, signInWithMagicLink, signUp, forgotPassword, user } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [magicLinkOpen, setMagicLinkOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [signupOpen, setSignupOpen] = useState(false);

  // Redirect to appropriate dashboard if already logged in
  if (user) {
    navigate(activeTab === "admin" ? "/admin" : "/student");
    return null;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password, name);
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta",
        });
        setSignupOpen(false);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    
    try {
      const { error } = await forgotPassword(recoveryEmail);
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para recuperar sua senha",
        });
        setForgotPasswordOpen(false);
        setRecoveryEmail("");
      }
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    
    try {
      const { error } = await signInWithMagicLink(recoveryEmail);
      
      if (error) {
        toast({
          title: "Erro ao enviar magic link",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic link enviado",
          description: "Verifique seu email para fazer login",
        });
        setMagicLinkOpen(false);
        setRecoveryEmail("");
      }
    } catch (error) {
      console.error("Erro ao enviar magic link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Fundo estilizado com gradiente e grid */}
      <GridBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-16 md:h-22 object-cover"
          />
        </div>
        
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Área Aluno
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Área Mentor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
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
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordOpen(true)} 
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Esqueci a senha
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMagicLinkOpen(true)} 
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Enviar Magic Link
                  </button>
                </div>
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar na Área do Aluno"}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setSignupOpen(true)} 
                      className="text-blue-300 hover:text-blue-200 text-sm"
                    >
                      Não tem uma conta? Cadastre-se
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
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
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordOpen(true)} 
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Esqueci a senha
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMagicLinkOpen(true)} 
                    className="text-blue-300 hover:text-blue-200"
                  >
                    Enviar Magic Link
                  </button>
                </div>
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar na Área do Mentor"}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setSignupOpen(true)} 
                      className="text-blue-300 hover:text-blue-200 text-sm"
                    >
                      Não tem uma conta? Cadastre-se
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog para Esqueci a senha */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-blue-800/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-white">Recuperar senha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email" className="text-blue-200">Email</Label>
              <Input 
                id="recovery-email" 
                type="email" 
                placeholder="seu@email.com" 
                value={recoveryEmail} 
                onChange={e => setRecoveryEmail(e.target.value)} 
                className="bg-white/5 border-white/10 text-white placeholder-blue-300" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleForgotPassword} 
              className="bg-blue-600 hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Magic Link */}
      <Dialog open={magicLinkOpen} onOpenChange={setMagicLinkOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-blue-800/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-white">Enviar Magic Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email" className="text-blue-200">Email</Label>
              <Input 
                id="magic-email" 
                type="email" 
                placeholder="seu@email.com" 
                value={recoveryEmail} 
                onChange={e => setRecoveryEmail(e.target.value)} 
                className="bg-white/5 border-white/10 text-white placeholder-blue-300" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleMagicLink} 
              className="bg-blue-600 hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Magic Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Cadastro */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-blue-800/30 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-white">Criar nova conta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-blue-200">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input 
                    id="signup-name" 
                    type="text" 
                    placeholder="Seu nome" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-blue-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-blue-200">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Crie uma senha segura" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300" 
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 w-full"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
