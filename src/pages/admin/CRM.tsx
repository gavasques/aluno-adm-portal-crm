import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, User, Package, Calendar, MessageSquare, MoreVertical, Users, 
  Edit, Trash2, Filter, X, Search, Mail, Phone, FileText, Clock, Link, Check,
  MoveHorizontal, ArrowLeft, ArrowRight
} from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Tipos para o CRM
interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  column: string;
  product: string;
  responsible: string;
  lastContact: string;
  comments: Comment[];
  negotiatedProducts?: {
    type: string;
    itemId: string;
    itemName: string;
    bonuses: string[];
  }[];
  communications?: Communication[];
  history?: HistoryItem[];
  documents?: Document[];
}

interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
}

interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface Communication {
  id: number;
  text: string;
  date: string;
  author: string;
  channel: string;
  files?: string[];
}

interface HistoryItem {
  id: number;
  type: string;
  text: string;
  date: string;
  icon?: string;
}

interface Document {
  id: number;
  name: string;
  description: string;
  date: string;
  uploadedBy: string;
}

// Definindo o tipo para DragItem para solucionar o erro
interface DragItem {
  id: number;
  type: string;
}

// Lista de administradores fictícia (seria carregada da API em um caso real)
const adminUsers = [
  { id: 1, name: "Ana Carolina" },
  { id: 2, name: "Pedro Santos" },
  { id: 3, name: "Maria Silva" },
  { id: 4, name: "João Oliveira" }
];

// Lista de cursos e mentorias (seria carregada da API em um caso real)
const availableProducts = {
  courses: [
    { id: "CRS001", name: "Curso Básico E-commerce" },
    { id: "CRS002", name: "Curso Avançado E-commerce" },
    { id: "CRS003", name: "Curso de Marketing Digital" }
  ],
  mentorings: [
    { id: "MNT001", name: "Mentoria Individual" },
    { id: "MNT002", name: "Mentoria em Grupo" }
  ],
  bonuses: [
    { id: "BNS001", name: "E-book Estratégias de Vendas" },
    { id: "BNS002", name: "Acesso ao Software XYZ" },
    { id: "BNS003", name: "Template de Planilha" }
  ]
};

// Lista de bônus (seria carregada da API em um caso real)
const availableBonuses = [
  { id: "BNS001", name: "E-book Estratégias de Vendas" },
  { id: "BNS002", name: "Acesso ao Software XYZ" },
  { id: "BNS003", name: "Template de Planilha" }
];

