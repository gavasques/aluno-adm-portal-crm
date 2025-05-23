
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    
    if (email && password) {
      try {
        // Updated to match the expected function signature
        await signUp(
          { email, password }, 
          { redirectTo: window.location.origin + '/signin' },
          { data: { name } }
        );
        navigate("/signin");
      } catch (error) {
        console.error("Erro ao criar conta:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome</label>
              <Input id="name" name="name" type="text" placeholder="Seu nome" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Cadastrar</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/signin")}
            >
              Já tenho uma conta
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
