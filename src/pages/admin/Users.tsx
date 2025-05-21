import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, MoreHorizontal, UserPlus, User, Mail, Phone, Calendar, HardDrive, Download, Filter, ArrowUp, ArrowDown, Save, Pencil, CreditCard, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { USERS } from "@/data/users";

// Schema de validação para o formulário de adicionar/editar usuário
const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  role: z.string(),
  status: z.string(),
  permissionGroupId: z.number().optional().nullable(),
  observations: z.string().optional()
});

// Schema para validação do formulário de créditos
const creditsFormSchema = z.object({
  amount: z.string().refine(value => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "O valor deve ser um número positivo"
  }),
  operation: z.enum(["add", "subtract"]),
  creditType: z.enum(["permanent", "monthly"])
});

// Credit transaction type
type CreditTransaction = {
  id: number;
  userId: number;
  amount: number;
  operation: "add" | "subtract";
  creditType: "permanent" | "monthly";
  date: Date;
  description: string;
};

// Configuração para reset mensal de créditos
const DEFAULT_CREDITS = 5;

type UserFormValues = z.infer<typeof userFormSchema>;
type CreditsFormValues = z.infer<typeof creditsFormSchema>;

const Users = () => {
  const { permissionGroups } = usePermissionGroups();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [permissionGroupFilter, setPermissionGroupFilter] = useState("all");
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  
  // Filter users based on search query, status filter, and permission group filter
  const filteredUsers = useMemo(() => {
    return USERS.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesPermissionGroup = 
        permissionGroupFilter === "all" || 
        (user.permissionGroupId?.toString() === permissionGroupFilter) ||
        (permissionGroupFilter === "none" && !user.permissionGroupId);
      return matchesSearch && matchesStatus && matchesPermissionGroup;
    });
  }, [searchQuery, statusFilter, permissionGroupFilter]);
  
  // Sort users by name
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [filteredUsers, sortDirection]);

  // Get permission group name by ID
  const getPermissionGroupName = (groupId) => {
    if (!groupId) return "Nenhum";
    const group = permissionGroups.find(g => g.id === groupId);
    return group ? group.name : "Desconhecido";
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sort toggle
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
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
    // Find user by ID
    const userToUpdate = USERS.find(user => user.id === userId);
    if (userToUpdate) {
      // Increase storage limit by 100MB
      userToUpdate.storageLimit += 100;
      // Update the storage string representation
      userToUpdate.storage = `${userToUpdate.storageValue}MB / ${userToUpdate.storageLimit}MB`;
      
      // If using selectedUser to display details, update it too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          storageLimit: userToUpdate.storageLimit,
          storage: userToUpdate.storage
        });
      }
      
      toast({
        title: "Armazenamento aumentado",
        description: `O limite de armazenamento de ${userName} foi aumentado em 100MB para ${userToUpdate.storageLimit}MB.`
      });
      
      console.log(`Storage limit for user ${userId} increased to ${userToUpdate.storageLimit}MB`);
    }
  };

  const handleDecreaseStorage = (userId, userName) => {
    // Find user by ID
    const userToUpdate = USERS.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.storageLimit > 100) {
      // Prevent reducing below 100MB
      userToUpdate.storageLimit -= 100;
      // Update the storage string representation
      userToUpdate.storage = `${userToUpdate.storageValue}MB / ${userToUpdate.storageLimit}MB`;
      
      // If using selectedUser to display details, update it too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          storageLimit: userToUpdate.storageLimit,
          storage: userToUpdate.storage
        });
      }
      
      toast({
        title: "Armazenamento reduzido",
        description: `O limite de armazenamento de ${userName} foi reduzido em 100MB para ${userToUpdate.storageLimit}MB.`
      });
      
      console.log(`Storage limit for user ${userId} decreased to ${userToUpdate.storageLimit}MB`);
    } else {
      toast({
        title: "Operação não permitida",
        description: "O limite mínimo de armazenamento é de 100MB.",
        variant: "destructive"
      });
      
      console.log(`Cannot decrease storage limit for user ${userId} below 100MB`);
    }
  };
  
  const handleSendMagicLink = (userId, userName) => {
    toast({
      title: "Link mágico enviado",
      description: `Um link de acesso direto foi enviado para ${userName}.`
    });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsEditingUserInfo(false);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setIsEditingUserInfo(false);
    setShowCreditsDialog(false);
  };

  const handleSaveUserInfo = (data) => {
    toast({
      title: "Informações salvas",
      description: "As informações do usuário foram atualizadas com sucesso."
    });
    setIsEditingUserInfo(false);
    
    // In a real app, update user data in the database
    console.log("Updated user data:", data);
  };
  
  // Formulário para adicionar/editar créditos
  const creditsForm = useForm<CreditsFormValues>({
    resolver: zodResolver(creditsFormSchema),
    defaultValues: {
      amount: "",
      operation: "add",
      creditType: "permanent"
    }
  });

  // Handle credit management with new permanent and monthly credit separation
  const handleManageCredits = (data: CreditsFormValues) => {
    const amount = parseInt(data.amount);
    const operation = data.operation;
    const creditType = data.creditType;
    
    if (selectedUser) {
      // Find user by ID
      const userToUpdate = USERS.find(user => user.id === selectedUser.id);
      
      if (userToUpdate) {
        let message = "";
        const transactionDate = new Date();
        
        if (operation === "add") {
          if (creditType === "permanent") {
            userToUpdate.permanentCredits += amount;
            message = `Adicionado ${amount} créditos permanentes para ${selectedUser.name}`;
          } else {
            userToUpdate.monthlyCredits += amount;
            message = `Adicionado ${amount} créditos mensais para ${selectedUser.name}`;
          }
        } else {
          if (creditType === "permanent") {
            if (userToUpdate.permanentCredits >= amount) {
              userToUpdate.permanentCredits -= amount;
              message = `Removido ${amount} créditos permanentes de ${selectedUser.name}`;
            } else {
              toast({
                title: "Operação não permitida",
                description: "O usuário não possui créditos permanentes suficientes para essa operação.",
                variant: "destructive"
              });
              return;
            }
          } else {
            if (userToUpdate.monthlyCredits >= amount) {
              userToUpdate.monthlyCredits -= amount;
              message = `Removido ${amount} créditos mensais de ${selectedUser.name}`;
            } else {
              toast({
                title: "Operação não permitida",
                description: "O usuário não possui créditos mensais suficientes para essa operação.",
                variant: "destructive"
              });
              return;
            }
          }
        }
        
        // Update total credits
        userToUpdate.totalCredits = userToUpdate.monthlyCredits + userToUpdate.permanentCredits;
        
        // Create transaction record
        const newTransaction: CreditTransaction = {
          id: Date.now(),
          userId: userToUpdate.id,
          amount,
          operation,
          creditType,
          date: transactionDate,
          description: message
        };
        
        // Add to transaction history
        setCreditHistory(prev => [newTransaction, ...prev]);
        
        // If using selectedUser to display details, update it too
        if (selectedUser && selectedUser.id === userToUpdate.id) {
          setSelectedUser({
            ...selectedUser,
            monthlyCredits: userToUpdate.monthlyCredits,
            permanentCredits: userToUpdate.permanentCredits,
            totalCredits: userToUpdate.totalCredits
          });
        }
        
        toast({
          title: "Créditos atualizados",
          description: message
        });
        
        // Log the operation
        console.log("Credits operation:", { 
          userId: selectedUser.id, 
          operation, 
          amount,
          creditType,
          monthlyCredits: userToUpdate.monthlyCredits,
          permanentCredits: userToUpdate.permanentCredits,
          totalCredits: userToUpdate.totalCredits
        });
        
        // Close the dialog
        setShowCreditsDialog(false);
        creditsForm.reset();
      }
    }
  };
  
  // Formulário para adicionar novo usuário
  const addUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Usuário",
      status: "Pendente",
      permissionGroupId: null,
      observations: ""
    }
  });

  // Watch role value to determine if permissionGroupId is required
  const roleValue = addUserForm.watch("role");
  const isPermissionGroupRequired = roleValue !== "Admin";

  // Formulário para editar usuário existente
  const editUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      phone: selectedUser?.phone || "",
      role: selectedUser?.role || "Usuário",
      status: selectedUser?.status || "Ativo",
      permissionGroupId: selectedUser?.permissionGroupId || null,
      observations: selectedUser?.observations || ""
    }
  });

  // Reset form values when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      editUserForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
        status: selectedUser.status,
        permissionGroupId: selectedUser.permissionGroupId,
        observations: selectedUser.observations || ""
      });
    }
  }, [selectedUser, editUserForm]);

  // Updated to add default monthly credits for new users and required permission group
  const handleAddUser = (data: UserFormValues) => {
    // Verificar se o grupo de permissão é obrigatório
    if (data.role !== "Admin" && !data.permissionGroupId) {
      toast({
        title: "Erro ao adicionar usuário",
        description: "Grupo de permissão é obrigatório para usuários não administradores",
        variant: "destructive"
      });
      return;
    }
    
    // No mundo real, adicionaríamos o usuário ao banco de dados
    const newUserData = {
      ...data,
      monthlyCredits: DEFAULT_CREDITS, // Define 5 créditos mensais iniciais para novos usuários
      permanentCredits: 0, // Inicialmente sem créditos permanentes
      totalCredits: DEFAULT_CREDITS // Total inicial de créditos
    };
    
    console.log("New user data:", newUserData);
    
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${data.name} foi adicionado com sucesso com ${DEFAULT_CREDITS} créditos mensais iniciais.`
    });
    
    setShowAddUserDialog(false);
    addUserForm.reset();
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to max pages to show
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate start and end pages to show
      if (currentPage <= 3) {
        items.push(
          ...[2, 3, 4].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        if (totalPages > 4) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          ...[totalPages - 3, totalPages - 2, totalPages - 1].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
      } else {
        items.push(
          <PaginationItem key="ellipsis3">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          ...[currentPage - 1, currentPage, currentPage + 1].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        items.push(
          <PaginationItem key="ellipsis4">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };
  
  // Export users to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "ID,Nome,Função,Status,Último Login,Data de Cadastro\n";

    // Add data rows
    sortedUsers.forEach(user => {
      csvContent += `${user.id},"${user.name}","${user.role}","${user.status}","${user.lastLogin}","${user.registrationDate}"\n`;
    });

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os dados dos usuários foram exportados com sucesso."
    });
  };
  
  // Simulate storage usage monitoring function
  const monitorStorageUsage = (userId, fileSize) => {
    // This function would be called when a user uploads a file
    const userToUpdate = USERS.find(user => user.id === userId);
    
    if (userToUpdate) {
      // Update storage value
      const newStorageValue = userToUpdate.storageValue + fileSize;
      userToUpdate.storageValue = newStorageValue;
      userToUpdate.storage = `${newStorageValue}MB / ${userToUpdate.storageLimit}MB`;
      
      // Check if storage limit is exceeded
      if (newStorageValue > userToUpdate.storageLimit) {
        console.log(`User ${userId} has exceeded their storage limit!`);
        toast({
          title: "Limite de armazenamento excedido",
          description: `O usuário ${userToUpdate.name} excedeu o limite de armazenamento de ${userToUpdate.storageLimit}MB.`,
          variant: "destructive"
        });
        
        // Here you would implement logic to handle the exceeded storage
        // For example, prevent further uploads or notify admins
      }
      
      // If using selectedUser to display details, update it too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          storageValue: newStorageValue,
          storage: userToUpdate.storage
        });
      }
      
      console.log(`Storage usage for user ${userId} updated to ${newStorageValue}MB`);
    }
  };
  
  // Function to demonstrate usage of the monitoring
  const handleTestUpload = () => {
    if (selectedUser) {
      // Simulate a 5MB file upload for the selected user
      monitorStorageUsage(selectedUser.id, 5);
      
      toast({
        title: "Upload simulado",
        description: `Um upload de teste de 5MB foi processado para ${selectedUser.name}.`
      });
    }
  };

  // Updated to display both monthly and permanent credits
  const renderCreditTabContent = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Créditos do Usuário</h3>
            <p className="text-sm text-muted-foreground">
              Os créditos mensais são renovados para {DEFAULT_CREDITS} no início de cada mês e não são acumuláveis.
              Os créditos permanentes não expiram.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm text-muted-foreground block">Créditos Mensais</span>
              <span className="text-2xl font-bold text-portal-primary block">{selectedUser.monthlyCredits}</span>
              <span className="text-xs text-muted-foreground">Expiram no fim do mês</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm text-muted-foreground block">Créditos Permanentes</span>
              <span className="text-2xl font-bold text-green-600 block">{selectedUser.permanentCredits}</span>
              <span className="text-xs text-muted-foreground">Não expiram</span>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold">Gerenciar Créditos</h3>
            <Button 
              size="sm" 
              onClick={() => setShowCreditsDialog(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Adicionar/Remover Créditos
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Histórico de Créditos</h4>
            {creditHistory.filter(tx => tx.userId === selectedUser.id).length > 0 ? (
              <div className="max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {creditHistory
                    .filter(tx => tx.userId === selectedUser.id)
                    .map(tx => (
                      <li key={tx.id} className="text-sm border-b pb-2">
                        <div className="flex justify-between items-center">
                          <span className={tx.operation === "add" ? "text-green-600" : "text-red-600"}>
                            {tx.operation === "add" ? "+" : "-"}{tx.amount} {tx.creditType === "permanent" ? "permanentes" : "mensais"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {tx.date.toLocaleDateString()} {tx.date.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{tx.description}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma transação de crédito registrada ainda.
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-1">Sobre os Créditos</h4>
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Créditos Mensais:</span> Todos os usuários recebem {DEFAULT_CREDITS} créditos no início de cada mês. 
            Créditos mensais não utilizados não são acumulados para o próximo mês.
            <br /><br />
            <span className="font-medium">Créditos Permanentes:</span> Estes créditos são adicionados manualmente e não expiram.
            São consumidos somente após o esgotamento dos créditos mensais.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gestão de Usuários</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Usuários</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={permissionGroupFilter} onValueChange={setPermissionGroupFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Grupos</SelectItem>
                    <SelectItem value="none">Sem Grupo</SelectItem>
                    {permissionGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={toggleSort}>
                    Nome
                    {sortDirection === "asc" ? (
                      <ArrowUp className="inline-block ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grupo de Permissão</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Data de Cadastro
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Administrador" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Ativo" ? "default" : user.status === "Pendente" ? "secondary" : "outline"}
                        className={
                          user.status === "Ativo" 
                            ? "bg-green-500" 
                            : user.status === "Pendente" 
                              ? "bg-yellow-500" 
                              : "bg-gray-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "Admin" ? (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      ) : (
                        <span>{getPermissionGroupName(user.permissionGroupId)}</span>
                      )}
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleUserClick(user)}>
                            Ver detalhes
                          </DropdownMenuItem>
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
                
                {currentItems.length === 0 && (
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
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Exibindo {currentItems.length} de {filteredUsers.length} usuários
            </p>
            <Select value={String(itemsPerPage)} onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="25 por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
                <SelectItem value="200">200 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário no sistema. O usuário receberá {DEFAULT_CREDITS} créditos mensais iniciais.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Administrador</SelectItem>
                        <SelectItem value="Usuário">Aluno</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isPermissionGroupRequired && (
                <FormField
                  control={addUserForm.control}
                  name="permissionGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Permissão *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo de permissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {permissionGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={addUserForm.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre o usuário (opcional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Usuário
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="storage">Armazenamento</TabsTrigger>
                <TabsTrigger value="credits">Créditos</TabsTrigger>
              </TabsList>
              
              {/* User Info Tab */}
              <TabsContent value="info" className="pt-4">
                {isEditingUserInfo ? (
                  <Form {...editUserForm}>
                    <form onSubmit={editUserForm.handleSubmit(handleSaveUserInfo)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={editUserForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editUserForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={editUserForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Função *</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Admin">Administrador</SelectItem>
                                    <SelectItem value="Usuário">Aluno</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editUserForm.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status *</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {editUserForm.watch("role") !== "Admin" && (
                        <FormField
                          control={editUserForm.control}
                          name="permissionGroupId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grupo de Permissão *</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(Number(value))}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um grupo de permissão" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {permissionGroups.map((group) => (
                                    <SelectItem key={group.id} value={group.id.toString()}>
                                      {group.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={editUserForm.control}
                        name="observations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observações sobre o usuário (opcional)"
                                className="resize-none h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditingUserInfo(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <>
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
                              variant={selectedUser.status === "Ativo" ? "default" : selectedUser.status === "Pendente" ? "secondary" : "outline"}
                              className={
                                selectedUser.status === "Ativo" 
                                  ? "bg-green-500" 
                                  : selectedUser.status === "Pendente" 
                                    ? "bg-yellow-500" 
                                    : "bg-gray-500"
                              }
                            >
                              {selectedUser.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Função</h3>
                          <Badge variant={selectedUser.role === "Administrador" ? "default" : "outline"}>
                            {selectedUser.role}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Último Acesso</h3>
                          <p>{selectedUser.lastLogin}</p>
                        </div>
                        
                        {selectedUser.role !== "Admin" && (
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Grupo de Permissão</h3>
                            <p>{getPermissionGroupName(selectedUser.permissionGroupId)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">Observações</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditingUserInfo(true)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                        {selectedUser.observations ? (
                          <p>{selectedUser.observations}</p>
                        ) : (
                          <p className="text-muted-foreground italic">Sem observações.</p>
                        )}
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status, selectedUser.name)}
                        >
                          {selectedUser.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDecreaseStorage(selectedUser.id, selectedUser.name)}
                        disabled={selectedUser.storageLimit <= 100}
                      >
                        <ArrowDown className="h-4 w-4 mr-1" /> Reduzir 100MB
                      </Button>
                      <div className="text-sm font-medium flex items-center">
                        Limite atual: {selectedUser.storageLimit}MB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIncreaseStorage(selectedUser.id, selectedUser.name)}
                      >
                        <ArrowUp className="h-4 w-4 mr-1" /> Aumentar 100MB
                      </Button>
                      
                      {/* For testing purposes only - could be removed in production */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestUpload}
                      >
                        <Download className="h-4 w-4 mr-1" /> Simular Upload (5MB)
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
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-1">Monitoramento de Armazenamento</h4>
                    <p className="text-sm text-blue-700">
                      O sistema monitora automaticamente cada upload, ajustando o uso de armazenamento em tempo real. 
                      Quando um usuário se aproximar do limite, ele receberá uma notificação.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Credits Tab */}
              <TabsContent value="credits" className="pt-4">
                {renderCreditTabContent()}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseUserDetails}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Credits Dialog - Updated for permanent and monthly credits */}
      {selectedUser && (
        <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gerenciar Créditos</DialogTitle>
              <DialogDescription>
                Adicione ou remova créditos para {selectedUser.name}.
                <p className="text-xs text-muted-foreground mt-2">
                  Nota: Os créditos mensais são renovados para {DEFAULT_CREDITS} no início de cada mês e não são acumuláveis. Créditos permanentes não expiram.
                </p>
              </DialogDescription>
            </DialogHeader>
            
            <Form {...creditsForm}>
              <form onSubmit={creditsForm.handleSubmit(handleManageCredits)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md mb-4">
                  <div>
                    <h3 className="text-sm font-medium">Créditos Mensais</h3>
                    <p className="text-2xl font-bold text-portal-primary">{selectedUser.monthlyCredits}</p>
                    <p className="text-xs text-muted-foreground">Expiram fim do mês</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Créditos Permanentes</h3>
                    <p className="text-2xl font-bold text-green-600">{selectedUser.permanentCredits}</p>
                    <p className="text-xs text-muted-foreground">Não expiram</p>
                  </div>
                </div>
                
                <FormField
                  control={creditsForm.control}
                  name="operation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operação</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === "add" ? "default" : "outline"}
                          className={field.value === "add" ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => field.onChange("add")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "subtract" ? "default" : "outline"}
                          className={field.value === "subtract" ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => field.onChange("subtract")}
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={creditsForm.control}
                  name="creditType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Crédito</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de crédito" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="permanent">Créditos Permanentes (não expiram)</SelectItem>
                          <SelectItem value="monthly">Créditos Mensais (expiram fim do mês)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={creditsForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Créditos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Quantidade" 
                          min="1" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreditsDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Confirmar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
