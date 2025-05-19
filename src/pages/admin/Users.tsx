
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Sample user data
const USERS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    storage: "45MB / 100MB"
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    storage: "78MB / 100MB"
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    storage: "23MB / 100MB"
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    role: "Aluno",
    status: "Inativo",
    lastLogin: "15/05/2023, 14:20",
    storage: "12MB / 100MB"
  },
  {
    id: 5,
    name: "Roberto Costa",
    email: "roberto.costa@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Hoje, 11:05",
    storage: "89MB / 100MB"
  }
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users based on search query
  const filteredUsers = USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleResetPassword = (userId: number, userName: string) => {
    toast({
      title: "Reset de senha enviado",
      description: `Um e-mail com instruções foi enviado para ${userName}.`
    });
  };
  
  const handleToggleStatus = (userId: number, currentStatus: string, userName: string) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    toast({
      title: `Status alterado para ${newStatus}`,
      description: `O usuário ${userName} agora está ${newStatus.toLowerCase()}.`
    });
  };
  
  const handleIncreaseStorage = (userId: number, userName: string) => {
    toast({
      title: "Armazenamento aumentado",
      description: `O limite de armazenamento de ${userName} foi aumentado em 100MB.`
    });
  };
  
  const handleSendMagicLink = (userId: number, userName: string) => {
    toast({
      title: "Link mágico enviado",
      description: `Um link de acesso direto foi enviado para ${userName}.`
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gestão de Usuários</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Usuários</CardTitle>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Armazenamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Administrador" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Ativo" ? "success" : "secondary"}
                        className={user.status === "Ativo" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-portal-primary rounded-full"
                            style={{ 
                              width: `${parseInt(user.storage.split('/')[0]) / 
                                parseInt(user.storage.split('/')[1].trim().replace('MB', '')) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs whitespace-nowrap">{user.storage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id, user.name)}>
                            Resetar senha
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status, user.name)}>
                            {user.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleIncreaseStorage(user.id, user.name)}>
                            Aumentar armazenamento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMagicLink(user.id, user.name)}>
                            Enviar magic link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
