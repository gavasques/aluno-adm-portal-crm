
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Star, MapPin, Globe } from 'lucide-react';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const suppliers = [
    {
      id: 1,
      name: "TechSolutions Corp",
      category: "Tecnologia",
      rating: 4.8,
      location: "São Paulo, SP",
      website: "www.techsolutions.com",
      description: "Soluções completas em tecnologia para empresas"
    },
    {
      id: 2,
      name: "Marketing Digital Plus",
      category: "Marketing",
      rating: 4.6,
      location: "Rio de Janeiro, RJ",
      website: "www.mdplus.com",
      description: "Agência especializada em marketing digital e growth"
    },
    {
      id: 3,
      name: "LogiTransporte",
      category: "Logística",
      rating: 4.7,
      location: "Belo Horizonte, MG",
      website: "www.logitransporte.com",
      description: "Soluções logísticas e transporte nacional"
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600">Encontre fornecedores qualificados para seu negócio</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {supplier.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {supplier.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{supplier.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{supplier.description}</CardDescription>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {supplier.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  {supplier.website}
                </div>
              </div>

              <Button className="w-full">Ver Detalhes</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
          <p className="text-gray-600">Tente ajustar seus critérios de busca</p>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
