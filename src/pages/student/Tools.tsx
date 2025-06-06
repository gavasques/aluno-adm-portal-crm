
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Search, Star, ExternalLink, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Tool {
  id: number;
  name: string;
  category: string;
  type: string;
  rating: number;
  description: string;
  website?: string;
  price: string;
  logo?: string;
  status: "Ativo" | "Inativo";
}

const INITIAL_TOOLS: Tool[] = [
  {
    id: 1,
    name: "Figma",
    category: "Design",
    type: "Software Online",
    rating: 4.9,
    description: "Ferramenta de design colaborativo para interface e prototipagem",
    website: "https://figma.com",
    price: "Gratuito/Pago",
    logo: "FG",
    status: "Ativo"
  },
  {
    id: 2,
    name: "Notion",
    category: "Produtividade",
    type: "Software Online",
    rating: 4.7,
    description: "Workspace tudo-em-um para notas, tarefas e colaboração",
    website: "https://notion.so",
    price: "Gratuito/Pago",
    logo: "NT",
    status: "Ativo"
  },
  {
    id: 3,
    name: "Slack",
    category: "Comunicação",
    type: "Software Online",
    rating: 4.6,
    description: "Plataforma de comunicação e colaboração em equipe",
    website: "https://slack.com",
    price: "Gratuito/Pago",
    logo: "SL",
    status: "Ativo"
  },
  {
    id: 4,
    name: "Canva",
    category: "Design",
    type: "Software Online",
    rating: 4.5,
    description: "Editor gráfico online para criação de designs",
    website: "https://canva.com",
    price: "Gratuito/Pago",
    logo: "CV",
    status: "Ativo"
  }
];

const StudentTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregamento rápido sem delay
    setTools(INITIAL_TOOLS);
    setFilteredTools(INITIAL_TOOLS);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = tools;

    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(tool =>
        tool.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    setFilteredTools(filtered);
  }, [searchTerm, categoryFilter, tools]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ferramentas</h1>
          <p className="text-muted-foreground">
            Explore as ferramentas disponíveis
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Carregando ferramentas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ferramentas</h1>
        <p className="text-muted-foreground">
          Explore as ferramentas disponíveis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Ferramentas
          </CardTitle>
          <CardDescription>
            Encontre ferramentas por nome ou categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Digite o nome da ferramenta..." 
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input 
              placeholder="Categoria..." 
              className="w-48"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Lista de Ferramentas
            </div>
            <Badge variant="secondary">{filteredTools.length} encontradas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTools.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ferramenta encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-lg">
                            {tool.logo || tool.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <Badge variant="outline">{tool.category}</Badge>
                            <Badge variant="outline">{tool.type}</Badge>
                            <Badge variant="outline">{tool.price}</Badge>
                          </div>
                          {renderStars(tool.rating)}
                          <p className="text-sm text-gray-600 mt-2 mb-3">
                            {tool.description}
                          </p>
                          {tool.website && (
                            <div className="flex items-center text-sm text-blue-600">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {tool.website}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTools;
