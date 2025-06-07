
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  Wrench, 
  TrendingUp, 
  Star,
  ExternalLink,
  Package,
  Zap
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

// Mock data para demonstração
const mockTools = [
  {
    id: 1,
    name: "Notion",
    category: "Produtividade",
    type: "Software",
    description: "Workspace all-in-one para notas, tarefas e colaboração",
    rating: 4.8,
    price: "Freemium",
    website: "www.notion.so",
    tags: ["Notas", "Projetos", "Colaboração"],
    status: "Ativo",
    featured: true
  },
  {
    id: 2,
    name: "Figma",
    category: "Design",
    type: "Software",
    description: "Ferramenta de design colaborativo para UI/UX",
    rating: 4.9,
    price: "Gratuito",
    website: "www.figma.com",
    tags: ["UI/UX", "Prototipagem", "Colaboração"],
    status: "Ativo",
    featured: true
  },
  {
    id: 3,
    name: "Google Analytics",
    category: "Análise",
    type: "Software",
    description: "Análise completa de dados web e comportamento do usuário",
    rating: 4.7,
    price: "Gratuito",
    website: "analytics.google.com",
    tags: ["Analytics", "Web", "Dados"],
    status: "Ativo",
    featured: false
  },
  {
    id: 4,
    name: "Mailchimp",
    category: "Marketing",
    type: "Software",
    description: "Plataforma de email marketing e automação",
    rating: 4.6,
    price: "Freemium",
    website: "www.mailchimp.com",
    tags: ["Email", "Automação", "Marketing"],
    status: "Ativo",
    featured: false
  },
  {
    id: 5,
    name: "VS Code",
    category: "Desenvolvimento",
    type: "Software",
    description: "Editor de código gratuito com extensões poderosas",
    rating: 4.9,
    price: "Gratuito",
    website: "code.visualstudio.com",
    tags: ["Código", "Editor", "Extensões"],
    status: "Ativo",
    featured: true
  }
];

const ToolsPage = () => {
  const [tools, setTools] = useState(mockTools);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(tool.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tool.type);
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [tools, searchQuery, selectedCategories, selectedTypes]);

  // Stats
  const totalTools = tools.length;
  const activeTools = tools.filter(t => t.status === "Ativo").length;
  const featuredTools = tools.filter(t => t.featured).length;
  const averageRating = tools.reduce((acc, t) => acc + t.rating, 0) / tools.length;
  const categories = [...new Set(tools.map(t => t.category))].length;

  const handleEditTool = (tool: any) => {
    console.log('Edit tool:', tool);
    // Implementar modal de edição
  };

  const handleDeleteTool = (toolId: number) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
  };

  const toggleFeaturedStatus = (toolId: number) => {
    setTools(prev => prev.map(t => 
      t.id === toolId ? { ...t, featured: !t.featured } : t
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Ferramentas
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as ferramentas cadastradas na plataforma
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ferramenta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalTools}</div>
                  <div className="text-sm text-gray-600">Total de Ferramentas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{activeTools}</div>
                  <div className="text-sm text-gray-600">Ferramentas Ativas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avaliação Média</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{featuredTools}</div>
                  <div className="text-sm text-gray-600">Em Destaque</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar ferramentas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tools Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Ferramentas
              <Badge variant="secondary" className="ml-2">
                {filteredTools.length} de {totalTools}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma ferramenta encontrada com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-gray-500" />
                            {tool.name}
                            {tool.featured && (
                              <Badge className="bg-yellow-500 text-white">Destaque</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{tool.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tool.price}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{tool.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tool.status === 'Ativo' ? 'default' : 'secondary'}>
                            {tool.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`https://${tool.website}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditTool(tool)}>
                                  <Pencil className="h-4 w-4 mr-2" /> Editar ferramenta
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => toggleFeaturedStatus(tool.id)}>
                                  {tool.featured ? "Remover destaque" : "Marcar como destaque"}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTool(tool.id)}
                                  className="text-red-500"
                                >
                                  <Trash className="h-4 w-4 mr-2" /> Excluir ferramenta
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
