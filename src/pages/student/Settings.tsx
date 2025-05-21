
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { User } from "lucide-react";

const Settings = () => {
  const [fullName, setFullName] = useState("João Silva");
  const [phone, setPhone] = useState("(11) 99999-9999");
  const [company, setCompany] = useState("JS Digital Commerce");
  const [role, setRole] = useState("CEO / Fundador");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-portal-dark">Configurações</h1>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e profissionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="Foto de perfil" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-portal-light text-portal-primary text-2xl font-bold">
                      {fullName?.split(" ").map(name => name[0]).join("").slice(0, 2) || <User className="w-12 h-12" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="bg-portal-primary hover:bg-portal-primary/90 text-white px-3 py-2 rounded-md text-sm transition-colors">
                    Alterar Foto
                  </div>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="joao.silva@exemplo.com" 
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input 
                  id="company" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input 
                  id="role" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