// Componente para o card do lead (com drag-and-drop)
const LeadCard = ({ lead, openLeadDetails, moveLead }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { id: lead.id, type: 'LEAD' } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card 
      ref={drag}
      key={lead.id} 
      className={`mb-2 cursor-pointer hover:shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`} 
      onClick={() => openLeadDetails(lead)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base">{lead.name}</h4>
            <p className="text-sm text-gray-600">{lead.company}</p>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-48">
              <div className="space-y-1 text-sm">
                <p className="flex items-center"><Mail className="h-3 w-3 mr-1 flex-shrink-0" /> {lead.email || "Não informado"}</p>
                <p className="flex items-center"><Phone className="h-3 w-3 mr-1 flex-shrink-0" /> {lead.phone || "Não informado"}</p>
                <p className="flex items-center"><Package className="h-3 w-3 mr-1 flex-shrink-0" /> {lead.product || "Não informado"}</p>
                <p className="flex items-center"><Clock className="h-3 w-3 mr-1 flex-shrink-0" /> {lead.lastContact}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {lead.responsible}
          </div>
          {lead.product && (
            <div className="flex items-center">
              <Package className="h-3 w-3 mr-1" />
              {lead.product.length > 15 ? `${lead.product.substring(0, 15)}...` : lead.product}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para a coluna do kanban (com drag-and-drop)
const KanbanColumn = ({ column, leads, openLeadDetails, moveColumn, moveLead }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: (item: DragItem) => moveLead(item.id, column.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [editingColumn, setEditingColumn] = useState(false);
  const [columnName, setColumnName] = useState(column.name);

  const saveColumnEdit = () => {
    moveColumn(column.id, { name: columnName });
    setEditingColumn(false);
  };

  return (
    <div key={column.id} className="flex flex-col min-w-[260px]">
      <div className={`px-3 py-2 rounded-t-md ${column.color} border-b`}>
        <div className="flex justify-between items-center">
          {editingColumn ? (
            <div className="flex flex-1 items-center gap-2">
              <Input 
                value={columnName} 
                onChange={(e) => setColumnName(e.target.value)}
                className="h-8 py-1"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={saveColumnEdit}
                className="h-7 w-7 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingColumn(false)}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{column.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 p-0"
                  onClick={() => moveColumn(column.id, { order: column.order - 1 })}
                  disabled={column.order === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 p-0"
                  onClick={() => moveColumn(column.id, { order: column.order + 1 })}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm bg-white px-2 py-1 rounded-full">
                  {leads.filter(lead => lead.column === column.id).length}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-32">
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingColumn(true)}
                        className="justify-start"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => moveColumn(column.id, { delete: true })}
                        className="justify-start text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={drop}
        className={`flex-1 p-2 ${isOver ? 'bg-blue-50' : 'bg-gray-50'} rounded-b-md border border-t-0 min-h-[500px]`}
      >
        {leads.filter(lead => lead.column === column.id).map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            openLeadDetails={openLeadDetails}
            moveLead={moveLead}
          />
        ))}
      </div>
    </div>
  );
};

const CRM = () => {
  // Estado para controlar as colunas do kanban
  const [columns, setColumns] = useState<Column[]>([
    { id: "lead-in", name: "Lead In", color: "bg-blue-100", order: 0 },
    { id: "presentation", name: "Call Apresentação", color: "bg-purple-100", order: 1 },
    { id: "meeting", name: "Reunião", color: "bg-amber-100", order: 2 },
    { id: "follow-up", name: "Acompanhamento", color: "bg-green-100", order: 3 },
    { id: "closed", name: "Fechado", color: "bg-gray-100", order: 4 }
  ]);
  
  // Estado para controlar os cards de leads
  const [leads, setLeads] = useState<Lead[]>([
    { 
      id: 1, 
      name: "João Silva", 
      company: "TechSolutions", 
      email: "joao@techsolutions.com",
      phone: "(11) 98765-4321",
      column: "lead-in",
      product: "Curso Avançado",
      responsible: "Ana Carolina",
      lastContact: "21/05/2025",
      comments: [
        { id: 1, text: "Cliente interessado no curso avançado", date: "20/05/2025", author: "Ana Carolina" }
      ],
      negotiatedProducts: [
        { type: "course", itemId: "CRS002", itemName: "Curso Avançado E-commerce", bonuses: ["BNS001"] }
      ],
      communications: [
        { 
          id: 1, 
          text: "Cliente mostrou interesse no curso avançado e pediu mais detalhes sobre o conteúdo programático", 
          date: "20/05/2025", 
          author: "Ana Carolina",
          channel: "E-mail"
        }
      ],
      history: [
        { id: 1, type: "create", text: "Lead criado no sistema", date: "15/05/2025" },
        { id: 2, type: "contact", text: "Primeiro contato por e-mail", date: "20/05/2025" }
      ],
      documents: [
        { id: 1, name: "Proposta_Comercial.pdf", description: "Proposta inicial de vendas", date: "20/05/2025", uploadedBy: "Ana Carolina" }
      ]
    },
    { 
      id: 2, 
      name: "Maria Oliveira", 
      company: "E-commerce Brasil", 
      email: "maria@ecommercebrasil.com",
      phone: "(11) 91234-5678",
      column: "presentation",
      product: "Mentoria Individual",
      responsible: "Pedro Santos",
      lastContact: "18/05/2025",
      comments: [
        { id: 1, text: "Cliente solicitou mais informações sobre a mentoria", date: "18/05/2025", author: "Pedro Santos" }
      ],
      negotiatedProducts: [
        { type: "mentoring", itemId: "MNT001", itemName: "Mentoria Individual", bonuses: ["BNS001", "BNS003"] }
      ]
    },
    { 
      id: 3, 
      name: "Carlos Mendes", 
      company: "Loja Virtual", 
      email: "carlos@lojavirtual.com",
      phone: "(11) 93333-4444",
      column: "meeting",
      product: "Pacote Completo",
      responsible: "Ana Carolina",
      lastContact: "15/05/2025",
      comments: [
        { id: 1, text: "Reunião agendada para 25/05", date: "15/05/2025", author: "Ana Carolina" }
      ],
      negotiatedProducts: [
        { type: "course", itemId: "CRS003", itemName: "Curso de Marketing Digital", bonuses: [] },
        { type: "mentoring", itemId: "MNT002", itemName: "Mentoria em Grupo", bonuses: ["BNS002"] }
      ]
    },
    { 
      id: 4, 
      name: "Amanda Costa", 
      company: "Moda Online", 
      email: "amanda@modaonline.com",
      phone: "(11) 95555-6666",
      column: "follow-up",
      product: "Mentoria em Grupo",
      responsible: "Pedro Santos",
      lastContact: "12/05/2025",
      comments: [
        { id: 1, text: "Aguardando retorno sobre proposta", date: "12/05/2025", author: "Pedro Santos" }
      ]
    },
    { 
      id: 5, 
      name: "Roberto Almeida", 
      company: "Super Digital", 
      email: "roberto@superdigital.com",
      phone: "(11) 97777-8888",
      column: "closed",
      product: "Curso Básico",
      responsible: "Ana Carolina",
      lastContact: "08/05/2025",
      comments: [
        { id: 1, text: "Contrato assinado", date: "08/05/2025", author: "Ana Carolina" }
      ],
      negotiatedProducts: [
        { type: "course", itemId: "CRS001", itemName: "Curso Básico E-commerce", bonuses: ["BNS003"] }
      ]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResponsible, setFilterResponsible] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeView, setActiveView] = useState("kanban");
  
  // Estado para novo lead
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    responsible: ""
  });

  // Estado para edição de coluna
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  
  const navigate = useNavigate();
  
  const filteredLeads = leads.filter(lead => {
    // Filtro por termo de busca (nome ou empresa)
    const searchFilter = 
      searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtro por responsável
    const responsibleFilter = 
      filterResponsible === "" || 
      lead.responsible === filterResponsible;
      
    // Filtro por status (coluna)
    const statusFilter = 
      filterStatus === "" || 
      lead.column === filterStatus;
      
    return searchFilter && responsibleFilter && statusFilter;
  });
  
  // Função para mover um lead para outra coluna
  const moveLead = (leadId: number, targetColumn: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? {...lead, column: targetColumn} : lead
    ));
    
    // Adicionar ao histórico
    const targetColumnName = columns.find(col => col.id === targetColumn)?.name;
    const leadToUpdate = leads.find(lead => lead.id === leadId);
    
    if (leadToUpdate) {
      addHistoryItem(leadId, `Lead movido para ${targetColumnName || targetColumn}`);
    }
  };
  
  // Função para abrir os detalhes de um lead
  const openLeadDetails = (lead: Lead) => {
    navigate(`/admin/crm/lead/${lead.id}`);
  };
  
  // Função para adicionar novo lead
  const addNewLead = () => {
    if (!newLead.name || !newLead.company || !newLead.responsible) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    const newId = leads.length > 0 ? Math.max(...leads.map(lead => lead.id)) + 1 : 1;
    
    const lead: Lead = {
      id: newId,
      name: newLead.name,
      company: newLead.company,
      email: newLead.email,
      phone: newLead.phone,
      column: "lead-in", // Começa na primeira coluna
      product: "",
      responsible: newLead.responsible,
      lastContact: new Date().toLocaleDateString("pt-BR"),
      comments: [],
      negotiatedProducts: [],
      communications: [],
      history: [
        { id: 1, type: "create", text: "Lead criado no sistema", date: new Date().toLocaleDateString("pt-BR") }
      ],
      documents: []
    };
    
    setLeads([...leads, lead]);
    setNewLead({
      name: "",
      company: "",
      email: "",
      phone: "",
      responsible: ""
    });
    
    toast.success("Lead adicionado com sucesso");
  };
  
  // Função para excluir um lead
  const deleteLead = (id: number) => {
    setLeads(leads.filter(lead => lead.id !== id));
    toast.success("Lead removido com sucesso");
  };
  
  // Função para adicionar uma nova coluna
  const addNewColumn = () => {
    if (!newColumnName) {
      toast.error("Por favor, digite um nome para a coluna");
      return;
    }
    
    const randomColor = [
      "bg-blue-100", "bg-purple-100", "bg-amber-100", 
      "bg-green-100", "bg-red-100", "bg-indigo-100", 
      "bg-pink-100", "bg-teal-100"
    ][Math.floor(Math.random() * 8)];
    
    const newId = `column-${Date.now()}`;
    const nextOrder = columns.length;
    
    setColumns([...columns, {
      id: newId,
      name: newColumnName,
      color: randomColor,
      order: nextOrder
    }]);
    
    setNewColumnName("");
    setShowNewColumnDialog(false);
    
    toast.success("Coluna adicionada com sucesso");
  };
  
  // Função para mover, editar ou remover uma coluna
  const moveColumn = (columnId: string, changes: { order?: number, name?: string, delete?: boolean }) => {
    if (changes.delete) {
      // Verificar se há leads nesta coluna
      const leadsInColumn = leads.filter(lead => lead.column === columnId);
      
      if (leadsInColumn.length > 0) {
        toast.error(`Não é possível remover esta coluna. Existem ${leadsInColumn.length} leads nela.`);
        return;
      }
      
      const updatedColumns = columns.filter(col => col.id !== columnId);
      
      // Reordenar as colunas restantes
      updatedColumns.sort((a, b) => a.order - b.order);
      const reorderedColumns = updatedColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      setColumns(reorderedColumns);
      toast.success("Coluna removida com sucesso");
      return;
    }
    
    if (changes.name) {
      setColumns(columns.map(col => 
        col.id === columnId ? {...col, name: changes.name} : col
      ));
      toast.success("Coluna atualizada com sucesso");
      return;
    }
    
    if (changes.order !== undefined) {
      // Não permitir ordens negativas
      if (changes.order < 0) return;
      
      // Não permitir ultrapassar o número de colunas
      if (changes.order >= columns.length) return;
      
      // Obter a coluna que queremos mover
      const column = columns.find(col => col.id === columnId);
      if (!column) return;
      
      // Obter a coluna que está atualmente na posição alvo
      const targetColumn = columns.find(col => col.order === changes.order);
      if (!targetColumn) return;
      
      // Trocar as ordens das colunas
      setColumns(columns.map(col => {
        if (col.id === columnId) {
          return { ...col, order: changes.order };
        }
        if (col.id === targetColumn.id) {
          return { ...col, order: column.order };
        }
        return col;
      }));
      
      toast.success("Ordem das colunas atualizada");
    }
  };
  
  // Função para adicionar item ao histórico
  const addHistoryItem = (leadId: number, text: string) => {
    const lead = leads.find(lead => lead.id === leadId);
    if (!lead) return;
    
    const historyId = lead.history ? 
      Math.max(...lead.history.map(item => item.id)) + 1 : 1;
      
    const historyItem: HistoryItem = {
      id: historyId,
      type: "update",
      text: text,
      date: new Date().toLocaleDateString("pt-BR")
    };
    
    const updatedHistory = lead.history ? 
      [...lead.history, historyItem] : [historyItem];
    
    // Atualizar o lead
    setLeads(leads.map(l => 
      l.id === leadId ? {...l, history: updatedHistory} : l
    ));
  };
  
  // Ordenar as colunas por ordem
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-portal-dark">CRM / Gestão de Leads</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Novo Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-sm font-medium">Nome *</label>
                      <Input 
                        id="name" 
                        value={newLead.name} 
                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        placeholder="Nome do contato"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="company" className="text-sm font-medium">Empresa *</label>
                      <Input 
                        id="company" 
                        value={newLead.company} 
                        onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={newLead.email} 
                        onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                        placeholder="Email do contato"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                      <Input 
                        id="phone" 
                        value={newLead.phone} 
                        onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                        placeholder="Telefone do contato"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="responsible" className="text-sm font-medium">Responsável *</label>
                      <Select 
                        value={newLead.responsible} 
                        onValueChange={(value) => setNewLead({...newLead, responsible: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminUsers.map(user => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addNewLead} type="submit">Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {activeView === "kanban" && (
              <Dialog open={showNewColumnDialog} onOpenChange={setShowNewColumnDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Nova Coluna
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Coluna</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-1">
                      <label htmlFor="columnName" className="text-sm font-medium">Nome da Coluna</label>
                      <Input 
                        id="columnName" 
                        value={newColumnName} 
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="Ex: Qualificação"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewColumnDialog(false)}>Cancelar</Button>
                    <Button onClick={addNewColumn}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestão de Leads</CardTitle>
                <CardDescription>
                  Acompanhe o progresso dos seus leads no pipeline de vendas.
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={activeView === "kanban" ? "default" : "outline"} 
                  onClick={() => setActiveView("kanban")}
                >
                  Kanban
                </Button>
                <Button 
                  variant={activeView === "list" ? "default" : "outline"} 
                  onClick={() => setActiveView("list")}
                >
                  Lista
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou empresa" 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterResponsible} onValueChange={setFilterResponsible}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os responsáveis</SelectItem>
                  {adminUsers.map(user => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {activeView === "list" && (
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {sortedColumns.map(column => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeView === "kanban" ? (
              <div className="grid grid-cols-1 md:grid-cols-auto-fit gap-4 overflow-x-auto min-h-[600px]">
                <div className="flex space-x-4 w-full overflow-x-auto pb-4">
                  {sortedColumns.map(column => (
                    <KanbanColumn 
                      key={column.id}
                      column={column}
                      leads={filteredLeads}
                      openLeadDetails={openLeadDetails}
                      moveColumn={moveColumn}
                      moveLead={moveLead}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Nome</th>
                      <th className="px-4 py-2 text-left">Empresa</th>
                      <th className="px-4 py-2 text-left">Produto</th>
                      <th className="px-4 py-2 text-left">Responsável</th>
                      <th className="px-4 py-2 text-left">Estágio</th>
                      <th className="px-4 py-2 text-left">Último Contato</th>
                      <th className="px-4 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => {
                      const column = columns.find(col => col.id === lead.column);
                      return (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{lead.name}</td>
                          <td className="px-4 py-3">{lead.company}</td>
                          <td className="px-4 py-3">{lead.product || "-"}</td>
                          <td className="px-4 py-3">{lead.responsible}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${column?.color}`}>
                              {column?.name || "Sem estágio"}
                            </span>
                          </td>
                          <td className="px-4 py-3">{lead.lastContact}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openLeadDetails(lead)}>
                                Ver Detalhes
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={(e) => {
                                e.stopPropagation();
                                deleteLead(lead.id);
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
};

export default CRM;
