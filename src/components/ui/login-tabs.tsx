
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

export function LoginTabs() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  };

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto p-8 space-y-12">
          <div className="space-y-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
              Portal do Aluno e <br /> Administração
            </h2>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Acesse o portal e confira todos os recursos disponíveis para fornecedores, 
              parceiros e ferramentas para e-commerce.
            </p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Área Aluno</TabsTrigger>
              <TabsTrigger value="admin">Área Mentor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entrar na Área do Aluno
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
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
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Entrar na Área do Mentor
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white/20 text-sm font-semibold">JD</div>
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white/20 text-sm font-semibold">AS</div>
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center border-2 border-white/20 text-sm font-semibold">MK</div>
              </div>
              <span className="font-bold text-gray-300">100+ pessoas no portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
