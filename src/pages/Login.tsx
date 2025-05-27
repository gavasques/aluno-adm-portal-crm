
import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { user, loading, signIn, signUp, resetPassword, signInWithGoogle, sendMagicLink } = useAuth();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Dialog states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [magicLinkOpen, setMagicLinkOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  // Se estiver carregando, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se já estiver logado, redirecionar
  if (user) {
    return <Navigate to="/aluno" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // O redirecionamento é tratado pelo hook useAuth
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
      // Feedback é mostrado através do hook useAuth
    } catch (error) {
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!recoveryEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite seu email para recuperar a senha.",
        variant: "destructive",
      });
      return;
    }

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
    if (!magicLinkEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite seu email para enviar o Magic Link.",
        variant: "destructive",
      });
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" 
            alt="Guilherme Vasques Logo" 
            className="h-16 md:h-20 mx-auto object-cover" 
          />
        </div>

        {/* Card de Login */}
        <Card className="bg-blue-950/80 backdrop-blur-md border-blue-800/30 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-blue-200">
              Faça login ou crie sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-900/50">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Cadastro
                </TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-blue-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-blue-200">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        className="pl-10 pr-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-blue-300 hover:text-blue-200"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-blue-300 hover:text-blue-200 hover:underline"
                      disabled={isLoading}
                    >
                      Esqueci a senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setMagicLinkOpen(true)}
                      className="text-blue-300 hover:text-blue-200 hover:underline"
                      disabled={isLoading}
                    >
                      Magic Link
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab de Cadastro */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-blue-200">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
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
                        className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-blue-200">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha"
                        className="pl-10 pr-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-blue-300 hover:text-blue-200"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                    disabled={isLoading || !email || !password || !name}
                  >
                    {isLoading ? "Cadastrando..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Separador e Login com Google */}
            <div className="relative my-6">
              <Separator className="bg-blue-700/50" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-950/80 px-2 text-xs text-blue-300">
                ou continue com
              </span>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
              disabled={googleLoading || isLoading}
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

            {/* Link para voltar à home */}
            <div className="text-center mt-6">
              <Link 
                to="/" 
                className="text-blue-300 hover:text-blue-200 text-sm hover:underline"
              >
                ← Voltar à página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
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
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleForgotPassword}
              className="bg-blue-600 hover:bg-blue-500"
              disabled={!recoveryEmail}
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
                onChange={(e) => setMagicLinkEmail(e.target.value)}
                className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300"
              />
            </div>
            <p className="text-sm text-blue-200 mt-2">
              Enviaremos um link mágico para seu email. Ao clicar nele, você entrará automaticamente no sistema.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleMagicLink}
              className="bg-blue-600 hover:bg-blue-500"
              disabled={magicLinkLoading || !magicLinkEmail}
            >
              {magicLinkLoading ? "Enviando..." : "Enviar Magic Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
