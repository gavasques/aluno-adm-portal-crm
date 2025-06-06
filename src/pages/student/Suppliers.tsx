
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Star, MapPin, Globe, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { INITIAL_SUPPLIERS } from '@/data/suppliersData';
import { Supplier } from '@/types/supplier.types';

const StudentSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setSuppliers(INITIAL_SUPPLIERS);
      setFilteredSuppliers(INITIAL_SUPPLIERS);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(supplier =>
        supplier.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    setFilteredSuppliers(filtered);
  }, [searchTerm, categoryFilter, suppliers]);

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
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Explore a base de fornecedores disponíveis
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Carregando fornecedores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
        <p className="text-muted-foreground">
          Explore a base de fornecedores disponíveis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Fornecedores
          </CardTitle>
          <CardDescription>
            Encontre fornecedores por nome, categoria ou localização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Digite o nome do fornecedor..." 
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
              <Users className="h-5 w-5 mr-2" />
              Lista de Fornecedores
            </div>
            <Badge variant="secondary">{filteredSuppliers.length} encontrados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum fornecedor encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {supplier.logo || supplier.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {supplier.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <Badge variant="outline">{supplier.category}</Badge>
                            <Badge variant="outline">{supplier.type}</Badge>
                          </div>
                          {renderStars(supplier.rating)}
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {supplier.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {supplier.email}
                              </div>
                            )}
                            {supplier.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {supplier.phone}
                              </div>
                            )}
                            {supplier.website && (
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2" />
                                {supplier.website}
                              </div>
                            )}
                            {supplier.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {supplier.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button size="sm">
                          Adicionar aos Meus
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

export default StudentSuppliers;
