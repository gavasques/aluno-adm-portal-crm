
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash, Filter } from "lucide-react";
import { toast } from "sonner";

import AddToolDialog from "@/components/tools/AddToolDialog";
import ToolsTable from "@/components/tools/ToolsTable";
import ToolDetailDialog from "@/components/tools/ToolDetailDialog";
import { Tool } from "@/components/tools/ToolsTable";

// Mock data for tools
const mockTools = [
  {
    id: 1,
    name: "Shopify",
    category: "E-commerce",
    provider: "Shopify Inc.",
    rating: 4.8,
    comments: 120,
    logo: "S",
    recommended: true,
    description: "Plataforma completa para criar e gerenciar lojas online.",
    website: "https://www.shopify.com",
    phone: "+1 123-456-7890",
    email: "support@shopify.com",
    status: "Ativo",
    coupons: "SHOP10OFF",
    contacts: [
      {
        id: 1,
        name: "John Doe",
        role: "Account Manager",
        email: "john@shopify.com",
        phone: "+1 234-567-8901",
        notes: "Responsável pela região Brasil"
      }
    ],
    comments_list: [
      {
        id: 1,
        user: "Maria Silva",
        text: "Excelente plataforma, fácil de usar e muito completa!",
        date: "2023-05-10",
        likes: 15,
        replies: [
          {
            id: 101,
            user: "João Santos",
            text: "Concordo! O suporte também é muito bom.",
            date: "2023-05-11",
            likes: 3
          }
        ]
      }
    ],
    ratings_list: [
      {
        id: 1,
        user: "Ana Oliveira",
        rating: 5,
        comment: "Uso há 2 anos e recomendo fortemente!",
        date: "2023-04-15",
        likes: 8
      }
    ],
    files: [
      {
        id: 1,
        name: "Guia de Integração.pdf",
        type: "application/pdf",
        size: "2.5 MB",
        date: "2023-03-20"
      }
    ],
    images: [
      {
        id: 1,
        url: "https://placehold.co/600x400",
        alt: "Dashboard Shopify"
      }
    ]
  },
  {
    id: 2,
    name: "WooCommerce",
    category: "E-commerce",
    provider: "Automattic",
    rating: 4.5,
    comments: 95,
    logo: "W",
    recommended: true,
    description: "Plugin de comércio eletrônico para WordPress.",
    website: "https://woocommerce.com",
    phone: "+1 234-567-8901",
    email: "support@woocommerce.com",
    status: "Ativo",
    coupons: "WOO15OFF",
    contacts: [],
    comments_list: [],
    ratings_list: [],
    files: [],
    images: []
  },
  {
    id: 3,
    name: "Magento",
    category: "E-commerce",
    provider: "Adobe",
    rating: 4.2,
    comments: 78,
    logo: "M",
    description: "Plataforma de e-commerce open source.",
    website: "https://magento.com",
    phone: "+1 345-678-9012",
    email: "support@magento.com",
    status: "Inativo",
    coupons: "",
    contacts: [],
    comments_list: [],
    ratings_list: [],
    files: [],
    images: []
  },
  {
    id: 4,
    name: "FFetch",
    category: "Logística",
    provider: "FFetch Inc.",
    rating: 3.8,
    comments: 45,
    logo: "F",
    notRecommended: true,
    description: "Serviço de logística para e-commerce.",
    website: "https://ffetch.com",
    phone: "+1 456-789-0123",
    email: "support@ffetch.com",
    status: "Ativo",
    coupons: "",
    contacts: [],
    comments_list: [],
    ratings_list: [],
    files: [],
    images: []
  }
];

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(mockTools);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  // Filter and sort tools
  useEffect(() => {
    let result = [...tools];

    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerSearchTerm) ||
          tool.description.toLowerCase().includes(lowerSearchTerm) ||
          tool.provider.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((tool) => tool.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      result = result.filter((tool) => {
        if (statusFilter === "Ativo") return tool.status === "Ativo";
        if (statusFilter === "Inativo") return tool.status === "Inativo";
        return true;
      });
    }

    // Apply recommendation filter
    if (recommendationFilter && recommendationFilter !== "all") {
      result = result.filter((tool) => {
        if (recommendationFilter === "Recomendado") return !!tool.recommended;
        if (recommendationFilter === "Não Recomendado") return !!tool.notRecommended;
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      // Handle special case for rating which is a number
      if (sortField === "rating") {
        return sortDirection === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      }

      // For string fields
      const aValue = a[sortField as keyof Tool]?.toString() || "";
      const bValue = b[sortField as keyof Tool]?.toString() || "";
      
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredTools(result);
  }, [
    tools,
    searchTerm,
    categoryFilter,
    statusFilter,
    recommendationFilter,
    sortField,
    sortDirection,
  ]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setRecommendationFilter("all");
    setSortField("name");
    setSortDirection("asc");
  };

  // Sort handling
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open tool detail
  const handleOpenTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsDetailOpen(true);
  };

  // Handle tool update
  const handleUpdateTool = (updatedTool: Tool) => {
    const updatedTools = tools.map((tool) =>
      tool.id === updatedTool.id ? updatedTool : tool
    );
    setTools(updatedTools);
    setSelectedTool(updatedTool);
    toast.success("Ferramenta atualizada com sucesso!");
  };

  // Handle add new tool
  const handleAddTool = (newTool: Tool) => {
    // Generate a new ID (in a real app, the backend would handle this)
    const newId = Math.max(...tools.map((t) => t.id)) + 1;
    const toolWithId = { ...newTool, id: newId };
    
    setTools([...tools, toolWithId]);
    toast.success("Ferramenta adicionada com sucesso!");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ferramentas</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Ferramenta
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as ferramentas por nome, categoria, status ou recomendação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={recommendationFilter}
              onValueChange={setRecommendationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Recomendação" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as recomendações</SelectItem>
                  <SelectItem value="Recomendado">Recomendadas</SelectItem>
                  <SelectItem value="Não Recomendado">Não Recomendadas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center"
            >
              <Trash className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ToolsTable 
            tools={filteredTools}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onOpenTool={handleOpenTool}
          />
        </CardContent>
      </Card>

      {selectedTool && (
        <ToolDetailDialog
          tool={selectedTool}
          isAdmin={true}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onUpdateTool={handleUpdateTool}
        />
      )}

      <AddToolDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTool={handleAddTool}
        categories={categories}
      />
    </div>
  );
};

export default Tools;
