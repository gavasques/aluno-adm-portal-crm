
import { useState, useMemo } from "react";
import { Tool } from "@/components/tools/ToolsTable";

// Dados de exemplo para ferramentas
const TOOLS: Tool[] = [
  {
    id: 1,
    name: "ERP Commerce",
    category: "Gestão Empresarial",
    provider: "Sistema ERP",
    rating: 4.7,
    comments: 18,
    logo: "EC",
    recommended: true,
    notRecommended: false,
    canal: "Ecommerce",
    description: "Software integrado para gerenciamento de lojas online e físicas.",
    website: "www.erpcommerce.com.br",
    phone: "(11) 9999-8888",
    email: "contato@erpcommerce.com.br",
    status: "Ativo",
    coupons: "DESCONTO10 - 10% de desconto\nPROMO2025 - 3 meses grátis",
    contacts: [
      { id: 1, name: "João Silva", role: "Gestor de Contas", email: "joao@erpcommerce.com.br", phone: "(11) 97777-6666", notes: "Disponível para suporte técnico." },
      { id: 2, name: "Maria Oliveira", role: "Suporte", email: "maria@erpcommerce.com.br", phone: "(11) 96666-5555", notes: "Especialista em implementação." }
    ],
    comments_list: [
      { id: 1, user: "Carlos Mendes", text: "Vocês recomendam essa ferramenta para uma loja média com cerca de 500 produtos?", date: "15/05/2025", likes: 2, replies: [
        { id: 101, user: "Ana Costa", text: "Sim, utilizamos para uma loja com 600 produtos e funciona muito bem!", date: "16/05/2025", likes: 1 }
      ]},
      { id: 2, user: "Pedro Santos", text: "Alguém sabe se tem integração com o ERP XYZ?", date: "10/05/2025", likes: 0, replies: [] }
    ],
    ratings_list: [
      { id: 1, user: "João Silva", rating: 5, comment: "Excelente ferramenta, atendeu todas as necessidades do meu negócio.", date: "18/04/2025", likes: 3 },
      { id: 2, user: "Maria Oliveira", rating: 4, comment: "Bom custo-benefício, mas poderia ter mais recursos de marketing.", date: "10/04/2025", likes: 1 }
    ],
    files: [
      { id: 1, name: "Manual do Usuário.pdf", type: "application/pdf", size: "2.5 MB", date: "05/04/2025" },
      { id: 2, name: "Planilha de Integração.xlsx", type: "application/xlsx", size: "1.8 MB", date: "02/04/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Dashboard+ERP", alt: "Dashboard ERP" },
      { id: 2, url: "https://placehold.co/600x400?text=Relatórios", alt: "Relatórios" }
    ]
  },
  {
    id: 2,
    name: "Email Marketing Pro",
    category: "Marketing",
    provider: "Marketing Digital",
    rating: 4.5,
    comments: 12,
    logo: "EM",
    recommended: false,
    notRecommended: true,
    canal: "Amazon",
    description: "Ferramenta completa de automação de email marketing.",
    website: "www.emailmarketingpro.com",
    phone: "(11) 8888-7777",
    email: "contato@emailmarketingpro.com",
    status: "Ativo",
    coupons: "WELCOME20 - 20% de desconto no primeiro mês",
    contacts: [
      { id: 1, name: "Ricardo Almeida", role: "Suporte Técnico", email: "ricardo@emailmarketingpro.com", phone: "(11) 95555-4444", notes: "Especialista em integrações." }
    ],
    comments_list: [
      { id: 1, user: "Juliana Mendes", text: "Qual o limite de envio mensal no plano básico?", date: "12/05/2025", likes: 1, replies: [
        { id: 101, user: "Roberto Almeida", text: "No plano básico são 10.000 emails por mês.", date: "13/05/2025", likes: 0 }
      ]}
    ],
    ratings_list: [
      { id: 1, user: "Carlos Santos", rating: 3, comment: "Funciona bem, mas tem muitas limitações no plano básico.", date: "20/04/2025", likes: 2 }
    ],
    files: [
      { id: 1, name: "Comparativo de Planos.pdf", type: "application/pdf", size: "1.2 MB", date: "15/03/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Interface+Email", alt: "Interface de Email" }
    ]
  },
  {
    id: 3,
    name: "Gestor de Estoque",
    category: "Logística",
    provider: "Supply Chain Co.",
    rating: 4.2,
    comments: 9,
    logo: "GE",
    recommended: true,
    notRecommended: false,
    canal: "Magalu",
    description: "Controle completo de estoque para e-commerce.",
    website: "www.gestordeestoque.com.br",
    phone: "(11) 7777-6666",
    email: "contato@gestordeestoque.com.br",
    status: "Ativo",
    coupons: "ESTOQUE15 - 15% de desconto nos planos anuais",
    contacts: [
      { id: 1, name: "Fernanda Lima", role: "Consultora", email: "fernanda@gestordeestoque.com.br", phone: "(11) 94444-3333", notes: "Especialista em implementação para e-commerces." }
    ],
    comments_list: [
      { id: 1, user: "Amanda Costa", text: "A ferramenta permite integração com marketplaces?", date: "08/05/2025", likes: 3, replies: [] }
    ],
    ratings_list: [
      { id: 1, user: "Marcelo Oliveira", rating: 4, comment: "Ótima ferramenta para gestão de múltiplos estoques.", date: "25/04/2025", likes: 1 }
    ],
    files: [
      { id: 1, name: "Guia de Integração.pdf", type: "application/pdf", size: "3.5 MB", date: "20/03/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Dashboard+Estoque", alt: "Dashboard de Estoque" },
      { id: 2, url: "https://placehold.co/600x400?text=Relatório+de+Inventário", alt: "Relatório de Inventário" }
    ]
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    category: "Análise de Dados",
    provider: "Data Insights",
    rating: 4.8,
    comments: 15,
    logo: "AD",
    recommended: true,
    notRecommended: false,
    canal: "Shopee",
    description: "Dashboard completo para análise de dados de e-commerce.",
    website: "www.analyticsdashboard.com",
    phone: "(11) 6666-5555",
    email: "contato@analyticsdashboard.com",
    status: "Ativo",
    coupons: "ANALYTICS10 - 10% de desconto em qualquer plano",
    contacts: [
      { id: 1, name: "Roberto Santos", role: "Analista de Dados", email: "roberto@analyticsdashboard.com", phone: "(11) 93333-2222", notes: "Especialista em implementação e treinamento." }
    ],
    comments_list: [
      { id: 1, user: "Luciana Silva", text: "É possível integrar com o Google Analytics?", date: "05/05/2025", likes: 2, replies: [
        { id: 101, user: "Paulo Mendes", text: "Sim, a integração é nativa e muito fácil de configurar.", date: "06/05/2025", likes: 1 }
      ]}
    ],
    ratings_list: [
      { id: 1, user: "Camila Ferreira", rating: 5, comment: "Excelente ferramenta para análise de dados, interface intuitiva e relatórios completos.", date: "30/04/2025", likes: 4 }
    ],
    files: [
      { id: 1, name: "Manual de Integrações.pdf", type: "application/pdf", size: "2.8 MB", date: "15/03/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Dashboard+Analytics", alt: "Dashboard Analytics" },
      { id: 2, url: "https://placehold.co/600x400?text=Relatório+de+Conversão", alt: "Relatório de Conversão" }
    ]
  }
];

