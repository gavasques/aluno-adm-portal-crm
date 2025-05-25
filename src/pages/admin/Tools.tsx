import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
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
    canal: "Ecommerce",
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
    canal: "Amazon",
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
    canal: "Magalu",
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
    canal: "Meli",
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
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [recommendedFilter, setRecommendedFilter] = useState<string>("all");

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Geral ADM', href: '/admin/geral' },
    { label: 'Ferramentas' }
  ];

  useEffect(() => {
    let result = [...tools];

    if (searchQuery) {
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((tool) => tool.category === categoryFilter);
    }

    if (recommendedFilter !== "all") {
      result = result.filter((tool) => {
        if (recommendedFilter === "recommended") {
          return tool.recommended;
        } else if (recommendedFilter === "not_recommended") {
          return tool.notRecommended;
        }
        return true;
      });
    }

    setFilteredTools(result);
  }, [tools, searchQuery, categoryFilter, recommendedFilter]);

  const handleUpdateTool = (updatedTool: Tool) => {
    const updatedTools = tools.map((tool) =>
      tool.id === updatedTool.id ? updatedTool : tool
    );
    setTools(updatedTools);
    setSelectedTool(updatedTool);
    toast.success("Ferramenta atualizada com sucesso!");
  };

  const handleAddTool = (newTool: Tool) => {
    setTools([...tools, newTool]);
    toast.success("Ferramenta adicionada com sucesso!");
  };

  // Get unique categories from tools
  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/geral"
        className="mb-6"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Ferramentas</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Ferramenta
        </Button>
      </div>
      
      <AddToolDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTool={handleAddTool}
        categories={categories}
      />
      
      <ToolDetailDialog 
        tool={selectedTool}
        isAdmin={true}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
        onUpdateTool={handleUpdateTool}
      />
    </div>
  );
};

export default Tools;
