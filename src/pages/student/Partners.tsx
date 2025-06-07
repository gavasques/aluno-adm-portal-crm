
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, Search, Star, ExternalLink, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Partner {
  id: number;
  name: string;
  category: string;
  type: string;
  rating: number;
  description: string;
  website?: string;
  location: string;
  logo?: string;
  status: "Ativo" | "Inativo";
}

const INITIAL_PARTNERS: Partner[] = [
  {
    id: 1,
    name: "TechCorp",
    category: "Tecnologia",
    type: "Parceiro Estratégico",
    rating: 4.9,
    description: "Especializada em soluções tecnológicas inovadoras",
    website: "https://techcorp.com",
    location: "São Paulo, SP",
    logo: "TC",
    status: "Ativo"
  },
  {
    id: 2,
    name: "EduSolutions",
    category: "Educação",
    type: "Parceiro Educacional",
    rating: 4.7,
    description: "Plataforma educacional com foco em capacitação profissional",
    website: "https://edusolutions.com",
    location: "Rio de Janeiro, RJ",
    logo: "ES",
    status: "Ativo"
  }
];

const StudentPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregamento rápido sem delay
    setPartners(INITIAL_PARTNERS);
    setFilteredPartners(INITIAL_PARTNERS);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(partner =>
        partner.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    setFilteredPartners(filtered);
  }, [searchTerm, categoryFilter, partners]);

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
          <h1 className="text-3xl font-bold tracking-tight">Parceiros</h1>
          <p className="text-muted-foreground">
            Conheça nossos parceiros estratégicos
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Carregando parceiros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parceiros</h1>
        <p className="text-muted-foreground">
          Conheça nossos parceiros estratégicos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Parceiros
          </CardTitle>
          <CardDescription>
            Encontre parceiros por nome ou categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Digite o nome do parceiro..." 
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
              <Handshake className="h-5 w-5 mr-2" />
              Lista de Parceiros
            </div>
            <Badge variant="secondary">{filteredPartners.length} encontrados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <Handshake className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum parceiro encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPartners.map((partner) => (
                <Card key={partner.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-lg">
                            {partner.logo || partner.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {partner.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <Badge variant="outline">{partner.category}</Badge>
                            <Badge variant="outline">{partner.type}</Badge>
                            <Badge variant={partner.status === 'Ativo' ? 'default' : 'secondary'}>
                              {partner.status}
                            </Badge>
                          </div>
                          {renderStars(partner.rating)}
                          <p className="text-sm text-gray-600 mt-2 mb-3">
                            {partner.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {partner.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {partner.location}
                              </div>
                            )}
                            {partner.website && (
                              <div className="flex items-center text-blue-600">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                {partner.website}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visitar
                        </Button>
                        <Button size="sm">
                          Ver Detalhes
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

export default StudentPartners;