export const useTools = (isAdmin: boolean) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [softwareTypeFilter, setSoftwareTypeFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [canalFilter, setCanalFilter] = useState("all"); // New canal filter
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  
  // Get unique canals
  const canals = useMemo(() => {
    const uniqueCanals = Array.from(new Set(tools.filter(tool => tool.canal).map(tool => tool.canal))) as string[];
    return uniqueCanals;
  }, [tools]);
  
  // Handler para ordenação
  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };
  
  // Handler para atualizar ferramenta
  const handleUpdateTool = (updatedTool: Tool) => {
    setTools(tools.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ));
    setSelectedTool(updatedTool);
  };
  
  // Filtrar e ordenar ferramentas com base na consulta de pesquisa e filtros
  const filteredTools = useMemo(() => {
    return tools
      .filter(tool => {
        // Filtro de pesquisa
        const matchesSearch = 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filtro por tipo
        const matchesType = 
          softwareTypeFilter === "all" || 
          tool.category === softwareTypeFilter;
        
        // Filtro por recomendação
        const matchesRecommendation = 
          recommendationFilter === "all" || 
          (recommendationFilter === "recommended" && tool.recommended) ||
          (recommendationFilter === "not-recommended" && tool.notRecommended);
          
        // Filtro por canal
        const matchesCanal =
          canalFilter === "all" ||
          tool.canal === canalFilter;
        
        return matchesSearch && matchesType && matchesRecommendation && matchesCanal;
      })
      .sort((a, b) => {
        let valA, valB;
        
        switch (sortField) {
          case "name":
            valA = a.name;
            valB = b.name;
            break;
          case "category":
            valA = a.category;
            valB = b.category;
            break;
          case "provider":
            valA = a.provider;
            valB = b.provider;
            break;
          case "rating":
            valA = a.rating;
            valB = b.rating;
            break;
          default:
            valA = a.name;
            valB = b.name;
        }
        
        if (sortDirection === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [searchQuery, softwareTypeFilter, recommendationFilter, canalFilter, sortField, sortDirection, tools]);
  
  return {
    searchQuery,
    setSearchQuery,
    softwareTypeFilter,
    setSoftwareTypeFilter,
    recommendationFilter,
    setRecommendationFilter,
    canalFilter, // New canal filter
    setCanalFilter, // New canal filter setter
    canals, // Available canals list
    sortField,
    sortDirection,
    handleSort,
    selectedTool,
    setSelectedTool,
    tools,
    setTools,
    filteredTools,
    handleUpdateTool,
    isAdmin
  };
};
