
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MessageCircle, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Sample data for tools
const TOOLS = [
  {
    id: 1,
    name: "ERP Commerce",
    category: "Gestão Empresarial",
    provider: "Sistema ERP",
    rating: 4.7,
    comments: 18,
    logo: "EC",
    price: "R$ 249,90/mês",
    recommended: true,
    notRecommended: false,
    description: "Software integrado para gerenciamento de lojas online e físicas."
  },
  {
    id: 2,
    name: "Email Marketing Pro",
    category: "Marketing",
    provider: "Marketing Digital",
    rating: 4.5,
    comments: 12,
    logo: "EM",
    price: "R$ 99,00/mês",
    recommended: false,
    notRecommended: true,
    description: "Ferramenta completa de automação de email marketing."
  },
  {
    id: 3,
    name: "Gestor de Estoque",
    category: "Logística",
    provider: "Supply Chain Co.",
    rating: 4.2,
    comments: 9,
    logo: "GE",
    price: "R$ 199,00/mês",
    recommended: true,
    notRecommended: false,
    description: "Controle completo de estoque para e-commerce."
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    category: "Análise de Dados",
    provider: "Data Insights",
    rating: 4.8,
    comments: 15,
    logo: "AD",
    price: "R$ 149,00/mês",
    recommended: true,
    notRecommended: false,
    description: "Dashboard completo para análise de dados de e-commerce."
  },
];

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [softwareTypeFilter, setSoftwareTypeFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTool, setSelectedTool] = useState(null);
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleOpenTool = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleCloseTool = () => {
    setSelectedTool(null);
  };
  
  // Filter and sort tools based on search query and filters
  const filteredTools = useMemo(() => {
    return TOOLS
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
        
        return matchesSearch && matchesType && matchesRecommendation;
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
  }, [searchQuery, softwareTypeFilter, recommendationFilter, sortField, sortDirection]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Ferramentas</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Ferramentas</CardTitle>
          <CardDescription>
            Encontre as melhores ferramentas para seu e-commerce.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar ferramentas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Ferramenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Recomendação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="recommended">Recomendadas</SelectItem>
                  <SelectItem value="not-recommended">Não Recomendadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    Nome
                    {sortField === "name" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    Categoria
                    {sortField === "category" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("provider")}>
                    Fornecedor
                    {sortField === "provider" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                    Avaliação
                    {sortField === "rating" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">
                      {tool.name}
                      <div className="flex gap-2 mt-1">
                        {tool.recommended && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Recomendada
                          </Badge>
                        )}
                        {tool.notRecommended && (
                          <Badge variant="destructive">
                            Não Recomendado (Corre)
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {tool.price}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{tool.rating}</span>
                        <span className="text-gray-400 ml-1">({tool.comments})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenTool(tool)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma ferramenta encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para detalhes da ferramenta */}
      {selectedTool && (
        <Dialog open={!!selectedTool} onOpenChange={handleCloseTool}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-portal-accent text-white flex items-center justify-center text-lg font-bold mr-2">
                  {selectedTool.logo}
                </div>
                {selectedTool.name}
                <div className="flex gap-2 ml-4">
                  {selectedTool.recommended && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Recomendada
                    </Badge>
                  )}
                  {selectedTool.notRecommended && (
                    <Badge variant="destructive">
                      Não Recomendado (Corre)
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Dados da Ferramenta</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedTool.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                          <p className="mt-1 text-base">{selectedTool.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
                          <p className="mt-1 text-base">{selectedTool.provider}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Preço</h3>
                          <p className="mt-1 text-base">{selectedTool.price}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Avaliação</h3>
                          <div className="mt-1 flex items-center">
                            <span className="mr-2">{selectedTool.rating}/5</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= Math.round(selectedTool.rating) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedTool.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center py-6 text-gray-500">
                        Detalhes das avaliações serão mostrados aqui.
                      </div>
                      
                      <div className="mt-4">
                        <Button className="w-full">Adicionar Avaliação</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comments">
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center py-6 text-gray-500">
                        Comentários serão mostrados aqui.
                      </div>
                      
                      <div className="mt-4">
                        <textarea 
                          className="w-full border rounded-md p-2 min-h-[100px]" 
                          placeholder="Digite seu comentário..."
                        />
                        <Button className="mt-2">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Enviar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseTool}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tools;
