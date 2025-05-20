
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function LoginTabs() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [magicLinkOpen, setMagicLinkOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  };

  const handleForgotPassword = () => {
    // Processar solicitação de recuperação de senha
    console.log("Enviando recuperação para:", recoveryEmail);
    setForgotPasswordOpen(false);
    setRecoveryEmail("");
  };

  const handleMagicLink = () => {
    // Processar solicitação de magic link
    console.log("Enviando magic link para:", recoveryEmail);
    setMagicLinkOpen(false);
    setRecoveryEmail("");
  };

  return (
    <div className="relative w-full min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
        {/* Logo no centro superior */}
        <div className="mb-12">
          <img src="/lovable-uploads/788ca39b-e116-44df-95de-2048b2ed6a09.png" alt="Logo" className="h-12" />
        </div>

        <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Área Aluno</TabsTrigger>
              <TabsTrigger value="admin">Área Mentor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-gray-950/50 border-gray-800"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="pl-10 bg-gray-950/50 border-gray-800"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordOpen(true)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Esqueci a senha
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMagicLinkOpen(true)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Enviar Magic Link
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entrar na Área do Aluno
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10 bg-gray-950/50 border-gray-800"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="pl-10 bg-gray-950/50 border-gray-800"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordOpen(true)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Esqueci a senha
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMagicLinkOpen(true)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Enviar Magic Link
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Entrar na Área do Mentor
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog para Esqueci a senha */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="seu@email.com"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="bg-gray-950/50 border-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleForgotPassword}>
              Enviar link de recuperação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Magic Link */}
      <Dialog open={magicLinkOpen} onOpenChange={setMagicLinkOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar Magic Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email">Email</Label>
              <Input
                id="magic-email"
                type="email"
                placeholder="seu@email.com"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="bg-gray-950/50 border-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleMagicLink}>
              Enviar Magic Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
