
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  User, 
  Users, 
  Package, 
  Award, 
  Calendar,
  Plus, 
  MessageSquare, 
  Trash2,
  Check,
  X,
  Store,
  FileText,
  Paperclip,
} from "lucide-react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Lista de estados brasileiros
const brazilianStates = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

// Lista de canais de venda
const salesChannels = ['Amazon', 'Meli', 'MGL', 'Shopee', 'Site', 'Outro'];

// Academia access options
const academyAccessOptions = ['Sim', 'Não', 'Sim START'];

// Communication channels
const communicationChannels = [
  'Telefone', 'Email', 'WhatsApp', 'Instagram', 'TikTok', 'Call', 
  'Pessoalmente', 'Evento', 'Outro'
];

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [viewingCommunication, setViewingCommunication] = useState(null);
  
  // Mock data
  const students = [
    { 
      id: 1, 
      name: "Ana Silva", 
      email: "ana@email.com", 
      phone: "(11) 98765-4321", 
      status: "Ativo", 
      products: ["Curso Básico", "Mentoria Individual"], 
      bonus: ["Acesso Clube VIP", "E-book Marketing Digital"],
      registrationDate: "2024-04-15",
      state: "São Paulo",
      academyAccess: "Sim",
      stores: [
        { id: 1, name: "Loja da Ana", channel: "Amazon" },
        { id: 2, name: "Ana Shop", channel: "Site" }
      ],
      partners: [
        { id: 1, name: "Carlos Mendes", email: "carlos@email.com", phone: "(11) 97777-8888", role: "Sócio Administrativo" }
      ]
    },
    { 
      id: 2, 
      name: "Carlos Oliveira", 
      email: "carlos@email.com", 
      phone: "(11) 91234-5678", 
      status: "Ativo", 
      products: ["Curso Avançado"], 
      bonus: [],
      registrationDate: "2024-03-20",
      state: "Rio de Janeiro",
      academyAccess: "Não",
      stores: [],
      partners: []
    },
    { 
      id: 3, 
      name: "Mariana Costa", 
      email: "mariana@email.com", 
      phone: "(11) 93333-4444", 
      status: "Ativo", 
      products: ["Mentoria em Grupo"], 
      bonus: ["Workshop Presencial"],
      registrationDate: "2024-02-10",
      state: "Minas Gerais",
      academyAccess: "Sim START",
      stores: [
        { id: 1, name: "Mari Store", channel: "Shopee" }
      ],
      partners: [
        { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 95555-6666", role: "Sócio Técnico" },
        { id: 2, name: "Paula Sousa", email: "paula@email.com", phone: "(11) 94444-3333", role: "Sócio Financeiro" }
      ]
    },
    { 
      id: 4, 
      name: "Pedro Santos", 
      email: "pedro@email.com", 
      phone: "(11) 95555-6666", 
      status: "Inativo", 
      products: ["Curso Básico", "Curso Avançado"], 
      bonus: ["Acesso Clube VIP"],
      registrationDate: "2023-11-05",
      state: "Paraná",
      academyAccess: "Não",
      stores: [
        { id: 1, name: "Pedro E-commerce", channel: "Meli" }
      ],
      partners: []
    },
  ];
  
  // Mock mentoring data
  const mentoringSessions = [
    { id: 1, date: "25/05/2025", time: "14:00", link: "meet.google.com/abc-defg-hij", status: "Agendada", type: "Individual" },
    { id: 2, date: "28/05/2025", time: "10:00", link: "meet.google.com/xyz-abcd-efg", status: "Concluída", type: "Grupo" },
    { id: 3, date: "02/06/2025", time: "16:30", link: "meet.google.com/123-456-789", status: "Agendada", type: "Individual" },
  ];
  
  // Mock communications
  const [communications, setCommunications] = useState([
    { id: 1, date: "10/05/2025", channel: "Email", subject: "Boas-vindas", content: "Mensagem de boas-vindas ao novo aluno. Conteúdo completo da comunicação aqui. Este é um exemplo de um texto mais longo que poderia ser incluído em uma comunicação com o aluno." },
    { id: 2, date: "12/05/2025", channel: "WhatsApp", subject: "Dúvida sobre curso", content: "O aluno teve dúvidas sobre o módulo 3 do curso básico. Foi orientado a assistir novamente às aulas 7 e 8, que cobrem o conteúdo onde ele está com dificuldade." },
  ]);
  
  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
  };
  
  const handleCloseStudent = () => {
    setSelectedStudent(null);
    setShowStoreForm(false);
    setShowPartnerForm(false);
    setShowCommunicationForm(false);
    setViewingCommunication(null);
  };
  
  const handleDeleteStudent = (studentId) => {
    // Em uma aplicação real, aqui você enviaria uma requisição para deletar o aluno
    // Como é um exemplo, apenas simulamos a remoção
    toast({
      title: "Aluno removido",
      description: "O aluno foi removido com sucesso.",
    });
    setDeleteConfirmOpen(false);
    setSelectedStudent(null);
  };

  // Formulários
  const storeFormSchema = z.object({
    name: z.string().min(1, "O nome da loja é obrigatório"),
    channel: z.string().min(1, "Selecione um canal de venda")
  });

  const storeForm = useForm({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      channel: ""
    }
  });

  const partnerFormSchema = z.object({
    name: z.string().min(1, "O nome do sócio é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    role: z.string().min(1, "Função é obrigatória")
  });

  const partnerForm = useForm({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: ""
    }
  });

  const communicationFormSchema = z.object({
    channel: z.string().min(1, "Selecione um canal"),
    subject: z.string().min(1, "Assunto é obrigatório"),
    content: z.string().min(1, "Conteúdo é obrigatório")
  });

  const communicationForm = useForm({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      channel: "",
      subject: "",
      content: ""
    }
  });

  const onSubmitStore = (data) => {
    if (selectedStudent) {
      // Em uma aplicação real, enviar para API
      toast({
        title: "Loja adicionada",
        description: `A loja ${data.name} foi adicionada com sucesso.`,
      });
      setShowStoreForm(false);
      storeForm.reset();
    }
  };

  const onSubmitPartner = (data) => {
    if (selectedStudent) {
      // Em uma aplicação real, enviar para API
      toast({
        title: "Sócio adicionado",
        description: `${data.name} foi adicionado como sócio.`,
      });
      setShowPartnerForm(false);
      partnerForm.reset();
    }
  };

  const onSubmitCommunication = (data) => {
    if (selectedStudent) {
      // Em uma aplicação real, enviar para API
      const newCommunication = {
        id: communications.length + 1,
        date: format(new Date(), "dd/MM/yyyy"),
        channel: data.channel,
        subject: data.subject,
        content: data.content
      };
      
      setCommunications([...communications, newCommunication]);
      
      toast({
        title: "Comunicação registrada",
        description: "A comunicação foi registrada com sucesso.",
      });
      setShowCommunicationForm(false);
      communicationForm.reset();
    }
  };

  const handleDeleteCommunication = (commId) => {
    setCommunications(communications.filter(comm => comm.id !== commId));
    setViewingCommunication(null);
    toast({
      title: "Comunicação removida",
      description: "A comunicação foi removida com sucesso.",
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Alunos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar um novo aluno.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Gerencie os alunos cadastrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>{student.products.join(", ")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenStudent(student)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes do aluno */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={handleCloseStudent}>
          <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="flex items-center">
                  <User className="mr-2" />
                  {selectedStudent.name}
                </DialogTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="text-red-500 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Aluno
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </DialogHeader>
            <div className="py-2 flex-grow overflow-y-auto">
              <Tabs defaultValue="details" className="h-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="details">Dados do Aluno</TabsTrigger>
                  <TabsTrigger value="communications">Comunicações</TabsTrigger>
                  <TabsTrigger value="products">Cursos Adquiridos</TabsTrigger>
                  <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
                  <TabsTrigger value="bonus">Bônus Adquiridos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="h-full overflow-y-auto">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                          <p className="mt-1 text-base">{selectedStudent.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedStudent.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedStudent.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <div className="mt-1 flex items-center space-x-2">
                            {selectedStudent.status === "Ativo" ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                            <span>{selectedStudent.status}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Data de Cadastro</h3>
                          <div className="mt-1 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{new Date(selectedStudent.registrationDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="mt-1 w-full text-left justify-start">
                                {selectedStudent.state || "Selecionar Estado"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-56 overflow-y-auto">
                              {brazilianStates.map((state) => (
                                <DropdownMenuItem key={state}>
                                  {state}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Tem acesso à Academia?</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="mt-1 w-full flex items-center justify-start">
                                {selectedStudent.academyAccess === "Sim" ? (
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                ) : selectedStudent.academyAccess === "Não" ? (
                                  <X className="h-4 w-4 mr-2 text-red-500" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2 text-blue-500" />
                                )}
                                {selectedStudent.academyAccess}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {academyAccessOptions.map((option) => (
                                <DropdownMenuItem key={option}>
                                  {option === "Sim" ? (
                                    <><Check className="h-4 w-4 mr-2 text-green-500" />{option}</>
                                  ) : option === "Não" ? (
                                    <><X className="h-4 w-4 mr-2 text-red-500" />{option}</>
                                  ) : (
                                    <><Check className="h-4 w-4 mr-2 text-blue-500" />{option}</>
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Lojas e Sócios em duas colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lojas do aluno */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-medium">Lojas</h3>
                            <Button 
                              size="sm" 
                              onClick={() => setShowStoreForm(!showStoreForm)}
                            >
                              <Store className="mr-2 h-4 w-4" />
                              Adicionar Loja
                            </Button>
                          </div>
                          
                          {showStoreForm && (
                            <Card className="mb-4">
                              <CardHeader className="p-3 pb-1">
                                <CardTitle className="text-base">Nova Loja</CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                <Form {...storeForm}>
                                  <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-3">
                                    <FormField
                                      control={storeForm.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nome da Loja</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Nome da loja" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={storeForm.control}
                                      name="channel"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Canal de Venda</FormLabel>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="outline" className="w-full justify-between">
                                                {field.value || "Selecione um canal"}
                                                <span className="sr-only">Toggle menu</span>
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                              {salesChannels.map((channel) => (
                                                <DropdownMenuItem
                                                  key={channel}
                                                  onClick={() => storeForm.setValue("channel", channel)}
                                                >
                                                  {channel}
                                                </DropdownMenuItem>
                                              ))}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setShowStoreForm(false);
                                          storeForm.reset();
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button type="submit" size="sm">Salvar</Button>
                                    </div>
                                  </form>
                                </Form>
                              </CardContent>
                            </Card>
                          )}
                          
                          <div className="max-h-[240px] overflow-y-auto">
                            {selectedStudent.stores && selectedStudent.stores.length > 0 ? (
                              <div className="space-y-2">
                                {selectedStudent.stores.map((store, index) => (
                                  <div key={index} className="flex items-center p-2 border rounded-md">
                                    <Store className="h-4 w-4 mr-2 text-portal-primary" />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{store.name}</p>
                                      <p className="text-xs text-gray-500">Canal: {store.channel}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-sm">Nenhuma loja cadastrada.</p>
                            )}
                          </div>
                        </div>

                        {/* Sócios do aluno */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-medium">Sócios</h3>
                            <Button 
                              size="sm" 
                              onClick={() => setShowPartnerForm(!showPartnerForm)}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Adicionar Sócio
                            </Button>
                          </div>
                          
                          {showPartnerForm && (
                            <Card className="mb-4">
                              <CardHeader className="p-3 pb-1">
                                <CardTitle className="text-base">Novo Sócio</CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                <Form {...partnerForm}>
                                  <form onSubmit={partnerForm.handleSubmit(onSubmitPartner)} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormField
                                        control={partnerForm.control}
                                        name="name"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={partnerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                              <Input placeholder="email@exemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormField
                                        control={partnerForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Telefone</FormLabel>
                                            <FormControl>
                                              <Input placeholder="(00) 00000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={partnerForm.control}
                                        name="role"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Função</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Ex: Sócio Administrativo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setShowPartnerForm(false);
                                          partnerForm.reset();
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button type="submit" size="sm">Salvar</Button>
                                    </div>
                                  </form>
                                </Form>
                              </CardContent>
                            </Card>
                          )}
                          
                          <div className="max-h-[240px] overflow-y-auto">
                            {selectedStudent.partners && selectedStudent.partners.length > 0 ? (
                              <div className="space-y-2">
                                {selectedStudent.partners.map((partner, index) => (
                                  <div key={index} className="p-2 border rounded-md">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-portal-primary" />
                                        <p className="font-medium text-sm">{partner.name}</p>
                                      </div>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                      </Button>
                                    </div>
                                    <div className="ml-6 mt-1 grid grid-cols-2 gap-1 text-xs">
                                      <p><strong>Email:</strong> {partner.email}</p>
                                      <p><strong>Telefone:</strong> {partner.phone}</p>
                                      <p className="col-span-2"><strong>Função:</strong> {partner.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-sm">Nenhum sócio cadastrado.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="communications" className="h-full overflow-y-auto">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Histórico de Comunicações</CardTitle>
                        <Button onClick={() => setShowCommunicationForm(true)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Nova Comunicação
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto">
                      {showCommunicationForm && (
                        <Card className="mb-4">
                          <CardHeader className="py-2">
                            <CardTitle className="text-base">Nova Comunicação</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Form {...communicationForm}>
                              <form onSubmit={communicationForm.handleSubmit(onSubmitCommunication)} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <FormField
                                    control={communicationForm.control}
                                    name="channel"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Canal</FormLabel>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                              {field.value || "Selecione um canal"}
                                              <span className="sr-only">Toggle menu</span>
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent className="w-full">
                                            {communicationChannels.map((channel) => (
                                              <DropdownMenuItem
                                                key={channel}
                                                onClick={() => communicationForm.setValue("channel", channel)}
                                              >
                                                {channel}
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={communicationForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Assunto</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Assunto da comunicação" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={communicationForm.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Conteúdo</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Detalhes da comunicação" 
                                          className="min-h-24"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div>
                                  <FormLabel>Anexos</FormLabel>
                                  <div className="mt-1 flex items-center justify-between rounded-md border border-dashed border-primary/50 px-3 py-2">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">Adicionar arquivos</span>
                                      <span className="text-xs text-gray-500">Arraste arquivos ou clique para selecionar</span>
                                    </div>
                                    <Button type="button" variant="outline" size="sm">
                                      <Paperclip className="mr-2 h-4 w-4" />
                                      Anexar
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setShowCommunicationForm(false);
                                      communicationForm.reset();
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button type="submit" size="sm">Salvar</Button>
                                </div>
                              </form>
                            </Form>
                          </CardContent>
                        </Card>
                      )}

                      {viewingCommunication && (
                        <Card className="mb-4">
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{viewingCommunication.subject}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteCommunication(viewingCommunication.id)}
                                className="text-red-500 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardDescription>
                              {viewingCommunication.channel} - {viewingCommunication.date}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="whitespace-pre-line text-sm">{viewingCommunication.content}</p>
                          </CardContent>
                          <div className="px-6 pb-3 pt-0">
                            <Button variant="outline" size="sm" onClick={() => setViewingCommunication(null)}>
                              Voltar para lista
                            </Button>
                          </div>
                        </Card>
                      )}

                      {!viewingCommunication && communications.length > 0 ? (
                        <div className="space-y-2">
                          {communications.map((comm) => (
                            <div 
                              key={comm.id} 
                              className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                              onClick={() => setViewingCommunication(comm)}
                            >
                              <FileText className="h-5 w-5 mr-3 text-portal-primary flex-shrink-0" />
                              <div className="flex-1 truncate">
                                <p className="font-medium">{comm.subject}</p>
                                <p className="text-sm text-gray-500">
                                  {comm.channel} - {comm.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !viewingCommunication && <p className="text-gray-500 italic text-sm">Nenhuma comunicação registrada.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="products" className="h-full overflow-y-auto">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Cursos Adquiridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedStudent.products.map((product, index) => (
                          <div key={index} className="flex items-center p-2 border rounded-md">
                            <Package className="h-5 w-5 mr-2 text-portal-primary" />
                            <span className="text-sm">{product}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Curso
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mentoring" className="h-full overflow-y-auto">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Mentorias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data</TableHead>
                              <TableHead>Horário</TableHead>
                              <TableHead>Link</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Tipo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mentoringSessions.map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.time}</TableCell>
                                <TableCell>
                                  <a href={`https://${session.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {session.link}
                                  </a>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    session.status === "Agendada" ? "bg-blue-100 text-blue-800" : 
                                    session.status === "Concluída" ? "bg-green-100 text-green-800" : 
                                    "bg-amber-100 text-amber-800"
                                  }`}>
                                    {session.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="flex items-center">
                                    {session.type === "Grupo" ? 
                                      <Users className="h-4 w-4 mr-1" /> : 
                                      <User className="h-4 w-4 mr-1" />
                                    }
                                    {session.type}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Agendar Mentoria
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="mr-2 h-4 w-4" />
                          Adicionar à Mentoria em Grupo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bonus" className="h-full overflow-y-auto">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Bônus Adquiridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.bonus && selectedStudent.bonus.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedStudent.bonus.map((bonusItem, index) => (
                            <div key={index} className="flex items-center p-2 border rounded-md">
                              <Award className="h-5 w-5 mr-2 text-amber-500" />
                              <span className="text-sm">{bonusItem}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">Nenhum bônus adquirido.</p>
                      )}
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Bônus
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseStudent}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Excluir Aluno</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O aluno será removido permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Deseja realmente excluir <strong>{selectedStudent?.name}</strong>?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteStudent(selectedStudent?.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
