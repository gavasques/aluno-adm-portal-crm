
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/login-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signInWithMagicLink, signUp, forgotPassword } = useAuth();

  // Redirecionar se o usuário já estiver logado
  if (user) {
    return <Navigate to="/admin" />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signInWithMagicLink(email);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, name);
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Portal do Aluno</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email/Senha</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("forgot");
                  }}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="magic" className="space-y-4">
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="magic-email"
                  type="email"
                  placeholder="Seu Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Receba um link de acesso único no seu email.
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Link de Acesso"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot" className="space-y-4">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Seu Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Enviaremos instruções para redefinir sua senha.
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Redefinir Senha"}
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setActiveTab("email")}
                >
                  Voltar para o login
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
