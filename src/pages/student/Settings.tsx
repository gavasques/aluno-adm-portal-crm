
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  
  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 dark-transition">
      <h1 className="text-3xl font-bold mb-6 text-portal-dark">Configurações</h1>
      
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="dark-transition">
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e profissionais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-portal-light text-portal-primary flex items-center justify-center text-2xl font-bold">
                    JS
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Alterar Foto</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input id="fullName" defaultValue="João Silva" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input id="username" defaultValue="joaosilva" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(11) 99999-9999" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <textarea 
                      id="bio" 
                      className="portal-input min-h-[100px]"
                      placeholder="Conte um pouco sobre você..."
                      defaultValue="Empreendedor digital e entusiasta de e-commerce. Buscando sempre aprender e crescer no mercado digital."
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" defaultValue="JS Digital Commerce" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input id="role" defaultValue="CEO / Fundador" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="dark-transition">
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Atualize sua senha e configure as preferências de segurança.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Verificação em Duas Etapas</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Adicione uma camada extra de segurança à sua conta usando a verificação em duas etapas.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação via SMS</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba um código por SMS para fazer login.</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação por Aplicativo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use um aplicativo de autenticação para gerar códigos.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePassword}>Atualizar Senha</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="dark-transition">
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações por E-mail</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações do Portal</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Novos recursos, atualizações importantes e mudanças no sistema.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novos Fornecedores</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações quando novos fornecedores forem adicionados.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comentários e Avaliações</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Respostas aos seus comentários e novas avaliações.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Notificações no Aplicativo</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações de Fornecedores</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mudanças em fornecedores que você segue.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Menções e Respostas</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quando alguém menciona você ou responde aos seus comentários.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Frequência de Resumos</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="summary">Receber resumos de atividades</Label>
                    <select id="summary" className="portal-input w-full">
                      <option value="daily">Diariamente</option>
                      <option value="weekly" selected>Semanalmente</option>
                      <option value="biweekly">Quinzenalmente</option>
                      <option value="monthly">Mensalmente</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="dark-transition">
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do portal de acordo com sua preferência.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tema</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Escolha entre o tema claro, escuro ou siga as configurações do seu sistema.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 ${theme === 'light' ? 'bg-secondary border-portal-primary' : 'border-input'}`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="p-2 rounded-full bg-portal-light">
                        <Sun className="h-5 w-5 text-portal-primary" />
                      </div>
                      <span className="font-medium">Claro</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 ${theme === 'dark' ? 'bg-secondary border-portal-primary' : 'border-input'}`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="p-2 rounded-full bg-gray-800">
                        <Moon className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="font-medium">Escuro</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 ${theme === 'system' ? 'bg-secondary border-portal-primary' : 'border-input'}`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <Laptop className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <span className="font-medium">Sistema</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Layout</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Exibir Barra Lateral Compacta</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reduz o tamanho da barra lateral para ganhar mais espaço.</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ocultar Automaticamente a Barra Lateral</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Oculta a barra lateral quando a janela é redimensionada.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
