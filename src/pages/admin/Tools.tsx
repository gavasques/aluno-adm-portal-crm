
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Plus, Search, Settings, TrendingUp, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data para demonstração
const MOCK_TOOLS = [
  {
    id: 1,
    name: "E-commerce Manager Pro",
    category: "E-commerce",
    provider: "TechSolutions",
    status: "Ativo",
    rating: 4.7,
    recommended: true,
    price: "R$ 199/mês"
  },
  {
    id: 2,
    name: "Analytics Dashboard",
    category: "Analytics",
    provider: "DataPro",
    status: "Ativo", 
    rating: 4.9,
    recommended: true,
    price: "R$ 99/mês"
  },
  {
    id: 3,
    name: "Social Media Automation",
    category: "Marketing",
    provider: "SocialTools",
    status: "Ativo",
    rating: 4.5,
    recommended: false,
    price: "R$ 149/mês"
  },
  {
    id: 4,
    name: "Inventory Control System",
    category: "Gestão",
    provider: "ManagePro",
    status: "Ativo",
    rating: 4.6,
    recommended: true,
    price: "R$ 299/mês"
  }
];

const AdminTools = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = MOCK_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTools = MOCK_TOOLS.length;
  const activeTools = MOCK_TOOLS.filter(t => t.status === "Ativo").length;
  const recommendedTools = MOCK_TOOLS.filter(t => t.recommended).length;
  const averageRating = MOCK_TOOLS.reduce((acc, t) => acc + t.rating, 0) / MOCK_TOOLS.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ferramentas (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todas as ferramentas do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ferramenta
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
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
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
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
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
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
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{recommendedTools}</div>
                    <div className="text-sm text-gray-600">Recomendadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Ferramentas
          </CardTitle>
          <CardDescription>
            Encontre ferramentas por nome, categoria ou fornecedor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Nome da ferramenta..." 
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Lista de Ferramentas
            <Badge variant="secondary" className="ml-2">
              {filteredTools.length} de {totalTools}
            </Badge>
          </CardTitle>
          <CardDescription>
            Todas as ferramentas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTools.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Nenhuma ferramenta encontrada' : 'Nenhuma ferramenta cadastrada'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Tente ajustar os filtros de busca' : 'Adicione a primeira ferramenta para começar'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -2 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">{tool.name}</h3>
                    </div>
                    {tool.recommended && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Star className="h-3 w-3 mr-1" />
                        Recomendada
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-medium">{tool.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fornecedor:</span>
                      <span className="font-medium">{tool.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avaliação:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{tool.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-medium text-green-600">{tool.price}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <Badge variant={tool.status === 'Ativo' ? 'default' : 'secondary'}>
                      {tool.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;
