
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Wrench, ExternalLink, Star, Filter } from 'lucide-react';

const Tools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Produtividade', 'Design', 'Marketing', 'Desenvolvimento', 'Análise'];

  const tools = [
    {
      id: 1,
      name: "Notion",
      category: "Produtividade",
      description: "Workspace all-in-one para notas, tarefas e colaboração",
      rating: 4.8,
      price: "Freemium",
      tags: ["Notas", "Projetos", "Colaboração"]
    },
    {
      id: 2,
      name: "Figma",
      category: "Design",
      description: "Ferramenta de design colaborativo para UI/UX",
      rating: 4.9,
      price: "Gratuito",
      tags: ["UI/UX", "Prototipagem", "Colaboração"]
    },
    {
      id: 3,
      name: "Google Analytics",
      category: "Análise",
      description: "Análise completa de dados web e comportamento do usuário",
      rating: 4.7,
      price: "Gratuito",
      tags: ["Analytics", "Web", "Dados"]
    },
    {
      id: 4,
      name: "Mailchimp",
      category: "Marketing",
      description: "Plataforma de email marketing e automação",
      rating: 4.6,
      price: "Freemium",
      tags: ["Email", "Automação", "Marketing"]
    },
    {
      id: 5,
      name: "VS Code",
      category: "Desenvolvimento",
      description: "Editor de código gratuito com extensões poderosas",
      rating: 4.9,
      price: "Gratuito",
      tags: ["Código", "Editor", "Extensões"]
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ferramentas</h1>
          <p className="text-gray-600">Explore ferramentas essenciais para seu negócio</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {tool.name}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {tool.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{tool.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{tool.description}</CardDescription>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{tool.price}</Badge>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Ferramenta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ferramenta encontrada</h3>
          <p className="text-gray-600">Tente ajustar seus critérios de busca</p>
        </div>
      )}
    </div>
  );
};

export default Tools;
