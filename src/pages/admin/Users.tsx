
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, UserPlus, User, Mail, Phone, Calendar, HardDrive, Plus, Minus, Award, Gift, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Sample user data
const USERS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    storage: "45MB / 100MB",
    phone: "(11) 98765-4321",
    registrationDate: "15/03/2023",
    courses: ["Curso Básico de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle"],
    storageValue: 45,
    storageLimit: 100,
    credits: 3,
    monthlyCredits: 5
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    storage: "78MB / 100MB",
    phone: "(21) 97654-3210",
    registrationDate: "22/05/2023",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: [],
    bonuses: ["Planilha de Controle"],
    storageValue: 78,
    storageLimit: 100,
    credits: 5,
    monthlyCredits: 5
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    storage: "23MB / 100MB",
    phone: "(31) 98877-6655",
    registrationDate: "10/01/2023",
    courses: ["Curso Básico de E-commerce", "Curso Avançado de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria Avançada"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle", "Templates de E-commerce"],
    storageValue: 23,
    storageLimit: 100,
    credits: 5,
    monthlyCredits: 5
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    role: "Aluno",
    status: "Inativo",
    lastLogin: "15/05/2023, 14:20",
    storage: "12MB / 100MB",
    phone: "(41) 99988-7766",
    registrationDate: "05/02/2023",
    courses: ["Curso Básico de E-commerce"],
    mentorships: [],
    bonuses: [],
    storageValue: 12,
    storageLimit: 100,
    credits: 0,
    monthlyCredits: 5
  },
  {
    id: 5,
    name: "Roberto Costa",
    email: "roberto.costa@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Hoje, 11:05",
    storage: "89MB / 100MB",
    phone: "(51) 98765-4321",
    registrationDate: "18/04/2023",
    courses: ["Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce"],
    storageValue: 89,
    storageLimit: 100,
    credits: 4,
    monthlyCredits: 5
  }
];

// Lista de mentórias disponíveis para adicionar
const AVAILABLE_MENTORSHIPS = [
  "Mentoria Individual",
  "Mentoria em Grupo",
  "Mentoria Avançada",
  "Mentoria de Negócios",
  "Mentoria de Marketing"
];

