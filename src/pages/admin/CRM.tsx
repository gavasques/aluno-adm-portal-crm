
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, User, Package, Calendar, MessageSquare, MoreVertical, Users, 
  Edit, Trash2, Filter, X, Search, Mail, Phone, FileText, Clock, Link
} from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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
  ]
};

// Lista de bônus (seria carregada da API em um caso real)
const availableBonuses = [
  { id: "BNS001", name: "E-book Estratégias de Vendas" },
  { id: "BNS002", name: "Acesso ao Software XYZ" },
  { id: "BNS003", name: "Template de Planilha" }
];

const CRM = () => {
  // Estado para controlar as colunas do kanban
  const [columns, setColumns] = useState<Column[]>([
    { id: "lead-in", name: "Lead In", color: "bg-blue-100" },
    { id: "presentation", name: "Call Apresentação", color: "bg-purple-100" },
    { id: "meeting", name: "Reunião", color: "bg-amber-100" },
    { id: "follow-up", name: "Acompanhamento", color: "bg-green-100" },
    { id: "closed", name: "Fechado", color: "bg-gray-100" }
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
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeView, setActiveView] = useState("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResponsible, setFilterResponsible] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Estado para novo lead
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    responsible: ""
  });

  // Estado para edição de coluna
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  
  // Estado para edição de lead
  const [editingLead, setEditingLead] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});
  
  // Estado para nova comunicação
  const [newCommunication, setNewCommunication] = useState({
    text: "",
    channel: "E-mail",
    files: []
  });
  
  // Estado para novo documento
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: ""
  });

  // Estado para produto negociado
  const [newProduct, setNewProduct] = useState({
    type: "",
    itemId: "",
    bonuses: [] as string[]
  });
  
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

    // Atualizar o lead selecionado se estiver aberto
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({...selectedLead, column: targetColumn});
      
      // Adicionar ao histórico
      const targetColumnName = columns.find(col => col.id === targetColumn)?.name;
      addHistoryItem(leadId, `Lead movido para ${targetColumnName || targetColumn}`);
    }
  };
  
  // Função para abrir os detalhes de um lead
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingLead(false);
    setEditedLeadData({});
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
  
  // Função para editar um lead
  const updateLead = () => {
    if (!selectedLead) return;
    
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? {...lead, ...editedLeadData} : lead
    ));
    
    setSelectedLead({...selectedLead, ...editedLeadData});
    setEditingLead(false);
    
    addHistoryItem(selectedLead.id, "Lead editado");
    toast.success("Lead atualizado com sucesso");
  };
  
  // Função para excluir um lead
  const deleteLead = (id: number) => {
    setLeads(leads.filter(lead => lead.id !== id));
    
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(null);
    }
    
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
    
    setColumns([...columns, {
      id: newId,
      name: newColumnName,
      color: randomColor
    }]);
    
    setNewColumnName("");
    setShowNewColumnDialog(false);
    
    toast.success("Coluna adicionada com sucesso");
  };
  
  // Função para editar uma coluna
  const updateColumn = () => {
    if (!editingColumn) return;
    
    setColumns(columns.map(col => 
      col.id === editingColumn.id ? editingColumn : col
    ));
    
    setEditingColumn(null);
    
    toast.success("Coluna atualizada com sucesso");
  };
  
  // Função para remover uma coluna
  const removeColumn = (columnId: string) => {
    // Verificar se há leads nesta coluna
    const leadsInColumn = leads.filter(lead => lead.column === columnId);
    
    if (leadsInColumn.length > 0) {
      toast.error(`Não é possível remover esta coluna. Existem ${leadsInColumn.length} leads nela.`);
      return;
    }
    
    setColumns(columns.filter(col => col.id !== columnId));
    
    toast.success("Coluna removida com sucesso");
  };
  
  // Função para adicionar uma comunicação
  const addCommunication = () => {
    if (!selectedLead || !newCommunication.text || !newCommunication.channel) return;
    
    const communicationId = selectedLead.communications ? 
      Math.max(...selectedLead.communications.map(comm => comm.id)) + 1 : 1;
      
    const communication: Communication = {
      id: communicationId,
      text: newCommunication.text,
      date: new Date().toLocaleDateString("pt-BR"),
      author: "Usuário Atual", // Em um sistema real, seria o usuário logado
      channel: newCommunication.channel,
      files: newCommunication.files.length > 0 ? newCommunication.files : undefined
    };
    
    const updatedCommunications = selectedLead.communications ? 
      [...selectedLead.communications, communication] : [communication];
    
    // Atualizar o lead
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? 
      {...lead, 
        communications: updatedCommunications,
        lastContact: new Date().toLocaleDateString("pt-BR")
      } : lead
    ));
    
    // Atualizar o lead selecionado
    setSelectedLead({
      ...selectedLead, 
      communications: updatedCommunications,
      lastContact: new Date().toLocaleDateString("pt-BR")
    });
    
    // Adicionar ao histórico
    addHistoryItem(selectedLead.id, `Nova comunicação via ${newCommunication.channel}`);
    
    // Limpar o formulário
    setNewCommunication({
      text: "",
      channel: "E-mail",
      files: []
    });
    
    toast.success("Comunicação adicionada com sucesso");
  };
  
  // Função para adicionar um documento
  const addDocument = () => {
    if (!selectedLead || !newDocument.name) return;
    
    const documentId = selectedLead.documents ? 
      Math.max(...selectedLead.documents.map(doc => doc.id)) + 1 : 1;
      
    const document: Document = {
      id: documentId,
      name: newDocument.name,
      description: newDocument.description,
      date: new Date().toLocaleDateString("pt-BR"),
      uploadedBy: "Usuário Atual" // Em um sistema real, seria o usuário logado
    };
    
    const updatedDocuments = selectedLead.documents ? 
      [...selectedLead.documents, document] : [document];
    
    // Atualizar o lead
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? {...lead, documents: updatedDocuments} : lead
    ));
    
    // Atualizar o lead selecionado
    setSelectedLead({...selectedLead, documents: updatedDocuments});
    
    // Adicionar ao histórico
    addHistoryItem(selectedLead.id, `Documento adicionado: ${newDocument.name}`);
    
    // Limpar o formulário
    setNewDocument({
      name: "",
      description: ""
    });
    
    toast.success("Documento adicionado com sucesso");
  };
  
  // Função para remover um documento
  const removeDocument = (documentId: number) => {
    if (!selectedLead || !selectedLead.documents) return;
    
    const updatedDocuments = selectedLead.documents.filter(doc => doc.id !== documentId);
    
    // Atualizar o lead
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? {...lead, documents: updatedDocuments} : lead
    ));
    
    // Atualizar o lead selecionado
    setSelectedLead({...selectedLead, documents: updatedDocuments});
    
    // Adicionar ao histórico
    addHistoryItem(selectedLead.id, `Documento removido`);
    
    toast.success("Documento removido com sucesso");
  };
  
  // Função para adicionar um produto negociado
  const addNegotiatedProduct = () => {
    if (!selectedLead || !newProduct.type || !newProduct.itemId) return;
    
    // Encontrar o nome do produto selecionado
    const productList = newProduct.type === "course" 
      ? availableProducts.courses 
      : availableProducts.mentorings;
      
    const selectedProductItem = productList.find(item => item.id === newProduct.itemId);
    
    if (!selectedProductItem) return;
    
    const product = {
      type: newProduct.type,
      itemId: newProduct.itemId,
      itemName: selectedProductItem.name,
      bonuses: newProduct.bonuses
    };
    
    const updatedProducts = selectedLead.negotiatedProducts ? 
      [...selectedLead.negotiatedProducts, product] : [product];
    
    // Atualizar o lead
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? 
      {...lead, 
        negotiatedProducts: updatedProducts,
        product: selectedLead.product ? `${selectedLead.product}, ${selectedProductItem.name}` : selectedProductItem.name
      } : lead
    ));
    
    // Atualizar o lead selecionado
    setSelectedLead({
      ...selectedLead, 
      negotiatedProducts: updatedProducts,
      product: selectedLead.product ? `${selectedLead.product}, ${selectedProductItem.name}` : selectedProductItem.name
    });
    
    // Adicionar ao histórico
    addHistoryItem(selectedLead.id, `Produto adicionado à negociação: ${selectedProductItem.name}`);
    
    // Limpar o formulário
    setNewProduct({
      type: "",
      itemId: "",
      bonuses: []
    });
    
    toast.success("Produto adicionado com sucesso");
  };
  
  // Função para remover um produto negociado
  const removeNegotiatedProduct = (index: number) => {
    if (!selectedLead || !selectedLead.negotiatedProducts) return;
    
    const updatedProducts = [...selectedLead.negotiatedProducts];
    const removedProduct = updatedProducts[index];
    updatedProducts.splice(index, 1);
    
    // Reconstruir a string do produto principal
    const productString = updatedProducts.map(p => p.itemName).join(", ");
    
    // Atualizar o lead
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? 
      {...lead, 
        negotiatedProducts: updatedProducts,
        product: productString
      } : lead
    ));
    
    // Atualizar o lead selecionado
    setSelectedLead({
      ...selectedLead, 
      negotiatedProducts: updatedProducts,
      product: productString
    });
    
    // Adicionar ao histórico
    addHistoryItem(selectedLead.id, `Produto removido da negociação: ${removedProduct.itemName}`);
    
    toast.success("Produto removido com sucesso");
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
    
    // Atualizar o lead selecionado se necessário
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({...selectedLead, history: updatedHistory});
    }
  };
  
  return (
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
                <SelectItem value="">Todos os responsáveis</SelectItem>
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
                  <SelectItem value="">Todos os status</SelectItem>
                  {columns.map(column => (
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
            <div className="grid grid-cols-1 md:grid-cols-auto-fit gap-4 overflow-x-auto">
              {columns.map(column => (
                <div key={column.id} className="flex flex-col min-w-[260px]">
                  <div className={`px-3 py-2 rounded-t-md ${column.color} border-b`}>
                    <div className="flex justify-between items-center">
                      {editingColumn && editingColumn.id === column.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <Input 
                            value={editingColumn.name} 
                            onChange={(e) => setEditingColumn({...editingColumn, name: e.target.value})}
                            className="h-8 py-1"
                          />
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={updateColumn}
                            className="h-7 w-7 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingColumn(null)}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <h3 className="font-medium">{column.name}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-sm bg-white px-2 py-1 rounded-full">
                              {filteredLeads.filter(lead => lead.column === column.id).length}
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
                                    onClick={() => setEditingColumn(column)}
                                    className="justify-start"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeColumn(column.id)}
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
                  
                  <div className={`flex-1 p-2 bg-gray-50 rounded-b-md border border-t-0 min-h-[500px]`}>
                    {filteredLeads.filter(lead => lead.column === column.id).map(lead => (
                      <Card key={lead.id} className="mb-2 cursor-pointer hover:shadow-md" onClick={() => openLeadDetails(lead)}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-base">{lead.name}</h4>
                              <p className="text-sm text-gray-600">{lead.company}</p>
                            </div>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="ghost" size="sm">
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
                    ))}
                  </div>
                </div>
              ))}
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
      
      {/* Dialog para detalhes do lead */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="mr-2" />
                {selectedLead.name} - {selectedLead.company}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Detalhes do Lead</TabsTrigger>
                  <TabsTrigger value="products">Produto Negociado</TabsTrigger>
                  <TabsTrigger value="communications">Comunicações</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl">Informações do Lead</CardTitle>
                      <div className="flex gap-2">
                        {!editingLead ? (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setEditingLead(true);
                                setEditedLeadData({
                                  name: selectedLead.name,
                                  company: selectedLead.company,
                                  email: selectedLead.email,
                                  phone: selectedLead.phone,
                                  responsible: selectedLead.responsible
                                });
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => {
                                deleteLead(selectedLead.id);
                                setSelectedLead(null);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingLead(false)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              onClick={updateLead}
                            >
                              Salvar
                            </Button>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!editingLead ? (
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
                            <p className="mt-1 text-base">{selectedLead.email || "Não informado"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                            <p className="mt-1 text-base">{selectedLead.phone || "Não informado"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                            <p className="mt-1 text-base">{selectedLead.responsible}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Estágio</h3>
                            <p className="mt-1 text-base">{columns.find(col => col.id === selectedLead.column)?.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label htmlFor="edit-name" className="text-sm font-medium">Nome</label>
                            <Input 
                              id="edit-name" 
                              value={editedLeadData.name || ""} 
                              onChange={(e) => setEditedLeadData({...editedLeadData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="edit-company" className="text-sm font-medium">Empresa</label>
                            <Input 
                              id="edit-company" 
                              value={editedLeadData.company || ""} 
                              onChange={(e) => setEditedLeadData({...editedLeadData, company: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                            <Input 
                              id="edit-email" 
                              value={editedLeadData.email || ""} 
                              onChange={(e) => setEditedLeadData({...editedLeadData, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="edit-phone" className="text-sm font-medium">Telefone</label>
                            <Input 
                              id="edit-phone" 
                              value={editedLeadData.phone || ""} 
                              onChange={(e) => setEditedLeadData({...editedLeadData, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="edit-responsible" className="text-sm font-medium">Responsável</label>
                            <Select 
                              value={editedLeadData.responsible} 
                              onValueChange={(value) => setEditedLeadData({...editedLeadData, responsible: value})}
                            >
                              <SelectTrigger id="edit-responsible">
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
                      )}
                      
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Mover para estágio</h3>
                        <div className="flex flex-wrap gap-2">
                          {columns.map(column => (
                            <Button 
                              key={column.id}
                              variant={selectedLead.column === column.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => moveLead(selectedLead.id, column.id)}
                            >
                              {column.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Produto Negociado</CardTitle>
                      <CardDescription>
                        Adicione produtos e bônus à negociação com este lead.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Lista de produtos negociados */}
                        {selectedLead.negotiatedProducts && selectedLead.negotiatedProducts.length > 0 ? (
                          <div className="space-y-4">
                            {selectedLead.negotiatedProducts.map((product, index) => (
                              <Card key={index} className="bg-gray-50">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{product.itemName}</div>
                                      <div className="text-sm text-gray-500 mt-1">
                                        {product.type === "course" ? "Curso" : "Mentoria"}
                                      </div>
                                      {product.bonuses && product.bonuses.length > 0 && (
                                        <div className="mt-2">
                                          <div className="text-sm font-medium">Bônus incluídos:</div>
                                          <ul className="list-disc list-inside text-sm text-gray-600 pl-2 mt-1">
                                            {product.bonuses.map(bonusId => {
                                              const bonus = availableBonuses.find(b => b.id === bonusId);
                                              return <li key={bonusId}>{bonus ? bonus.name : bonusId}</li>;
                                            })}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => removeNegotiatedProduct(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Nenhum produto adicionado à negociação.
                          </div>
                        )}
                        
                        {/* Formulário para adicionar novo produto */}
                        <div className="border-t pt-4">
                          <h3 className="text-base font-medium mb-3">Adicionar produto</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Tipo de produto</label>
                              <Select value={newProduct.type} onValueChange={(value) => setNewProduct({...newProduct, type: value, itemId: ""})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="course">Curso</SelectItem>
                                  <SelectItem value="mentoring">Mentoria</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {newProduct.type && (
                              <div>
                                <label className="text-sm font-medium">
                                  {newProduct.type === "course" ? "Curso" : "Mentoria"}
                                </label>
                                <Select value={newProduct.itemId} onValueChange={(value) => setNewProduct({...newProduct, itemId: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Selecione um ${newProduct.type === "course" ? "curso" : "mentoria"}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(newProduct.type === "course" ? availableProducts.courses : availableProducts.mentorings).map(item => (
                                      <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            
                            {newProduct.itemId && (
                              <div>
                                <label className="text-sm font-medium">Bônus (opcional)</label>
                                <Select 
                                  value={newProduct.bonuses.length > 0 ? "selected" : ""}
                                  onValueChange={(value) => {
                                    if (value === "selected") return;
                                    const bonus = value;
                                    if (!newProduct.bonuses.includes(bonus)) {
                                      setNewProduct({
                                        ...newProduct, 
                                        bonuses: [...newProduct.bonuses, bonus]
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione bônus" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableBonuses.map(item => (
                                      <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {newProduct.bonuses.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {newProduct.bonuses.map(bonusId => {
                                      const bonus = availableBonuses.find(b => b.id === bonusId);
                                      return (
                                        <div key={bonusId} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
                                          {bonus ? bonus.name : bonusId}
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-5 w-5 p-0 ml-1"
                                            onClick={() => setNewProduct({
                                              ...newProduct,
                                              bonuses: newProduct.bonuses.filter(b => b !== bonusId)
                                            })}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <Button 
                              onClick={addNegotiatedProduct} 
                              disabled={!newProduct.type || !newProduct.itemId}
                              className="mt-2"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Produto
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="communications">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Comunicações</CardTitle>
                      <CardDescription>
                        Registro de comunicações com o lead.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Lista de comunicações */}
                        {selectedLead.communications && selectedLead.communications.length > 0 ? (
                          <div className="space-y-4">
                            {selectedLead.communications.map((comm) => (
                              <div key={comm.id} className="border rounded-md p-4">
                                <div className="flex justify-between">
                                  <div className="font-medium">{comm.channel}</div>
                                  <div className="text-sm text-gray-500">{comm.date}</div>
                                </div>
                                <p className="mt-2 text-sm">{comm.text}</p>
                                <div className="text-xs text-gray-500 mt-2">
                                  Por: {comm.author}
                                </div>
                                {comm.files && comm.files.length > 0 && (
                                  <div className="mt-2 border-t pt-2">
                                    <div className="text-sm font-medium">Arquivos:</div>
                                    <ul className="mt-1">
                                      {comm.files.map((file, i) => (
                                        <li key={i} className="text-sm text-blue-600 hover:underline flex items-center">
                                          <FileText className="h-3 w-3 mr-1" />
                                          {file}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Nenhuma comunicação registrada.
                          </div>
                        )}
                        
                        {/* Formulário para adicionar nova comunicação */}
                        <div className="border-t pt-4">
                          <h3 className="text-base font-medium mb-3">Adicionar comunicação</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Canal de comunicação</label>
                              <Select 
                                value={newCommunication.channel} 
                                onValueChange={(value) => setNewCommunication({...newCommunication, channel: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Canal de comunicação" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="E-mail">E-mail</SelectItem>
                                  <SelectItem value="Telefone">Telefone</SelectItem>
                                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                  <SelectItem value="Reunião">Reunião</SelectItem>
                                  <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Detalhes da comunicação</label>
                              <Textarea 
                                placeholder="Digite os detalhes da comunicação" 
                                value={newCommunication.text}
                                onChange={(e) => setNewCommunication({...newCommunication, text: e.target.value})}
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Anexar arquivos (opcional)</label>
                              <div className="mt-1 flex items-center space-x-2">
                                <Input type="file" className="flex-1" onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setNewCommunication({
                                      ...newCommunication, 
                                      files: [...newCommunication.files, e.target.files[0].name]
                                    });
                                  }
                                }} />
                              </div>
                              
                              {newCommunication.files.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium">Arquivos selecionados:</div>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {newCommunication.files.map((file, index) => (
                                      <div key={index} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
                                        {file}
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-5 w-5 p-0 ml-1"
                                          onClick={() => setNewCommunication({
                                            ...newCommunication,
                                            files: newCommunication.files.filter((_, i) => i !== index)
                                          })}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              onClick={addCommunication} 
                              disabled={!newCommunication.text || !newCommunication.channel}
                              className="mt-2"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Comunicação
                            </Button>
                          </div>
                        </div>
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
                        {selectedLead.history && selectedLead.history.length > 0 ? (
                          selectedLead.history.map((item) => {
                            let iconClass = "bg-blue-500";
                            let icon = <Calendar className="text-white h-3 w-3" />;
                            
                            if (item.type === "create") {
                              iconClass = "bg-purple-500";
                              icon = <User className="text-white h-3 w-3" />;
                            } else if (item.type === "contact") {
                              iconClass = "bg-green-500";
                              icon = <MessageSquare className="text-white h-3 w-3" />;
                            }
                            
                            return (
                              <div key={item.id} className="mb-8 relative">
                                <div className={`absolute -left-11 mt-1.5 w-6 h-6 rounded-full ${iconClass} flex items-center justify-center`}>
                                  {icon}
                                </div>
                                <p className="font-medium">{item.text}</p>
                                <p className="text-sm text-gray-600">{item.date}</p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Nenhum histórico registrado.
                          </div>
                        )}
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
                      <div className="space-y-6">
                        {/* Lista de documentos */}
                        {selectedLead.documents && selectedLead.documents.length > 0 ? (
                          <div className="space-y-2">
                            {selectedLead.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                    <span className="font-medium">{doc.name}</span>
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                  )}
                                  <div className="text-xs text-gray-500 mt-1">
                                    Adicionado em {doc.date} por {doc.uploadedBy}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">Ver</Button>
                                  <Button variant="ghost" size="sm">Download</Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeDocument(doc.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Nenhum documento adicionado.
                          </div>
                        )}
                        
                        {/* Formulário para adicionar novo documento */}
                        <div className="border-t pt-4">
                          <h3 className="text-base font-medium mb-3">Adicionar documento</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Arquivo</label>
                              <Input type="file" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setNewDocument({...newDocument, name: e.target.files[0].name});
                                }
                              }} />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Descrição</label>
                              <Textarea 
                                placeholder="Descrição do documento" 
                                value={newDocument.description}
                                onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                              />
                            </div>
                            
                            <Button 
                              onClick={addDocument} 
                              disabled={!newDocument.name}
                              className="mt-2"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Documento
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CRM;

