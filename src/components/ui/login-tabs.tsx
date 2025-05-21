import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
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
    console.log("Enviando recuperação para:", recoveryEmail);
    setForgotPasswordOpen(false);
    setRecoveryEmail("");
  };
  const handleMagicLink = () => {
    console.log("Enviando magic link para:", recoveryEmail);
    setMagicLinkOpen(false);
    setRecoveryEmail("");
  };
  return <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-black z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <img src="/lovable-uploads/ac3223f2-8f29-482c-a887-ed1bcabecec0.png" alt="Guilherme Vasques Logo" className="h-24 md:h-32 object-fill" />
        </div>
        
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-blue-950/80 backdrop-blur-md rounded-xl border border-blue-800/30 shadow-lg">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-900/50">
              <TabsTrigger value="student" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-none">Área Aluno</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-none">Área Mentor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input type="email" placeholder="Email" className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input type="password" placeholder="Senha" className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button type="button" onClick={() => setForgotPasswordOpen(true)} className="text-blue-300 hover:text-blue-200">
                    Esqueci a senha
                  </button>
                  <button type="button" onClick={() => setMagicLinkOpen(true)} className="text-blue-300 hover:text-blue-200">
                    Enviar Magic Link
                  </button>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                  Entrar na Área do Aluno
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input type="email" placeholder="Email" className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                    <Input type="password" placeholder="Senha" className="pl-10 bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <button type="button" onClick={() => setForgotPasswordOpen(true)} className="text-blue-300 hover:text-blue-200">
                    Esqueci a senha
                  </button>
                  <button type="button" onClick={() => setMagicLinkOpen(true)} className="text-blue-300 hover:text-blue-200">
                    Enviar Magic Link
                  </button>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                  Entrar na Área do Mentor
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
              <Input id="recovery-email" type="email" placeholder="seu@email.com" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleForgotPassword} className="bg-blue-600 hover:bg-blue-500">
              Enviar link de recuperação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Magic Link */}
      <Dialog open={magicLinkOpen} onOpenChange={setMagicLinkOpen}>
        <DialogContent className="sm:max-w-[425px] bg-blue-950 text-white border-blue-800">
          <DialogHeader>
            <DialogTitle className="text-white">Enviar Magic Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email" className="text-blue-200">Email</Label>
              <Input id="magic-email" type="email" placeholder="seu@email.com" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="bg-blue-900/30 border-blue-700/50 text-white placeholder-blue-300" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleMagicLink} className="bg-blue-600 hover:bg-blue-500">
              Enviar Magic Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}