// Lista de bônus disponíveis para adicionar
const AVAILABLE_BONUSES = [
  "E-book de E-commerce",
  "Planilha de Controle",
  "Templates de E-commerce",
  "Acesso a Comunidade VIP",
  "Workshop Exclusivo"
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [showAddCreditDialog, setShowAddCreditDialog] = useState(false);
  const [creditsToAdd, setCreditsToAdd] = useState(1);
  
  // Filter users based on search query
  const filteredUsers = USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleResetPassword = (userId, userName) => {
    toast({
      title: "Reset de senha enviado",
      description: `Um e-mail com instruções foi enviado para ${userName}.`
    });
  };
  
  const handleToggleStatus = (userId, currentStatus, userName) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    toast({
      title: `Status alterado para ${newStatus}`,
      description: `O usuário ${userName} agora está ${newStatus.toLowerCase()}.`
    });
  };
  
  const handleIncreaseStorage = (userId, userName) => {
    toast({
      title: "Armazenamento aumentado",
      description: `O limite de armazenamento de ${userName} foi aumentado em 100MB.`
    });
    // In a real app, update the user's storage limit here
  };

  const handleDecreaseStorage = (userId, userName) => {
    toast({
      title: "Armazenamento reduzido",
      description: `O limite de armazenamento de ${userName} foi reduzido em 100MB.`
    });
    // In a real app, update the user's storage limit here
  };
  
  const handleSendMagicLink = (userId, userName) => {
    toast({
      title: "Link mágico enviado",
      description: `Um link de acesso direto foi enviado para ${userName}.`
    });
  };

  const handleAddMentorship = (mentorship) => {
    toast({
      title: "Mentoria adicionada",
      description: `A mentoria ${mentorship} foi adicionada ao usuário.`
    });
    // In a real app, add the mentorship to the user
  };

  const handleRemoveMentorship = (mentorship) => {
    toast({
      title: "Mentoria removida",
      description: `A mentoria ${mentorship} foi removida do usuário.`
    });
    // In a real app, remove the mentorship from the user
  };

  const handleAddBonus = (bonus) => {
    toast({
      title: "Bônus adicionado",
      description: `O bônus ${bonus} foi adicionado ao usuário.`
    });
    // In a real app, add the bonus to the user
  };

  const handleRemoveBonus = (bonus) => {
    toast({
      title: "Bônus removido",
      description: `O bônus ${bonus} foi removido do usuário.`
    });
    // In a real app, remove the bonus from the user
  };

  const handleAddCredits = () => {
    toast({
      title: "Créditos adicionados",
      description: `${creditsToAdd} crédito(s) foram adicionados ao usuário.`
    });
    setShowAddCreditDialog(false);
    setCreditsToAdd(1);
    // In a real app, add the credits to the user
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setActiveTab("info");
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Administrador" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Ativo" ? "default" : "secondary"}
                        className={user.status === "Ativo" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={handleCloseUserDetails}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center">
                <User className="mr-2 h-5 w-5" /> 
                {selectedUser.name}
                <Badge variant={selectedUser.role === "Administrador" ? "default" : "outline"} className="ml-3">
                  {selectedUser.role}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Informações e gerenciamento do usuário
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-6">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="storage">Armazenamento</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="mentorships">Mentorias</TabsTrigger>
                <TabsTrigger value="bonuses">Bônus</TabsTrigger>
                <TabsTrigger value="credits">Créditos</TabsTrigger>
              </TabsList>
              
              {/* User Info Tab */}
              <TabsContent value="info" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-portal-primary mt-1" />
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">Email</h3>
                        <p>{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-portal-primary mt-1" />
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">Telefone</h3>
                        <p>{selectedUser.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-portal-primary mt-1" />
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">Data de Registro</h3>
                        <p>{selectedUser.registrationDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Status</h3>
                      <div className="flex items-center">
                        <Badge 
                          variant={selectedUser.status === "Ativo" ? "default" : "secondary"}
                          className={selectedUser.status === "Ativo" ? "bg-green-500" : "bg-gray-500"}
                        >
                          {selectedUser.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status, selectedUser.name)}
                        >
                          {selectedUser.status === "Ativo" ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Último Acesso</h3>
                      <p>{selectedUser.lastLogin}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-semibold border-b pb-2">Ações</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(selectedUser.id, selectedUser.name)}>
                      Resetar senha
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSendMagicLink(selectedUser.id, selectedUser.name)}>
                      Enviar magic link
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Storage Tab */}
              <TabsContent value="storage" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <HardDrive className="h-5 w-5 text-portal-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-muted-foreground">Armazenamento Utilizado</h3>
                      <div className="flex items-center mt-2">
                        <div className="w-full h-3 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-3 bg-portal-primary rounded-full"
                            style={{ 
                              width: `${(selectedUser.storageValue / selectedUser.storageLimit) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm whitespace-nowrap">{selectedUser.storage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-3">Gerenciar Limite de Armazenamento</h3>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDecreaseStorage(selectedUser.id, selectedUser.name)}
                        disabled={selectedUser.storageLimit <= 100}
                      >
                        <Minus className="h-4 w-4 mr-1" /> Reduzir 100MB
                      </Button>
                      <div className="text-sm font-medium">
                        Limite atual: {selectedUser.storageLimit}MB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIncreaseStorage(selectedUser.id, selectedUser.name)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Aumentar 100MB
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2">Detalhes de Uso</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Documentos</span>
                        <span className="font-medium">12MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Imagens</span>
                        <span className="font-medium">28MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Outros arquivos</span>
                        <span className="font-medium">5MB</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              {/* Courses Tab */}
              <TabsContent value="courses" className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Cursos Adquiridos</h3>
                
                {selectedUser.courses && selectedUser.courses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.courses.map((course, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <p className="font-medium">{course}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhum curso adquirido.</p>
                )}
                
                <Button className="mt-4" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Curso
                </Button>
              </TabsContent>

              {/* Mentorships Tab */}
              <TabsContent value="mentorships" className="pt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Mentorias Vinculadas</h3>
                    
                    {selectedUser.mentorships && selectedUser.mentorships.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.mentorships.map((mentorship, index) => (
                          <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                            <div className="flex items-center">
                              <Award className="h-5 w-5 text-portal-primary mr-2" />
                              <p className="font-medium">{mentorship}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveMentorship(mentorship)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic mb-4">Nenhuma mentoria vinculada.</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Vincular Mentorias</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {AVAILABLE_MENTORSHIPS.filter(mentorship => 
                        !selectedUser.mentorships || !selectedUser.mentorships.includes(mentorship)
                      ).map((mentorship, index) => (
                        <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                          <p>{mentorship}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddMentorship(mentorship)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Bonuses Tab */}
              <TabsContent value="bonuses" className="pt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Bônus Vinculados</h3>
                    
                    {selectedUser.bonuses && selectedUser.bonuses.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.bonuses.map((bonus, index) => (
                          <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                            <div className="flex items-center">
                              <Gift className="h-5 w-5 text-portal-primary mr-2" />
                              <p className="font-medium">{bonus}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveBonus(bonus)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic mb-4">Nenhum bônus vinculado.</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Vincular Bônus</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {AVAILABLE_BONUSES.filter(bonus => 
                        !selectedUser.bonuses || !selectedUser.bonuses.includes(bonus)
                      ).map((bonus, index) => (
                        <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                          <p>{bonus}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddBonus(bonus)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Credits Tab */}
              <TabsContent value="credits" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-portal-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-muted-foreground">Status de Créditos</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span>Créditos disponíveis:</span>
                          <span className="font-bold text-lg">{selectedUser.credits}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Limite mensal:</span>
                          <span>{selectedUser.monthlyCredits} (renovados mensalmente)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-4">Gerenciar Créditos</h3>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddCreditDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adicionar Créditos
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      O usuário recebe {selectedUser.monthlyCredits} créditos por mês, renovados a cada virada de mês, sem acumulação.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseUserDetails}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Credits Dialog */}
      {showAddCreditDialog && selectedUser && (
        <Dialog open={showAddCreditDialog} onOpenChange={setShowAddCreditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Créditos</DialogTitle>
              <DialogDescription>
                Adicione créditos para {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="creditsToAdd">Quantidade de créditos</Label>
                <Input 
                  id="creditsToAdd" 
                  type="number" 
                  min="1"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddCreditDialog(false)}>Cancelar</Button>
              <Button onClick={handleAddCredits}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
