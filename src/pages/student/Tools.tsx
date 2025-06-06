
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Search, Star, ExternalLink, DollarSign, Zap } from 'lucide-react';
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
  price?: string;
  features: string[];
  logo?: string;
  isPopular?: boolean;
  isFree?: boolean;
}

const INITIAL_TOOLS: Tool[] = [
  {
    id: 1,
    name: "Figma",
    category: "Design",
    type: "Design de Interface",
    rating: 4.9,
    description: "Ferramenta colaborativa de design de interface e prototipagem",
    website: "https://figma.com",
    price: "Gratuito / $12/mês",
    features: ["Design colaborativo", "Prototipagem", "Componentes", "Versionamento"],
    logo: "FG",
    isPopular: true,
    isFree: true
  },
  {
    id: 2,
    name: "Slack",
    category: "Comunicação",
    type: "Comunicação em Equipe",
    rating: 4.7,
    description: "Plataforma de comunicação para equipes e organizações",
    website: "https://slack.com",
    price: "Gratuito / $6.67/mês",
    features: ["Canais organizados", "Mensagens diretas", "Integrações", "Chamadas"],
    logo: "SL",
    isPopular: true,
    isFree: true
  },
  {
    id: 3,
    name: "Notion",
    category: "Produtividade",
    type: "Gestão de Conhecimento",
    rating: 4.8,
    description: "Workspace all-in-one para notas, docs, wikis e projetos",
    website: "https://notion.so",
    price: "Gratuito / $8/mês",
    features: ["Banco de dados", "Templates", "Colaboração", "API"],
    logo: "NO",
    isPopular: true,
    isFree: true
  },
  {
    id: 4,
    name: "Canva",
    category: "Design",
    type: "Design Gráfico",
    rating: 4.6,
    description: "Plataforma de design gráfico online com templates prontos",
    website: "https://canva.com",
    price: "Gratuito / $14.99/mês",
    features: ["Templates prontos", "Editor drag-and-drop", "Biblioteca de imagens", "Colaboração"],
    logo: "CV",
    isFree: true
  },
  {
    id: 5,
    name: "Trello",
    category: "Produtividade",
    type: "Gestão de Projetos",
    rating: 4.5,
    description: "Ferramenta de gestão de projetos baseada em quadros Kanban",
    website: "https://trello.com",
    price: "Gratuito / $5/mês",
    features: ["Quadros Kanban", "Cards e listas", "Power-ups", "Timeline"],
    logo: "TR",
    isFree: true
  }
];

const StudentTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTools(INITIAL_TOOLS);
      setFilteredTools(INITIAL_TOOLS);
      setIsLoading(false);
    }, 1000);
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
            Descubra ferramentas úteis para seu negócio
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
          Descubra ferramentas úteis para seu negócio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Ferramentas
          </CardTitle>
          <CardDescription>
            Encontre ferramentas por nome, categoria ou funcionalidade
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
                <Card key={tool.id} className="hover:shadow-lg transition-shadow relative">
                  {tool.isPopular && (
                    <Badge className="absolute -top-2 left-4 bg-orange-500">
                      <Zap className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-lg">
                            {tool.logo || tool.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {tool.name}
                            </h3>
                            {tool.isFree && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Gratuito
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <Badge variant="outline">{tool.category}</Badge>
                            <Badge variant="outline">{tool.type}</Badge>
                          </div>
                          {renderStars(tool.rating)}
                          <p className="text-sm text-gray-600 mt-2 mb-3">
                            {tool.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {tool.price}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tool.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tool.features.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        {tool.website && (
                          <Button size="sm" asChild>
                            <a href={tool.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Acessar
                            </a>
                          </Button>
                        )}
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
