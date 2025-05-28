
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Plus, Search, Users, TrendingUp, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data para demonstração
const MOCK_PARTNERS = [
  {
    id: 1,
    name: "Parceiro Estratégico A",
    type: "Distribuidor",
    category: "E-commerce",
    status: "Ativo",
    rating: 4.8,
    contact: "contato@parceiroa.com.br"
  },
  {
    id: 2,
    name: "Tech Partner Solutions",
    type: "Integrador",
    category: "Tecnologia", 
    status: "Ativo",
    rating: 4.6,
    contact: "vendas@techpartner.com.br"
  },
  {
    id: 3,
    name: "Marketing Plus",
    type: "Agência",
    category: "Marketing",
    status: "Ativo",
    rating: 4.9,
    contact: "hello@marketingplus.com.br"
  }
];

const AdminPartners = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = MOCK_PARTNERS.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPartners = MOCK_PARTNERS.length;
  const activePartners = MOCK_PARTNERS.filter(p => p.status === "Ativo").length;
  const averageRating = MOCK_PARTNERS.reduce((acc, p) => acc + p.rating, 0) / MOCK_PARTNERS.length;
  const topCategories = [...new Set(MOCK_PARTNERS.map(p => p.category))].length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parceiros (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todos os parceiros do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Parceiro
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
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalPartners}</div>
                    <div className="text-sm text-gray-600">Total de Parceiros</div>
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
                    <div className="text-2xl font-bold text-gray-900">{activePartners}</div>
                    <div className="text-sm text-gray-600">Parceiros Ativos</div>
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
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{topCategories}</div>
                    <div className="text-sm text-gray-600">Categorias</div>
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
            Buscar Parceiros
          </CardTitle>
          <CardDescription>
            Encontre parceiros por nome, tipo ou categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Nome do parceiro..." 
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
            <BarChart className="h-5 w-5 mr-2" />
            Lista de Parceiros
            <Badge variant="secondary" className="ml-2">
              {filteredPartners.length} de {totalPartners}
            </Badge>
          </CardTitle>
          <CardDescription>
            Todos os parceiros cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Nenhum parceiro encontrado' : 'Nenhum parceiro cadastrado'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Tente ajustar os filtros de busca' : 'Adicione o primeiro parceiro para começar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Nome</th>
                    <th className="text-left p-4">Tipo</th>
                    <th className="text-left p-4">Categoria</th>
                    <th className="text-left p-4">Avaliação</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Contato</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{partner.name}</td>
                      <td className="p-4">{partner.type}</td>
                      <td className="p-4">{partner.category}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {partner.rating}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={partner.status === 'Ativo' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{partner.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
