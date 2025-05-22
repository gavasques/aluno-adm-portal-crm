
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function AuthTabs() {
  const { signIn, signUp, resetPassword, signInWithGoogle, sendMagicLink } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [magicLinkOpen, setMagicLinkOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Redirecionamento é tratado dentro do hook useAuth
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
      // Feedback já é mostrado através do hook useAuth
    } catch (error) {
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    try {
      await resetPassword(recoveryEmail);
      setForgotPasswordOpen(false);
      setRecoveryEmail("");
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro no login com Google:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setMagicLinkLoading(true);
    try {
      await sendMagicLink(magicLinkEmail);
      setMagicLinkOpen(false);
      setMagicLinkEmail("");
    } catch (error) {
      console.error("Erro ao enviar magic link:", error);
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-black z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <img src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" alt="Guilherme Vasques Logo" className="h-16 md:h-22 object-cover" />
        </div>
        
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-900/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-none">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-none">Cadastro</TabsTrigger>
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
                    Magic Link
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

                <div className="relative my-4">
                  <Separator className="bg-blue-700/50" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-950 px-2 text-xs text-blue-300">
                    ou continue com
                  </span>
                </div>

                <Button 
                  type="button" 
                  onClick={handleGoogleLogin} 
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    "Conectando..."
                  ) : (
                    <>
                      <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-4 h-4 mr-2" />
                      Entrar com Google
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input 
                      type="text" 
                      placeholder="Nome completo" 
                      className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>

                <div className="relative my-4">
                  <Separator className="bg-blue-700/50" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-950 px-2 text-xs text-blue-300">
                    ou continue com
                  </span>
                </div>

                <Button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    "Conectando..."
                  ) : (
                    <>
                      <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-4 h-4 mr-2" />
                      Cadastrar com Google
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog para Esqueci a senha */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-blue-950 text-white border-blue-800">
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
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleForgotPassword} 
              className="bg-blue-600 hover:bg-blue-500"
            >
              Enviar link de recuperação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Magic Link */}
      <Dialog open={magicLinkOpen} onOpenChange={setMagicLinkOpen}>
        <DialogContent className="sm:max-w-[425px] bg-blue-950 text-white border-blue-800">
          <DialogHeader>
            <DialogTitle className="text-white">Login com Magic Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email" className="text-blue-200">Email</Label>
              <Input 
                id="magic-email" 
                type="email" 
                placeholder="seu@email.com" 
                value={magicLinkEmail} 
                onChange={e => setMagicLinkEmail(e.target.value)} 
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" 
              />
            </div>
            <p className="text-sm text-blue-200 mt-2">
              Enviaremos um link mágico para seu email. Ao clicar nele, você entrará automaticamente no sistema.
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleMagicLink} 
              className="bg-blue-600 hover:bg-blue-500"
              disabled={magicLinkLoading}
            >
              {magicLinkLoading ? "Enviando..." : "Enviar Magic Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
