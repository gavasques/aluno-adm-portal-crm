import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";

// Define interfaces
export interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
}

export interface Lead {
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

export interface Column {
  id: string;
  name: string;
  color: string;
}

export interface Administrator {
  id: number;
  name: string;
}

export const useCRMState = () => {
  const { toast } = useToast();

  // Define base states
  const [columns, setColumns] = useState<Column[]>([
    { id: "lead-in", name: "Lead In", color: "kanban-blue" },
    { id: "presentation", name: "Call Apresentação", color: "kanban-purple" },
    { id: "meeting", name: "Reunião", color: "kanban-amber" },
    { id: "follow-up", name: "Acompanhamento", color: "kanban-green" },
    { id: "closed", name: "Fechado", color: "kanban-gray" }
  ]);
  
  const [originalColumns, setOriginalColumns] = useState<Column[]>([]);
  const [columnsModified, setColumnsModified] = useState(false);

  // List of administrators (simulated - in a real system would come from backend)
  const administrators: Administrator[] = [
    { id: 1, name: "Ana Carolina" },
    { id: 2, name: "Pedro Santos" },
    { id: 3, name: "João Silva" }
  ];

  // Define leads state
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "João Silva",
      company: "TechSolutions",
      email: "joao@techsolutions.com",
      phone: "(11) 98765-4321",
      column: "lead-in",
      responsible: "Ana Carolina",
      lastContact: "21/05/2025",
      comments: [
        {
          id: 1,
          text: "Cliente interessado no curso avançado",
          date: "20/05/2025",
          author: "Ana Carolina"
        }
      ]
    },
    {
      id: 2,
      name: "Maria Oliveira",
      company: "E-commerce Brasil",
      email: "maria@ecommercebrasil.com",
      phone: "(11) 91234-5678",
      column: "presentation",
      responsible: "Pedro Santos",
      lastContact: "18/05/2025",
      comments: []
    },
    {
      id: 3,
      name: "Carlos Mendes",
      company: "Loja Virtual",
      email: "carlos@lojavirtual.com",
      phone: "(11) 93333-4444",
      column: "meeting",
      responsible: "Ana Carolina",
      lastContact: "15/05/2025",
      comments: []
    },
    {
      id: 4,
      name: "Amanda Costa",
      company: "Moda Online",
      email: "amanda@modaonline.com",
      phone: "(11) 95555-6666",
      column: "follow-up",
      responsible: "Pedro Santos",
      lastContact: "12/05/2025",
      comments: []
    },
    {
      id: 5,
      name: "Roberto Almeida",
      company: "Super Digital",
      email: "roberto@superdigital.com",
      phone: "(11) 97777-8888",
      column: "closed",
      responsible: "Ana Carolina",
      lastContact: "08/05/2025",
      comments: []
    }
  ]);

  // UI state
  const [activeView, setActiveView] = useState("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingColumns, setIsEditingColumns] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // Lead states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lead functions
  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const openLeadEditForm = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditingLead(true);
  };

  const handleAddNewLead = (data: any) => {
    const newLead: Lead = {
      id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      column: "lead-in", // Default to "Lead In"
      responsible: data.responsible,
      lastContact: new Date().toLocaleDateString(),
      comments: []
    };
    setLeads([...leads, newLead]);
    
    toast({
      title: "Lead adicionado",
      description: `O lead ${data.name} foi adicionado com sucesso.`
    });
  };

  const handleSaveLeadEdit = (data: any) => {
    if (!leadToEdit) return;
    
    const updatedLeads = leads.map(lead => 
      lead.id === leadToEdit.id 
        ? {
            ...lead,
            name: data.name,
            company: data.company,
            email: data.email,
            phone: data.phone,
            responsible: data.responsible
          } 
        : lead
    );
    
    setLeads(updatedLeads);

    // If edited lead is selected, update that too
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

  // Column management functions
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

  const removeColumn = (column: Column) => {
    // Move leads from this column to the first column
    const firstColumnId = columns[0].id;
    const updatedLeads = leads.map(lead => 
      lead.column === column.id 
        ? {...lead, column: firstColumnId} 
        : lead
    );
    
    setLeads(updatedLeads);
    setColumns(columns.filter(col => col.id !== column.id));
    setColumnsModified(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    // Handle moving leads between columns
    if (active.data.current?.type === 'lead' && over.data.current?.type === 'column') {
      const leadId = parseInt(active.id.toString().split('-')[1]);
      const targetColumn = over.data.current.column.id;
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? {...lead, column: targetColumn} 
          : lead
      ));
    }
    // Handle reordering of columns
    else if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);
      
      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);
        localStorage.setItem('crmColumns', JSON.stringify(newColumns));
      }
    }
  };

  const handleColumnReorder = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = columns.findIndex(col => col.id === active.id);
    const newIndex = columns.findIndex(col => col.id === over.id);
    
    if (oldIndex !== newIndex) {
      const updatedColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(updatedColumns);
      setColumnsModified(true);
    }
  };

  // Column edit management
  const startEditingColumns = () => {
    setOriginalColumns([...columns]);
    setIsEditingColumns(true);
  };

  const cancelEditingColumns = () => {
    if (columnsModified) {
      setColumns(originalColumns);
      setColumnsModified(false);
    }
    setIsEditingColumns(false);
  };

  const saveColumnChanges = () => {
    setOriginalColumns(columns);
    setColumnsModified(false);
    setIsEditingColumns(false);
    localStorage.setItem('crmColumns', JSON.stringify(columns));
    
    toast({
      title: "Colunas salvas com sucesso",
      description: "As alterações nas colunas foram salvas.",
      duration: 3000
    });
  };

  return {
    // State
    columns,
    leads,
    filteredLeads,
    activeView,
    searchQuery,
    isEditingColumns,
    newColumnName,
    selectedLead,
    isEditingLead,
    leadToEdit,
    columnsModified,
    administrators,
    
    // State setters
    setActiveView,
    setSearchQuery,
    setNewColumnName,
    setIsEditingColumns,
    setIsEditingLead,

    // Actions
    openLeadDetails,
    openLeadEditForm,
    handleAddNewLead,
    handleSaveLeadEdit,
    addColumn,
    removeColumn,
    handleDragEnd,
    handleColumnReorder,
    startEditingColumns,
    cancelEditingColumns,
    saveColumnChanges
  };
};
