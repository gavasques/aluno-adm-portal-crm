
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  User, Package, Calendar, MessageSquare, MoreVertical, ArrowLeft,
  Edit, Trash2, X, Mail, Phone, FileText, Clock, Plus, Check, 
} from "lucide-react";

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

// Dados simulados - em uma aplicação real, estes dados viriam de uma API
const mockLeads: Lead[] = [
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
];

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});
  
  // Estado para nova comunicação
  const [newCommunication, setNewCommunication] = useState({
    text: "",
    channel: "E-mail",
    files: [] as string[]
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
  
  // Simulando o carregamento de dados
  useEffect(() => {
    const leadId = parseInt(id as string);
    const foundLead = mockLeads.find(l => l.id === leadId);
    
    if (foundLead) {
      setLead(foundLead);
    } else {
      toast.error("Lead não encontrado");
      navigate("/admin/crm");
    }
  }, [id, navigate]);
  
  if (!lead) {
    return <div className="container mx-auto py-6">Carregando...</div>;
  }
  
  const updateLead = () => {
    if (!lead) return;
    
    const updatedLead = {...lead, ...editedLeadData};
    setLead(updatedLead);
    setEditingLead(false);
    
    addHistoryItem("Lead editado");
    toast.success("Lead atualizado com sucesso");
  };
  
  const deleteLead = () => {
    toast.success("Lead removido com sucesso");
    navigate("/admin/crm");
  };
  
  const addCommunication = () => {
    if (!lead || !newCommunication.text || !newCommunication.channel) return;
    
    const communicationId = lead.communications ? 
      Math.max(...lead.communications.map(comm => comm.id)) + 1 : 1;
      
    const communication: Communication = {
      id: communicationId,
      text: newCommunication.text,
      date: new Date().toLocaleDateString("pt-BR"),
      author: "Usuário Atual", // Em um sistema real, seria o usuário logado
      channel: newCommunication.channel,
      files: newCommunication.files.length > 0 ? newCommunication.files : undefined
    };
    
    const updatedCommunications = lead.communications ? 
      [...lead.communications, communication] : [communication];
    
    // Atualizar o lead
    setLead({
      ...lead, 
      communications: updatedCommunications,
      lastContact: new Date().toLocaleDateString("pt-BR")
    });
    
    // Adicionar ao histórico
    addHistoryItem(`Nova comunicação via ${newCommunication.channel}`);
    
    // Limpar o formulário
    setNewCommunication({
      text: "",
      channel: "E-mail",
      files: []
    });
    
    toast.success("Comunicação adicionada com sucesso");
  };
  
  const addDocument = () => {
    if (!lead || !newDocument.name) return;
    
    const documentId = lead.documents ? 
      Math.max(...lead.documents.map(doc => doc.id)) + 1 : 1;
      
    const document: Document = {
      id: documentId,
      name: newDocument.name,
      description: newDocument.description,
      date: new Date().toLocaleDateString("pt-BR"),
      uploadedBy: "Usuário Atual" // Em um sistema real, seria o usuário logado
    };
    
    const updatedDocuments = lead.documents ? 
      [...lead.documents, document] : [document];
    
    // Atualizar o lead
    setLead({...lead, documents: updatedDocuments});
    
    // Adicionar ao histórico
    addHistoryItem(`Documento adicionado: ${newDocument.name}`);
    
    // Limpar o formulário
    setNewDocument({
      name: "",
      description: ""
    });
    
    toast.success("Documento adicionado com sucesso");
  };
  
  const removeDocument = (documentId: number) => {
    if (!lead || !lead.documents) return;
    
    const updatedDocuments = lead.documents.filter(doc => doc.id !== documentId);
    
    // Atualizar o lead
    setLead({...lead, documents: updatedDocuments});
    
    // Adicionar ao histórico
    addHistoryItem(`Documento removido`);
    
    toast.success("Documento removido com sucesso");
  };
  
  const addNegotiatedProduct = () => {
    if (!lead || !newProduct.type || !newProduct.itemId) return;
    
    // Encontrar o nome do produto selecionado
    const productList = 
      newProduct.type === "course" ? availableProducts.courses : 
      newProduct.type === "mentoring" ? availableProducts.mentorings :
      availableProducts.bonuses;
      
    const selectedProductItem = productList.find(item => item.id === newProduct.itemId);
    
    if (!selectedProductItem) return;
    
    const product = {
      type: newProduct.type,
      itemId: newProduct.itemId,
      itemName: selectedProductItem.name,
      bonuses: newProduct.bonuses
    };
    
    const updatedProducts = lead.negotiatedProducts ? 
      [...lead.negotiatedProducts, product] : [product];
    
    // Reconstruir a string do produto principal
    const productString = [...updatedProducts].map(p => p.itemName).join(", ");
    
    // Atualizar o lead
    setLead({
      ...lead, 
      negotiatedProducts: updatedProducts,
      product: productString
    });
    
    // Adicionar ao histórico
    addHistoryItem(`Produto adicionado à negociação: ${selectedProductItem.name}`);
    
    // Limpar o formulário
    setNewProduct({
      type: "",
      itemId: "",
      bonuses: []
    });
    
    toast.success("Produto adicionado com sucesso");
  };
  
  const removeNegotiatedProduct = (index: number) => {
    if (!lead || !lead.negotiatedProducts) return;
    
    const updatedProducts = [...lead.negotiatedProducts];
    const removedProduct = updatedProducts[index];
    updatedProducts.splice(index, 1);
    
    // Reconstruir a string do produto principal
    const productString = updatedProducts.map(p => p.itemName).join(", ");
    
    // Atualizar o lead
    setLead({
      ...lead, 
      negotiatedProducts: updatedProducts,
      product: productString
    });
    
    // Adicionar ao histórico
    addHistoryItem(`Produto removido da negociação: ${removedProduct.itemName}`);
    
    toast.success("Produto removido com sucesso");
  };
  
  const addHistoryItem = (text: string) => {
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
    setLead({...lead, history: updatedHistory});
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/admin/crm")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-portal-dark">
            {lead.name} - {lead.company}
          </h1>
        </div>
        <div className="flex gap-2">
          {!editingLead ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingLead(true);
                  setEditedLeadData({
                    name: lead.name,
                    company: lead.company,
                    email: lead.email,
                    phone: lead.phone,
                    responsible: lead.responsible
                  });
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteLead}
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
      </div>
      
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
            </CardHeader>
            <CardContent>
              {!editingLead ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                    <p className="mt-1 text-base">{lead.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                    <p className="mt-1 text-base">{lead.company}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-base">{lead.email || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p className="mt-1 text-base">{lead.phone || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                    <p className="mt-1 text-base">{lead.responsible}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estágio</h3>
                    <p className="mt-1 text-base">
                      {lead.column === "lead-in" ? "Lead In" :
                       lead.column === "presentation" ? "Call Apresentação" :
                       lead.column === "meeting" ? "Reunião" :
                       lead.column === "follow-up" ? "Acompanhamento" :
                       lead.column === "closed" ? "Fechado" : lead.column}
                    </p>
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
                {lead.negotiatedProducts && lead.negotiatedProducts.length > 0 ? (
                  <div className="space-y-4">
                    {lead.negotiatedProducts.map((product, index) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-lg mb-1">{product.itemName}</div>
                              <div className="text-sm text-gray-600 mb-2">
                                {product.type === "course" ? "Curso" : 
                                 product.type === "mentoring" ? "Mentoria" : "Bônus"}
                              </div>
                              {product.bonuses && product.bonuses.length > 0 && (
                                <div className="mt-3 bg-white p-3 rounded-md border">
                                  <div className="text-sm font-medium mb-2">Bônus incluídos:</div>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {product.bonuses.map(bonusId => {
                                      const bonus = availableBonuses.find(b => b.id === bonusId);
                                      return <li key={bonusId} className="mb-1">{bonus ? bonus.name : bonusId}</li>;
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
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <Package className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum produto adicionado à negociação.</p>
                  </div>
                )}
                
                {/* Formulário para adicionar novo produto */}
                <div className="border-t pt-4">
                  <h3 className="text-base font-medium mb-3">Adicionar produto</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium">Tipo de produto</label>
                      <Select value={newProduct.type} onValueChange={(value) => setNewProduct({...newProduct, type: value, itemId: ""})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Curso</SelectItem>
                          <SelectItem value="mentoring">Mentoria</SelectItem>
                          <SelectItem value="bonus">Bônus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newProduct.type && (
                      <div>
                        <label className="text-sm font-medium">
                          {newProduct.type === "course" ? "Curso" : 
                           newProduct.type === "mentoring" ? "Mentoria" : "Bônus"}
                        </label>
                        <Select value={newProduct.itemId} onValueChange={(value) => setNewProduct({...newProduct, itemId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecione um ${
                              newProduct.type === "course" ? "curso" : 
                              newProduct.type === "mentoring" ? "mentoria" : "bônus"
                            }`} />
                          </SelectTrigger>
                          <SelectContent>
                            {(newProduct.type === "course" ? availableProducts.courses : 
                              newProduct.type === "mentoring" ? availableProducts.mentorings : 
                              availableProducts.bonuses).map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {newProduct.type && newProduct.type !== "bonus" && newProduct.itemId && (
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
                                <div key={bonusId} className="inline-flex items-center gap-1 bg-white rounded-full px-3 py-1 text-sm border">
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
                {lead.communications && lead.communications.length > 0 ? (
                  <div className="space-y-4">
                    {lead.communications.map((comm) => (
                      <div key={comm.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-blue-600">{comm.channel}</div>
                          <div className="text-sm text-gray-500">{comm.date}</div>
                        </div>
                        <p className="mb-2 text-gray-800">{comm.text}</p>
                        <div className="text-xs text-gray-500">
                          Por: {comm.author}
                        </div>
                        {comm.files && comm.files.length > 0 && (
                          <div className="mt-3 pt-2 border-t">
                            <div className="text-sm font-medium">Arquivos:</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {comm.files.map((file, i) => (
                                <div key={i} className="flex items-center p-2 bg-white rounded border">
                                  <FileText className="h-3 w-3 mr-1 text-blue-600" />
                                  <span className="text-sm">{file}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>Nenhuma comunicação registrada.</p>
                  </div>
                )}
                
                {/* Formulário para adicionar nova comunicação */}
                <div className="border-t pt-4">
                  <h3 className="text-base font-medium mb-3">Adicionar comunicação</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
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
                              <div key={index} className="inline-flex items-center gap-1 bg-white rounded-full px-3 py-1 text-sm border">
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
                {lead.history && lead.history.length > 0 ? (
                  lead.history.map((item) => {
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
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum histórico registrado.</p>
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
                {lead.documents && lead.documents.length > 0 ? (
                  <div className="space-y-3">
                    {lead.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mt-1 ml-7">{doc.description}</p>
                          )}
                          <div className="text-xs text-gray-500 mt-1 ml-7">
                            Adicionado em {doc.date} por {doc.uploadedBy}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Abrir
                          </Button>
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
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum documento adicionado.</p>
                  </div>
                )}
                
                {/* Formulário para adicionar novo documento */}
                <div className="border-t pt-4">
                  <h3 className="text-base font-medium mb-3">Adicionar documento</h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
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
  );
};

export default LeadDetail;
