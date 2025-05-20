import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, User, Package, Calendar, MessageSquare, MoreVertical, Users, Search, Settings, Trash2, Move, MoveHorizontal, X, ArrowLeft, ArrowRight, Save, Edit } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface para a tipagem das colunas e leads
interface Column {
  id: string;
  name: string;
  color: string;
}
interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
}
interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  column: string;
  responsible: string;
  lastContact: string;
  comments: Comment[];
}

// Componente para o card do lead com funcionalidade de arrastar
const SortableLeadCard = ({
  lead,
  openLeadDetails
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `lead-${lead.id}`,
    data: {
      type: 'lead',
      lead
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <Card className="cursor-pointer hover:shadow-md" onClick={() => openLeadDetails(lead)}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-base">{lead.name}</h4>
              <p className="text-sm text-gray-600">{lead.company}</p>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Responsável:</span> {lead.responsible}</p>
                  <p><span className="font-medium">Último contato:</span> {lead.lastContact}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {lead.responsible}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};

// Componente para a coluna do kanban com funcionalidade de arrastar
const SortableColumn = ({
  column,
  children,
  leadCount
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };
  return <div ref={setNodeRef} style={style} className="flex flex-col">
      <div className={`px-3 py-2 rounded-t-md ${column.color} border-b`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MoveHorizontal className="h-4 w-4 mr-2 cursor-grab" {...attributes} {...listeners} />
            <h3 className="font-medium">{column.name}</h3>
          </div>
          <span className="text-sm bg-white px-2 py-1 rounded-full">
            {leadCount}
          </span>
        </div>
      </div>
      
      <div className={`flex-1 p-2 bg-gray-50 rounded-b-md border border-t-0 min-h-[500px]`}>
        {children}
      </div>
    </div>;
};

// Componente de item de coluna ordenável para o menu de gerenciamento
const SortableColumnListItem = ({
  column,
  leadCount,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const
  };
  return <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border cursor-grab mb-2" {...attributes} {...listeners}>
      <div className="flex items-center">
        <Move className="h-4 w-4 mr-3 cursor-grab" />
        <span>{column.name}</span>
        <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">{leadCount}</span>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={e => e.stopPropagation()}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir coluna</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a coluna "{column.name}"? Todos os leads desta coluna serão movidos para a primeira coluna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onRemove(column)} className="bg-red-500 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

// Componente de página CRM
const CRM = () => {
  const {
    toast
  } = useToast();

  // Estados para controlar as colunas e leads
  const [columns, setColumns] = useState<Column[]>([{
    id: "lead-in",
    name: "Lead In",
    color: "kanban-blue"
  }, {
    id: "presentation",
    name: "Call Apresentação",
    color: "kanban-purple"
  }, {
    id: "meeting",
    name: "Reunião",
    color: "kanban-amber"
  }, {
    id: "follow-up",
    name: "Acompanhamento",
    color: "kanban-green"
  }, {
    id: "closed",
    name: "Fechado",
    color: "kanban-gray"
  }]);
  const [originalColumns, setOriginalColumns] = useState<Column[]>([]);
  const [columnsModified, setColumnsModified] = useState(false);

  // Lista de administradores (simulado - em um sistema real viria do backend)
  const administrators = [{
    id: 1,
    name: "Ana Carolina"
  }, {
    id: 2,
    name: "Pedro Santos"
  }, {
    id: 3,
    name: "João Silva"
  }];

  // Estado para os leads
  const [leads, setLeads] = useState<Lead[]>([{
    id: 1,
    name: "João Silva",
    company: "TechSolutions",
    email: "joao@techsolutions.com",
    phone: "(11) 98765-4321",
    column: "lead-in",
    responsible: "Ana Carolina",
    lastContact: "21/05/2025",
    comments: [{
      id: 1,
      text: "Cliente interessado no curso avançado",
      date: "20/05/2025",
      author: "Ana Carolina"
    }]
  }, {
    id: 2,
    name: "Maria Oliveira",
    company: "E-commerce Brasil",
    email: "maria@ecommercebrasil.com",
    phone: "(11) 91234-5678",
    column: "presentation",
    responsible: "Pedro Santos",
    lastContact: "18/05/2025",
    comments: []
  }, {
    id: 3,
    name: "Carlos Mendes",
    company: "Loja Virtual",
    email: "carlos@lojavirtual.com",
    phone: "(11) 93333-4444",
    column: "meeting",
    responsible: "Ana Carolina",
    lastContact: "15/05/2025",
    comments: []
  }, {
    id: 4,
    name: "Amanda Costa",
    company: "Moda Online",
    email: "amanda@modaonline.com",
    phone: "(11) 95555-6666",
    column: "follow-up",
    responsible: "Pedro Santos",
    lastContact: "12/05/2025",
    comments: []
  }, {
    id: 5,
    name: "Roberto Almeida",
    company: "Super Digital",
    email: "roberto@superdigital.com",
    phone: "(11) 97777-8888",
    column: "closed",
    responsible: "Ana Carolina",
    lastContact: "08/05/2025",
    comments: []
  }]);

  // Estado para o formulário de edição do lead
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  // Load columns from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem('crmColumns');
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        setColumns(parsedColumns);
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
  }, []);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeView, setActiveView] = useState("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingColumns, setIsEditingColumns] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // Form para novo lead
  const newLeadForm = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      responsible: ""
    }
  });

  // Form para editar lead
  const editLeadForm = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      responsible: ""
    }
  });

  // Efeito para preencher o formulário de edição quando um lead é selecionado
  useEffect(() => {
    if (leadToEdit) {
      editLeadForm.reset({
        name: leadToEdit.name,
        company: leadToEdit.company,
        email: leadToEdit.email,
        phone: leadToEdit.phone,
        responsible: leadToEdit.responsible
      });
    }
  }, [leadToEdit, editLeadForm]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Configuração dos sensores para o drag and drop
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }));

  // Função para filtrar leads com base na consulta de busca
  const filteredLeads = leads.filter(lead => lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.company.toLowerCase().includes(searchQuery.toLowerCase()) || lead.responsible.toLowerCase().includes(searchQuery.toLowerCase()));

  // Função para abrir os detalhes de um lead
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  // Função para adicionar uma nova coluna
  const addColumn = () => {
    if (!newColumnName.trim()) return;
    const newColumnId = `column-${Date.now()}`;
    const colors = ["kanban-blue", "kanban-purple", "kanban-amber", "kanban-green", "kanban-gray", "kanban-pink", "kanban-indigo"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const updatedColumns = [...columns, {
      id: newColumnId,
      name: newColumnName,
      color: randomColor
    }];
    setColumns(updatedColumns);
    setColumnsModified(true);
    setNewColumnName("");
  };

  // Função para remover uma coluna
  const removeColumn = (column: Column) => {
    // Mover todos os leads dessa coluna para a primeira coluna
    const firstColumnId = columns[0].id;
    const updatedLeads = leads.map(lead => lead.column === column.id ? {
      ...lead,
      column: firstColumnId
    } : lead);
    setLeads(updatedLeads);
    const updatedColumns = columns.filter(col => col.id !== column.id);
    setColumns(updatedColumns);
    setColumnsModified(true);
  };

  // Função para lidar com o término do arrastar e soltar
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (!over) return;

    // Lidar com a movimentação de leads entre colunas
    if (active.data.current?.type === 'lead' && over.data.current?.type === 'column') {
      const leadId = parseInt(active.id.toString().split('-')[1]);
      const targetColumn = over.data.current.column.id;
      setLeads(prev => prev.map(lead => lead.id === leadId ? {
        ...lead,
        column: targetColumn
      } : lead));
    }
    // Lidar com a reordenação de colunas
    else if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);
      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);

        // Save to localStorage
        localStorage.setItem('crmColumns', JSON.stringify(newColumns));
      }
    }
  };

  // Função para lidar com o reordenamento das colunas na modal de gerenciamento
  const handleColumnReorder = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = columns.findIndex(col => col.id === active.id);
    const newIndex = columns.findIndex(col => col.id === over.id);
    if (oldIndex !== newIndex) {
      console.log(`Reordenando coluna de ${oldIndex} para ${newIndex}`);
      const updatedColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(updatedColumns);
      setColumnsModified(true);
    }
  };

  // Função para salvar as alterações nas colunas
  const saveColumnChanges = () => {
    setOriginalColumns(columns);
    setColumnsModified(false);
    setIsEditingColumns(false);

    // Save to localStorage
    localStorage.setItem('crmColumns', JSON.stringify(columns));
    toast({
      title: "Colunas salvas com sucesso",
      description: "As alterações nas colunas foram salvas.",
      duration: 3000
    });
  };

  // Iniciar edição de colunas
  const startEditingColumns = () => {
    setOriginalColumns([...columns]);
    setIsEditingColumns(true);
  };

  // Cancelar edição de colunas
  const cancelEditingColumns = () => {
    if (columnsModified) {
      setColumns(originalColumns);
      setColumnsModified(false);
    }
    setIsEditingColumns(false);
  };

  // Formulário para adicionar comentário
  const commentForm = useForm();

  // Função para adicionar novo comentário
  const addComment = (commentText: string) => {
    if (!selectedLead || !commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      text: commentText,
      date: new Date().toLocaleDateString(),
      author: "Usuário"
    };
    setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? {
      ...lead,
      comments: [newComment, ...lead.comments]
    } : lead));
    setSelectedLead(prev => prev ? {
      ...prev,
      comments: [newComment, ...prev.comments]
    } : null);
    commentForm.reset();
  };

  // Função para mover um lead para outra coluna
  const moveLead = (leadId: number, targetColumn: string) => {
    setLeads(leads.map(lead => lead.id === leadId ? {
      ...lead,
      column: targetColumn
    } : lead));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        column: targetColumn
      });
    }
  };

  // Função para abrir a edição de um lead
  const openLeadEditForm = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditingLead(true);
  };

  // Função para adicionar um novo lead
  const handleAddNewLead = data => {
    const newLead: Lead = {
      id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      column: "lead-in",
      // Definindo automaticamente como "Lead In"
      responsible: data.responsible,
      lastContact: new Date().toLocaleDateString(),
      comments: []
    };
    setLeads([...leads, newLead]);
    newLeadForm.reset();
    toast({
      title: "Lead adicionado",
      description: `O lead ${data.name} foi adicionado com sucesso.`
    });
  };

  // Função para salvar a edição de um lead
  const handleSaveLeadEdit = data => {
    if (!leadToEdit) return;
    const updatedLeads = leads.map(lead => lead.id === leadToEdit.id ? {
      ...lead,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      responsible: data.responsible
    } : lead);
    setLeads(updatedLeads);

    // Se o lead editado for o mesmo que está selecionado, atualize também o selectedLead
    if (selectedLead && selectedLead.id === leadToEdit.id) {
      setSelectedLead({
        ...selectedLead,
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        responsible: data.responsible
      });
    }
    setIsEditingLead(false);
    setLeadToEdit(null);
    toast({
      title: "Lead atualizado",
      description: `O lead ${data.name} foi atualizado com sucesso.`
    });
  };
  return <div className="container mx-auto py-0">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-portal-dark mb-4">CRM / Gestão de Leads</h1>
        <div className="flex gap-2 justify-start">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 hover:bg-neutral-800">
                <Plus className="mr-2 h-4 w-4" /> Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Lead</DialogTitle>
              </DialogHeader>
              <form onSubmit={newLeadForm.handleSubmit(handleAddNewLead)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <Input id="name" {...newLeadForm.register('name', {
                    required: true
                  })} placeholder="Nome do lead" />
                  </div>
                  
                  <div className="grid gap-2">
                    <FormLabel htmlFor="company">Empresa</FormLabel>
                    <Input id="company" {...newLeadForm.register('company', {
                    required: true
                  })} placeholder="Nome da empresa" />
                  </div>
                  
                  <div className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" type="email" {...newLeadForm.register('email', {
                    required: true
                  })} placeholder="Email do contato" />
                  </div>
                  
                  <div className="grid gap-2">
                    <FormLabel htmlFor="phone">Telefone</FormLabel>
                    <Input id="phone" {...newLeadForm.register('phone')} placeholder="Telefone do contato" />
                  </div>
                  
                  <div className="grid gap-2">
                    <FormLabel htmlFor="responsible">Responsável</FormLabel>
                    <Select onValueChange={value => newLeadForm.setValue('responsible', value)} defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {administrators.map(admin => <SelectItem key={admin.id} value={admin.name}>
                            {admin.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Sheet open={isEditingColumns} onOpenChange={columnsModified ? undefined : setIsEditingColumns}>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={startEditingColumns}>
                <Settings className="mr-2 h-4 w-4" /> Colunas
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Gerenciar Colunas</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Adicionar Nova Coluna</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Nome da coluna" value={newColumnName} onChange={e => setNewColumnName(e.target.value)} />
                    <Button onClick={addColumn}>Adicionar</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Ordenar e Excluir Colunas</h3>
                  <p className="text-sm text-muted-foreground">Arraste para reordenar ou clique no ícone de lixeira para excluir.</p>
                  
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleColumnReorder}>
                    <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {columns.map(column => {
                        const leadCount = leads.filter(lead => lead.column === column.id).length;
                        return <SortableColumnListItem key={column.id} column={column} leadCount={leadCount} onRemove={removeColumn} />;
                      })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
              <SheetFooter className="flex flex-row justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={cancelEditingColumns}>Cancelar</Button>
                <Button onClick={saveColumnChanges} className="flex gap-2">
                  <Save size={16} />
                  Salvar
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="sticky top-0 z-20 bg-white">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <CardTitle className="text-2xl font-medium">Gestão de Leads</CardTitle>
                <CardDescription>
                  Acompanhe o progresso dos seus leads no pipeline de vendas.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center w-full">
              <div className="flex items-center gap-3">
                <div className="flex space-x-2">
                  <Button variant={activeView === "kanban" ? "default" : "outline"} onClick={() => setActiveView("kanban")} size="sm">
                    Kanban
                  </Button>
                  <Button variant={activeView === "list" ? "default" : "outline"} onClick={() => setActiveView("list")} size="sm">
                    Lista
                  </Button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Buscar leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeView === "kanban" ? <div className="relative">
              <div className="sticky top-12 z-10 bg-white border-b p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {filteredLeads.length} leads encontrados
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div ref={scrollContainerRef} className="overflow-x-auto pb-4" style={{
              maxWidth: '100%'
            }}>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="flex space-x-4" style={{
                  minWidth: 'max-content'
                }}>
                      <SortableContext items={columns.map(col => col.id)}>
                        {columns.map(column => {
                      const columnLeads = filteredLeads.filter(lead => lead.column === column.id);
                      return <div key={column.id} className="w-[280px]">
                              <SortableColumn column={column} leadCount={columnLeads.length}>
                                <SortableContext items={columnLeads.map(lead => `lead-${lead.id}`)}>
                                  {columnLeads.map(lead => <SortableLeadCard key={lead.id} lead={lead} openLeadDetails={openLeadDetails} />)}
                                </SortableContext>
                              </SortableColumn>
                            </div>;
                    })}
                      </SortableContext>
                    </div>
                  </DndContext>
                </div>
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                  <Button variant="outline" size="icon" className="rounded-full bg-white shadow-md" onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                  });
                }
              }}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <Button variant="outline" size="icon" className="rounded-full bg-white shadow-md" onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                  });
                }
              }}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div> : <div>
              <div className="sticky top-0 z-10 bg-white border-b p-4">
                <div className="mb-4 w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Nome</th>
                          <th className="px-4 py-2 text-left">Empresa</th>
                          <th className="px-4 py-2 text-left">Responsável</th>
                          <th className="px-4 py-2 text-left">Estágio</th>
                          <th className="px-4 py-2 text-left">Último Contato</th>
                          <th className="px-4 py-2 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map(lead => {
                      const column = columns.find(col => col.id === lead.column);
                      return <tr key={lead.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{lead.name}</td>
                              <td className="px-4 py-3">{lead.company}</td>
                              <td className="px-4 py-3">{lead.responsible}</td>
                              <td className="px-4 py-3">
                                {column && <span className={`px-2 py-1 rounded-full text-xs ${column.color}`}>
                                    {column.name}
                                  </span>}
                              </td>
                              <td className="px-4 py-3">{lead.lastContact}</td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm" onClick={() => openLeadDetails(lead)}>
                                  Ver Detalhes
                                </Button>
                              </td>
                            </tr>;
                    })}
                      </tbody>
                    </table>
                    {filteredLeads.length === 0 && <div className="text-center py-8 text-gray-500">
                        Nenhum lead encontrado com os critérios de busca.
                      </div>}
                  </div>
                </ScrollArea>
              </div>
            </div>}
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes do lead */}
      {selectedLead && <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="mr-2" />
                  {selectedLead.name} - {selectedLead.company}
                </div>
                <Button onClick={e => {
              e.stopPropagation();
              openLeadEditForm(selectedLead);
              setSelectedLead(null);
            }} variant="outline" size="sm" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Lead
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Detalhes do Lead</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedLead.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                          <p className="mt-1 text-base">{selectedLead.company}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedLead.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedLead.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                          <p className="mt-1 text-base">{selectedLead.responsible}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Estágio</h3>
                          <p className="mt-1 text-base">{columns.find(col => col.id === selectedLead.column)?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Último Contato</h3>
                          <p className="mt-1 text-base">{selectedLead.lastContact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comments">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Comentários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedLead.comments.map(comment => <div key={comment.id} className="border rounded-md p-3">
                            <p className="text-sm">{comment.text}</p>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>{comment.author}</span>
                              <span>{comment.date}</span>
                            </div>
                          </div>)}
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Adicionar comentário</h4>
                        <textarea className="w-full border rounded-md p-2 min-h-[100px]" placeholder="Digite seu comentário..." />
                        <Button className="mt-2">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Adicionar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Histórico de Atividades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-2">
                        <div className="mb-8 relative">
                          <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Calendar className="text-white h-3 w-3" />
                          </div>
                          <p className="font-medium">Reunião agendada</p>
                          <p className="text-sm text-gray-600">25/05/2025 às 14:30</p>
                          <p className="text-sm mt-1">Apresentação do produto para o cliente.</p>
                        </div>
                        
                        <div className="mb-8 relative">
                          <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <MessageSquare className="text-white h-3 w-3" />
                          </div>
                          <p className="font-medium">Contato por email</p>
                          <p className="text-sm text-gray-600">20/05/2025</p>
                          <p className="text-sm mt-1">Envio de proposta comercial.</p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <User className="text-white h-3 w-3" />
                          </div>
                          <p className="font-medium">Lead criado</p>
                          <p className="text-sm text-gray-600">15/05/2025</p>
                          <p className="text-sm mt-1">Lead adicionado ao sistema.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center p-3 border rounded-md">
                          <span className="flex-1">Proposta_Comercial.pdf</span>
                          <Button variant="ghost" size="sm">Ver</Button>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <span className="flex-1">Contrato.docx</span>
                          <Button variant="ghost" size="sm">Ver</Button>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Documento
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}
      
      {/* Dialog para edição de lead */}
      <Dialog open={isEditingLead} onOpenChange={open => !open && setIsEditingLead(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={editLeadForm.handleSubmit(handleSaveLeadEdit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-name">Nome</FormLabel>
                <Input id="edit-name" {...editLeadForm.register('name', {
                required: true
              })} />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-company">Empresa</FormLabel>
                <Input id="edit-company" {...editLeadForm.register('company', {
                required: true
              })} />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-email">Email</FormLabel>
                <Input id="edit-email" type="email" {...editLeadForm.register('email', {
                required: true
              })} />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-phone">Telefone</FormLabel>
                <Input id="edit-phone" {...editLeadForm.register('phone')} />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="edit-responsible">Responsável</FormLabel>
                <Select onValueChange={value => editLeadForm.setValue('responsible', value)} defaultValue={leadToEdit?.responsible || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {administrators.map(admin => <SelectItem key={admin.id} value={admin.name}>
                        {admin.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditingLead(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default CRM;